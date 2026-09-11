# MODIFIED.md — Changes Made

> All modifications applied to `life-share-backend-a6` to fix issues from FIX.md.
> Each entry shows the file, what changed, and why.

---

## Table of Contents

- [New Files](#new-files)
- [Modified Files](#modified-files)
- [Critical Security Fixes](#critical-security-fixes)
- [Bug Fixes](#bug-fixes)
- [Logic / Business Rule Fixes](#logic--business-rule-fixes)
- [Pagination / Query Fixes](#pagination--query-fixes)
- [Infrastructure Improvements](#infrastructure-improvements)

---

## New Files

### `src/app/middlewares/rateLimit.ts`

In-memory rate limiter middleware. No external dependencies required.

- Tracks requests per IP + route path
- Configurable max requests and time window
- Auto-cleanup every 60 seconds
- Throws `429 Too Many Requests` with retry-after info

### `src/app/middlewares/requestId.ts`

Assigns a UUID to every request via `X-Request-Id` header.

- Uses existing `x-request-id` header if present
- Sets response header for client correlation

### `src/app/module/payment/payment.validation.ts`

Zod validation schema for the bKash payment callback query parameters.

- Validates `paymentID` is a non-empty string
- Validates `status` is one of `success`, `failure`, or `cancel`

### `.env.example`

Documented template of all required environment variables.

---

## Modified Files

### `src/app.ts`

**Changes:**
1. Added `requestId` middleware (first in pipeline)
2. CORS now supports comma-separated `FRONTEND_URL` for multiple origins
3. Added `GET /health` endpoint returning `{ status: "ok", timestamp }`
4. Added `app.all("*")` catch-all returning 404 for undefined routes

**Before:**
```ts
app.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
```

**After:**
```ts
const allowedOrigins = config.FRONTEND_URL
  ? config.FRONTEND_URL.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new AppError(403, "Not allowed by CORS"));
    }
  },
  credentials: true,
}));
```

---

### `src/app/middlewares/auth.ts`

**Change:** Line 55-58 — `throw new Error(...)` → `throw new AppError(403, ...)`

Generic `Error` returned HTTP 500. Now returns proper 403 status code.

---

### `src/app/middlewares/validateRequest.ts`

**Changes:**
1. Added optional `source` parameter (`"body"` | `"query"`, default `"body"`)
2. When `source === "query"`, validates `req.query` instead of `req.body`
3. Body validation unchanged; query validation only validates (no reassignment due to Express type constraints)

---

### `src/app/lib/redis.ts`

**Changes:** Added event handlers for error, connect, and reconnecting events.

```ts
redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err.message);
});
redisClient.on("connect", () => {
  console.log("Redis client connected.");
});
redisClient.on("reconnecting", () => {
  console.log("Redis client reconnecting...");
});
```

---

### `src/app/lib/bkash.ts`

**Change:** Added mutex flag `refreshInProgress` to prevent concurrent token refresh race conditions.

- When a refresh is already in progress, subsequent callers wait 500ms and retry from cache
- `try/finally` ensures the flag is always reset

---

### `src/app/module/auth/auth.router.ts`

**Changes:** Added `rateLimit()` middleware on OTP-related endpoints:

| Route | Limit |
|-------|-------|
| `POST /register` | 5 requests / 10 min |
| `POST /verify-email` | 10 requests / 10 min |
| `POST /login` | 10 requests / 15 min |
| `POST /forget-password` | 5 requests / 10 min |
| `POST /reset-password` | 5 requests / 10 min |

---

### `src/app/module/auth/auth.service.ts`

**Changes:**
1. `verifyEmailService`: OTP errors changed from `throw new Error(...)` to `throw new AppError(404/400, ...)`
2. `refreshTokenService`: Added null check for `user`, changed `throw new Error(...)` to `throw new AppError(403, ...)`

**Before:**
```ts
if (!redisOtp) { throw new AppError(404, "No OTP found"); }
if (redisOtp !== otp) { throw new AppError(404, "Invalid OTP !!!"); }
```

**After:**
```ts
if (!redisOtp) { throw new AppError(404, "No OTP found. Please request a new one."); }
if (redisOtp !== otp) { throw new AppError(400, "Invalid OTP."); }
```

---

### `src/app/module/booking/booking.router.ts`

**Change:** Renamed duplicate route to avoid shadowing.

**Before:** Two `GET /booking-request/:id` routes (second shadowed first)

**After:**
- `GET /booking-request/:id` → hospital-only details (unchanged)
- `GET /my-booking-details/:id` → user's own booking details (renamed)

---

### `src/app/module/booking/booking.service.ts`

**Changes:**
1. **Count query** in `getMyBookingsService`: Added `{ where }` to `prisma.bookingService.count()`
2. **Dead code** in `getMyBookingsService`: `if (!bookings)` → `if (bookings.length === 0)` returning empty array
3. **Cancelled re-booking** in `createBookingService`: Added `notIn: [CANCELLED, FAILED]` to duplicate check
4. **Cancel check** in `cancelBookingService`: Added `CANCELLED` status check (was only checking `COMPLETED`)
5. **Delete check** in `deleteBookingService`: Added `CANCELLED` status check
6. **`getBookingRequestsService`**: Added pagination (`page`, `limit`, capped at 100), fixed typo "Hosptal" → "Hospital"
7. **`sortByAmount` removed**: Ordering now always uses `created_at` sort

---

### `src/app/module/booking/booking.controller.ts`

**Change:** `getBookingRequestsController` now passes `req.query` to the service for pagination.

---

### `src/app/module/booking/booking.interface.ts`

**Change:** Removed `sortByAmount` from `IBookingQuery` interface.

---

### `src/app/module/donor/donor.service.ts`

**Changes:**
1. **Filter overwrite** in `getDonationRequestService`: Merged `urgency` and `blood_group` into single `requester` filter object instead of overwriting
2. **Donor update** in `updateDonationRequestService`: Changed `where: { email: user.email }` → `where: { id: donation.donor_id }`
3. **Dead code** in `getDonorRequestService`: `if (!donations)` → `if (donations.length === 0)` returning empty array
4. **Pagination cap** in `getAllDonorsService`, `getDonationRequestService`, `adminGetAllDonorsService`: All now cap `limit` at 100 and ensure `page >= 1`

---

### `src/app/module/donor/donor.interface.ts`

**Change:** Renamed `page`/`limit` → `rawPage`/`rawLimit` in `IDonorQuery`, `IDonorQueryAdmin`, `IDonationAdmin`.

---

### `src/app/module/emergencyService/service.service.ts`

**Changes:**
1. **Count query** in `getMyServices`: Added `{ where }` to `prisma.emergencyService.count()`
2. **Dead code** in `getAllService` and `getMyServices`: `if (!services)` → `if (services.length === 0)` returning empty array
3. **Cloudinary cleanup** in `updateMyService`: Changed `throw` on failure to silent catch (non-critical)
4. **Pagination cap** in `getAllService` and `getMyServices`: Capped `limit` at 100

---

### `src/app/module/emergencyService/service.interface.ts`

**Change:** Renamed `page`/`limit` → `rawPage`/`rawLimit` in `IServiceQuery`.

---

### `src/app/module/hospital/hospital.service.ts`

**Changes:**
1. **Count query** in `getAllHospitalProfile`: Added `{ where }` to `prisma.hospital.count()`
2. **Pagination cap** in `getAllHospitalProfile`: Capped `limit` at 100

---

### `src/app/module/hospital/hospital.interface.ts`

**Change:** Renamed `page`/`limit` → `rawPage`/`rawLimit` in `IHospitalQuery`.

---

### `src/app/module/payment/payment.service.ts`

**Changes:**
1. **Callback validation** in `createPaymentCallbackService`: Added `typeof` checks and whitelist validation (`["success", "failure", "cancel"]`)
2. **Status downgrade guard** in `createPayemntService`: Added check preventing modification of `REFUNDED` payments
3. **Count queries** in `getMyPayments` and `getAllPayments`: Added `{ where }` to both count calls
4. **Dead code** in `getMyPayments` and `getAllPayments`: `if (!payment)` → `if (payment.length === 0)` returning empty array
5. **`sortByAmount` removed**: Ordering now always uses `created_at` sort
6. **Pagination cap** in both list functions: Capped `limit` at 100

---

### `src/app/module/payment/payment.router.ts`

**Changes:**
1. Added `validateRequest(PaymentValidation.callbackQueryValidation, "query")` on `GET /callback`
2. Added imports for `validateRequest` and `PaymentValidation`

---

### `src/app/module/payment/payment.interface.ts`

**Changes:** Removed `sortByAmount`, renamed `page`/`limit` → `rawPage`/`rawLimit`.

---

### `src/app/module/user/user.service.ts`

**Changes:**
1. **Status escalation** in `updateMyRequestService`: Added server-side status transition validation:
   ```ts
   const validStatusTransitions = {
     PENDING: ["PENDING", "CANCELLED"],
     IN_PROGRESS: ["IN_PROGRESS", "COMPLETED", "CANCELLED"],
     COMPLETED: [],
     CANCELLED: ["PENDING"],
   };
   ```
2. **Cloudinary cleanup** in `updateProfileService`: Changed `throw` on failure to silent catch
3. **Pagination cap** in `getAllRequestersService` and `getAllUser`: Capped `limit` at 100

---

### `src/app/module/user/user.interface.ts`

**Change:** Renamed `page`/`limit` → `rawPage`/`rawLimit` in `IRequesterQuery` and `IUserQuery`.

---

### `src/app/utils/seed.ts`

**Change:** All four seed functions (`seedSuperAdmin`, `seedTesterAdmin`, `seedTesterDonor`, `seedTesterHospital`) now wrap the cleanup `delete` call in a try-catch to prevent secondary errors when the user doesn't exist.

**Before:**
```ts
} catch (error) {
  console.log("Error Seeding Super Admin : ", error);
  await prisma.user.delete({ where: { email: config.SUPER_ADMIN_EMAIL } });
}
```

**After:**
```ts
} catch (error) {
  console.log("Error Seeding Super Admin : ", error);
  try {
    await prisma.user.delete({ where: { email: config.SUPER_ADMIN_EMAIL } });
  } catch {
    // User may not exist, ignore cleanup error
  }
}
```

---

### `tsconfig.json`

**Change:** Fixed `include` array to reference the actual config filename.

**Before:** `"include": ["src", "prisma.config.ts"]`
**After:** `"include": ["src", "prisma7.config.ts"]`

---

## Summary by Issue

| Issue | File(s) Changed | What Changed |
|-------|----------------|--------------|
| #1 Auth `&&` vs `||` | `auth.ts` | `Error` → `AppError` (condition was already correct) |
| #2 Duplicate booking route | `booking.router.ts` | Renamed second `GET /booking-request/:id` → `GET /my-booking-details/:id` |
| #3 Donation filter overwrite | `donor.service.ts` | Merged `urgency` + `blood_group` into single object |
| #4 Count queries ignore filters | `booking.service.ts`, `service.service.ts`, `payment.service.ts`, `hospital.service.ts` | Added `{ where }` to all `.count()` calls |
| #5 verifyEmailService `Error` | `auth.service.ts` | `throw new Error` → `throw new AppError` |
| #6 refreshTokenService `Error` | `auth.service.ts` | `throw new Error` → `throw new AppError` + null check |
| #7 Seed cleanup error | `seed.ts` | Wrapped delete in try-catch |
| #8 Donor update by email | `donor.service.ts` | `where: { email }` → `where: { id: donation.donor_id }` |
| #9 Payment callback auth | `payment.router.ts`, `payment.validation.ts` | Added Zod validation on callback query |
| #10 Rate limiting | `auth.router.ts`, `rateLimit.ts` (new) | Added rate limiter middleware on OTP routes |
| #11 File type validation | *(already existed in multer.ts)* | No change needed |
| #14 Donor profile auth | *(already existed in donor.route.ts)* | No change needed |
| #16 Password leak | *(already existed with `omit: { password }`)* | No change needed |
| #18 Cancelled re-booking | `booking.service.ts` | Added `notIn: [CANCELLED, FAILED]` to duplicate check |
| #19 Status escalation | `user.service.ts` | Added transition validation map |
| #20 Booking pagination | `booking.service.ts`, `booking.controller.ts` | Added pagination + count with where |
| #21 Payment downgrade | `payment.service.ts` | Added `REFUNDED` guard |
| #22 Cloudinary orphan | `user.service.ts`, `service.service.ts` | `throw` → silent catch on cleanup |
| #23 sortByAmount override | `booking.service.ts`, `payment.service.ts`, interfaces | Removed `sortByAmount`, always sort by `created_at` |
| #24 Unbounded pagination | All service files | Capped `limit` at `Math.min(Math.max(1, n), 100)` |
| #25-26 Dead code | `booking.service.ts`, `donor.service.ts`, `payment.service.ts`, `service.service.ts` | `!arr` → `arr.length === 0` |
| #30 Empty validation | `payment.validation.ts` | Created Zod schema for callback |
| #31 tsconfig mismatch | `tsconfig.json` | `prisma.config.ts` → `prisma7.config.ts` |
| #33 No .env.example | `.env.example` | Created documented template |
| #35 Redis no handler | `redis.ts` | Added `error`, `connect`, `reconnecting` handlers |
| #36 No request ID | `requestId.ts` (new), `app.ts` | Added UUID middleware |
| #37 No health check | `app.ts` | Added `GET /health` |
| #38 CORS single origin | `app.ts` | Parsed comma-separated, dynamic origin |
| #39 No 404 handler | `app.ts` | Added `app.all("*")` catch-all |
| #40 bKash race condition | `bkash.ts` | Added `refreshInProgress` mutex flag |
