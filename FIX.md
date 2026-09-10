# FIX.md — Issues & Improvements Report

> Generated from full codebase review of `life-share-backend-a6`
> Organized by severity with file paths and line numbers.

---

## Table of Contents

- [Critical Bugs](#critical-bugs)
- [Security Issues](#security-issues)
- [Logic / Business Rule Issues](#logic--business-rule-issues)
- [Pagination / Query Issues](#pagination--query-issues)
- [Code Quality / Consistency](#code-quality--consistency)
- [Infrastructure Gaps](#infrastructure-gaps)

---

## Critical Bugs

### 1. Auth middleware uses `&&` instead of `||`

**File:** `src/app/middlewares/auth.ts:57`

```ts
// Current (WRONG)
if (!user.is_active && user.is_blocked)

// Should be
if (!user.is_active || user.is_blocked)
```

**Impact:** A user who is only blocked OR only inactive can still access protected resources. Both conditions must be true to reject, which is almost never the case.

---

### 2. Booking router duplicate route shadows controller

**File:** `src/app/module/booking/booking.router.ts:60-75`

Two `GET /booking-request/:id` routes are defined:

```ts
// Route 1 — hospital-only details (line ~60)
auth(Role.HOSPITAL), BookingController.getBookingRequestsDetailsController

// Route 2 — user's own booking details (line ~70)
auth(Role.SUPER_ADMIN, Role.ADMIN, Role.USER, Role.DONOR, Role.HOSPITAL),
BookingController.getMyBookingDetailsController
```

**Impact:** Route 2 shadows Route 1. The hospital-only `getBookingRequestsDetailsController` is unreachable.

**Fix:** Rename one route (e.g., `GET /booking-details/:id` for hospital, `GET /my-booking-details/:id` for user).

---

### 3. Donation request filter overwrite

**File:** `src/app/module/donor/donor.service.ts:97-105`

```ts
if (urgency) {
    where.requester = { urgency: urgency };
}
if (blood_group) {
    where.requester = { blood_group } // OVERWRITES urgency filter
}
```

**Impact:** When both `urgency` and `blood_group` are provided, only `blood_group` applies.

**Fix:** Merge into a single object:
```ts
where.requester = { ...where.requester, urgency, blood_group }
```

---

### 4. Count queries ignore filters (pagination broken)

Multiple services return wrong `total` because the count query doesn't apply the `where` filter:

| File | Function | Line |
|------|----------|------|
| `src/app/module/booking/booking.service.ts` | `getMyBookingsService` | ~136 |
| `src/app/module/emergencyService/service.service.ts` | `getMyServices` | ~133 |
| `src/app/module/payment/payment.service.ts` | `getMyPayments` | ~196 |
| `src/app/module/payment/payment.service.ts` | `getAllPayments` | ~231 |
| `src/app/module/hospital/hospital.service.ts` | `getAllHospitalProfile` | ~130 |

All use:
```ts
prisma.bookingService.count() // no `where` passed
```

**Fix:** Pass the same `where` to both queries:
```ts
prisma.bookingService.count({ where })
```

---

### 5. `verifyEmailService` throws generic `Error` instead of `AppError`

**File:** `src/app/module/auth/auth.service.ts:112,116`

```ts
throw new Error("No OTP found");
throw new Error("Invalid OTP !!!");
```

**Impact:** These produce HTTP 500 in `globalErrorHandler` instead of proper 400/404.

**Fix:** Replace with `new AppError(404, "No OTP found")` and `new AppError(400, "Invalid OTP")`.

---

### 6. `refreshTokenService` throws generic `Error`

**File:** `src/app/module/auth/auth.service.ts:179`

```ts
throw new Error("User is inactive / blocked or not found.");
```

**Impact:** Returns HTTP 500 instead of 401/403.

**Fix:** Replace with `new AppError(401, "User is inactive / blocked or not found.")`.

---

### 7. Seed error handler deletes non-existent records

**File:** `src/app/utils/seed.ts` — all seed functions

Every `catch` block runs:
```ts
await prisma.user.delete({ where: { email: config.SUPER_ADMIN_EMAIL } });
```

If the error occurred before the `create` call (e.g., connection error), the delete throws because the user doesn't exist.

**Fix:** Wrap the delete in a try-catch or check existence first:
```ts
catch (error) {
    try {
        await prisma.user.delete({ where: { email } });
    } catch { /* ignore */ }
}
```

---

### 8. `updateDonationRequestService` updates donor by email instead of ID

**File:** `src/app/module/donor/donor.service.ts:208`

```ts
await tx.donor.update({
    where: { email: user.email },
    ...
});
```

**Impact:** If the user's email changes, this silently fails or updates the wrong record.

**Fix:** Use the donor ID from the donation record:
```ts
await tx.donor.update({
    where: { id: donation.donor_id },
    ...
});
```

---

## Security Issues

### 9. Payment callback has no authentication

**File:** `src/app/module/payment/payment.router.ts:13-16`

```ts
paymentRouter.get("/callback", PaymentController.createPaymentCallbackController);
```

Anyone can call this endpoint to manipulate payment status.

**Fix:** Validate the callback originates from bKash (signature/IP verification), or at minimum add rate limiting.

---

### 10. No rate limiting on OTP endpoints

**Endpoints affected:**
- `POST /api/v1/auth/register` — sends OTP email
- `POST /api/v1/auth/verify-email` — verifies OTP
- `POST /api/v1/auth/forget-password` — sends OTP email
- `POST /api/v1/auth/reset-password` — verifies OTP

**Impact:** Attacker can spam OTP emails (email service abuse / cost) or brute-force 6-digit OTPs.

**Fix:** Add `express-rate-limit` middleware on these routes (e.g., 5 requests per email per 10 minutes).

---

### 11. No file type validation on uploads

**File:** `src/app/lib/multer.ts`

Only limits file size (5MB). No `fileFilter` to restrict MIME types.

```ts
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    // Missing: fileFilter
});
```

**Impact:** Users can upload `.exe`, `.svg` (stored XSS), or other dangerous file types.

**Fix:** Add a file filter:
```ts
fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    cb(null, allowed.includes(file.mimetype));
}
```

---

### 12. Email templates inject user input without sanitization

**File:** `src/app/module/auth/auth.service.ts` — template rendering

```ts
const html = await ejs.renderFile(templatePath, {
    userName: payload.name, // raw user input
    otp,
});
```

**Impact:** If `name` contains `<script>alert(1)</script>`, it renders as HTML in the email client.

**Fix:** HTML-escape user input before passing to templates, or use a sanitization library like `he`.

---

### 13. `getAllRequesterController` is unprotected

**File:** `src/app/module/user/user.router.ts:37`

```ts
userRouter.get("/requester", UserController.getAllRequesterController);
```

No `auth()` middleware. Anyone can list all blood requests.

---

### 14. Donor profile endpoint is unprotected

**File:** `src/app/module/donor/donor.route.ts:28`

```ts
donorRouter.get("/donor-profile/:id", DonorController.getDonorProfileController);
```

No auth middleware.

---

### 15. Service listing endpoints are unprotected

**File:** `src/app/module/emergencyService/service.router.ts:19,30`

```ts
serviceRouter.get("/", EmergencyServiceController.getAllServiceController);
serviceRouter.get("/:id", EmergencyServiceController.getServiceDetailsController);
```

No auth middleware.

---

### 16. `getPaymentDetails` returns full user object including password

**File:** `src/app/module/payment/payment.service.ts:242`

```ts
include: {
    emergencyService: true,
    user: true // includes password field
}
```

**Fix:** Use `select` or `omit`:
```ts
user: { select: { name: true, email: true, phone: true } }
```

---

## Logic / Business Rule Issues

### 17. Booking status transitions not validated

**File:** `src/app/module/booking/booking.service.ts` — `updateBookingStatusService`

Hospitals can set any status without checking valid transitions (e.g., PENDING → COMPLETED directly).

**Fix:** Implement a state machine:
```ts
const validTransitions: Record<BookingStatus, BookingStatus[]> = {
    PENDING: [BookingStatus.ACCEPTED, BookingStatus.CANCELLED],
    ACCEPTED: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
    CONFIRMED: [BookingStatus.COMPLETED, BookingStatus.FAILED],
    COMPLETED: [],
    CANCELLED: [],
    FAILED: [BookingStatus.PENDING],
};
```

---

### 18. Cancelled booking blocks re-booking

**File:** `src/app/module/booking/booking.service.ts:28-43`

The duplicate check doesn't exclude CANCELLED status:

```ts
const isBookingAlreadyExist = await prisma.bookingService.findFirst({
    where: {
        emergencyService_id: service_id,
        user_id: userData.id,
    },
});
```

**Fix:** Add `booking_status: { not: BookingStatus.CANCELLED }` to the where clause.

---

### 19. `updateMyRequestService` allows status escalation

**File:** `src/app/module/user/user.service.ts:119`

Users can set `request_status` directly through the update endpoint. While validation restricts to PENDING/CANCELLED, there's no server-side check that the transition is valid from the current state.

---

### 20. `getBookingRequestsService` has no pagination

**File:** `src/app/module/booking/booking.service.ts:337`

Returns all bookings for a hospital with no pagination, filtering, or search.

**Fix:** Add the same pagination pattern used elsewhere (page, limit, where filters).

---

### 21. Payment status can be downgraded

**File:** `src/app/module/payment/payment.service.ts`

Nothing prevents updating a PAID payment back to PENDING or FAILED.

**Fix:** Add a status transition check:
```ts
if (existingPayment.payment_status === "PAID") {
    throw new AppError(400, "Cannot modify a completed payment.");
}
```

---

### 22. Cloudinary cleanup after DB update (orphan risk)

**Files:**
- `src/app/module/user/user.service.ts:209-216`
- `src/app/module/emergencyService/service.service.ts:155-162`

Both update the DB first, then delete the old image. If deletion fails, the old image is orphaned.

**Fix:** Delete the old image **after** the DB update succeeds, but catch the error gracefully (log it, don't throw):
```ts
try {
    await cloudinary.uploader.destroy(oldPublicId);
} catch {
    console.error("Failed to delete old image from Cloudinary");
}
```

---

## Pagination / Query Issues

### 23. `sortByAmount` overrides `sortBy` silently

**Files:**
- `src/app/module/booking/booking.service.ts:113`
- `src/app/module/payment/payment.service.ts`

```ts
const orderBy = sortByAmount
    ? { payment_amount: sortByAmount }
    : { created_at: sortBy };
```

**Impact:** If `sortByAmount` is provided, `sortBy` is completely ignored.

**Fix:** Allow both or document the behavior clearly.

---

### 24. Default pagination allows unbounded `limit`

All list endpoints accept `limit` from the query string without a maximum. A client can request `limit=999999` and dump the entire table.

**Fix:** Cap the limit:
```ts
const limit = Math.min(Number(query.limit) || 10, 100);
```

---

### 25. `getDonorRequestService` — `findMany` never returns null

**File:** `src/app/module/donor/donor.service.ts:245`

```ts
if (!donations) { // findMany always returns [], never null
    throw new AppError(404, "No donation request found.");
}
```

This check is dead code. Should check `donations.length === 0` instead.

---

### 26. `getMyBookingsService` — same issue

**File:** `src/app/module/booking/booking.service.ts:135`

```ts
if (!bookings) { // findMany returns []
    throw new AppError(404, "Booking not found.");
}
```

Dead code. Check `.length === 0`.

---

## Code Quality / Consistency

### 27. Inconsistent role check syntax

| File | Line | Syntax |
|------|------|--------|
| `auth.service.ts` | 44 | `role === "SUPER_ADMIN"` |
| `donor.service.ts` | 268 | `user.role !== 'SUPER_ADMIN'` |
| `hospital.service.ts` | 196 | `user.role !== 'ADMIN'` |
| Other places | — | `Role.SUPER_ADMIN` (enum) |

**Fix:** Always use the enum (`Role.SUPER_ADMIN`).

---

### 28. Naming inconsistencies

| Issue | Location |
|-------|----------|
| `donor.route.ts` vs `donor.router.ts` | Donor uses `.route.ts`, others use `.router.ts` |
| `DonorValidtaion` (typo) | `donor.validation.ts:65` — should be `DonorValidation` |
| `createPayemntService` (typo) | `payment.service.ts` — should be `createPaymentService` |
| `Hosptal profile not exist` (typo) | `booking.service.ts` — should be `Hospital` |

---

### 29. `IUser` interface duplicated

Defined in `src/app/module/auth/auth.interface.ts` and also exported from `src/app/module/user/user.interface.ts`. Same shape, imported from different paths across modules.

**Fix:** Keep one definition and re-export from a shared location.

---

### 30. Empty `payment.validation.ts`

**File:** `src/app/module/payment/payment.validation.ts`

No validation on any payment-related request body.

**Fix:** Add validation for at least the callback query parameters.

---

### 31. `tsconfig.json` references wrong file

```json
"include": ["src", "prisma.config.ts"]
```

The actual file is `prisma7.config.ts`. The Prisma config is not type-checked.

**Fix:** Either rename the file to `prisma.config.ts` or update the include.

---

### 32. `console.log` debug statements left in code

| File | Line | Status |
|------|------|--------|
| `src/server.ts` | 14, 17 | Active `console.log` |
| `src/app/utils/seed.ts` | Various | Active `console.log` |
| `src/app/module/auth/auth.service.ts` | 84 | Commented out `console.log` |
| `src/app/module/payment/payment.service.ts` | Various | Commented out `console.log` |

**Fix:** Remove debug logs or use a proper logger (e.g., `pino`).

---

### 33. No `.env.example`

No documentation of required environment variables.

**Fix:** Create a `.env.example` with placeholder values.

---

## Infrastructure Gaps

### 34. No graceful shutdown

**File:** `src/server.ts`

No `SIGTERM` / `SIGINT` handlers. When deployed to Docker/K8s, the process is killed mid-request.

**Fix:**
```ts
process.on("SIGTERM", async () => {
    await prisma.$disconnect();
    redisClient.disconnect();
    process.exit(0);
});
```

---

### 35. Redis client has no error handler

**File:** `src/app/lib/redis.ts`

No `redisClient.on("error", ...)` handler. A Redis connection failure crashes the server with an unhandled error.

**Fix:**
```ts
redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err);
});
```

---

### 36. No request ID / correlation ID

No middleware assigns a unique ID to each request for logging and debugging.

**Fix:** Add `uuid` middleware that sets `X-Request-Id` header.

---

### 37. No health check endpoint

No `/health` or `/ready` endpoint for load balancers or container orchestrators.

**Fix:**
```ts
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
```

---

### 38. No CORS for multiple origins

**File:** `src/app.ts`

```ts
origin: config.FRONTEND_URL
```

Single string. Fails if you have staging + production frontends.

**Fix:** Parse `FRONTEND_URL` as comma-separated and pass an array.

---

### 39. No missing route handler (404)

No catch-all for undefined routes. `GET /api/v1/nonexistent` returns the default Express "Cannot GET" HTML.

**Fix:** Add before `globalErrorHandler`:
```ts
app.all("*", (req, _res, next) => {
    next(new AppError(404, `Cannot find ${req.method} ${req.originalUrl}`));
});
```

---

### 40. bKash token refresh race condition

**File:** `src/app/lib/bkash.ts`

Multiple concurrent requests can trigger duplicate token refreshes simultaneously.

**Fix:** Use a mutex/lock in Redis:
```ts
const lockKey = "bkash:refresh_lock";
const acquired = await redisClient.set(lockKey, "1", { NX: true, EX: 5 });
if (!acquired) {
    // Wait and retry
}
```

---

## Priority Summary

| Priority | Issue # | Summary |
|----------|---------|---------|
| **P0 — Critical** | 1 | Auth middleware `&&` vs `||` — blocked users bypass security |
| **P0 — Critical** | 10 | No rate limiting on OTP — brute-force + email spam |
| **P0 — Critical** | 9 | Unauthenticated payment callback |
| **P1 — High** | 2 | Duplicate booking route shadows controller |
| **P1 — High** | 3 | Donation filter overwrite — silent data bug |
| **P1 — High** | 4 | Count queries ignore filters — pagination broken |
| **P1 — High** | 5, 6 | Generic `Error` instead of `AppError` — wrong HTTP codes |
| **P1 — High** | 12 | XSS in email templates |
| **P1 — High** | 16 | Payment details leaks password |
| **P1 — High** | 17 | No booking status state machine |
| **P2 — Medium** | 7 | Seed error deletes non-existent records |
| **P2 — Medium** | 8 | Donor update by email instead of ID |
| **P2 — Medium** | 11 | No file type validation on uploads |
| **P2 — Medium** | 13-15 | Unprotected public endpoints |
| **P2 — Medium** | 18 | Cancelled booking blocks re-booking |
| **P2 — Medium** | 20 | No pagination on booking requests |
| **P2 — Medium** | 22 | Cloudinary orphan risk |
| **P2 — Medium** | 34 | No graceful shutdown |
| **P2 — Medium** | 35 | Redis no error handler |
| **P2 — Medium** | 39 | No 404 handler |
| **P3 — Low** | 23-26 | Query / pagination edge cases |
| **P3 — Low** | 27-33 | Code quality / consistency |
| **P3 — Low** | 36-38, 40 | Infrastructure improvements |
