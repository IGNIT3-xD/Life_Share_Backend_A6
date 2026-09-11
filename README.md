# Life Share

A comprehensive Blood Donation & Emergency Assistance Platform backend. Life Share connects blood donors with patients in need, enables hospitals to offer emergency services, and facilitates secure payments — all through a single, role-based API.

Live API: https://life-share-backend-a6.vercel.app

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express 5 |
| ORM | Prisma 7 (PrismaPg adapter) |
| Database | PostgreSQL |
| Cache / OTP Store | Redis |
| Image Storage | Cloudinary |
| Email Service | Nodemailer (Gmail SMTP) |
| Payment Gateway | bKash (Bangladesh mobile payment) |
| Validation | Zod |
| Authentication | JWT (access + refresh tokens) |
| File Upload | Multer (memory storage) |
| Email Templates | EJS |
| Linting / Formatting | Biome |
| Build Tools | tsup, tsx |

---

## Project Structure

```
life-share-backend-a6/
├── prisma/
│   ├── schema/             # Split Prisma schema (enum, user, donor, etc.)
│   ├── generated/          # Generated Prisma client
│   └── migrations/
├── src/
│   ├── app.ts              # Express app setup, CORS, routes, middleware
│   ├── server.ts           # DB connect, Redis connect, seed, listen
│   ├── app/
│   │   ├── config/         # Environment variable loader
│   │   ├── lib/            # Prisma, Redis, Cloudinary, Nodemailer, bKash, Multer
│   │   ├── middlewares/    # Auth, error handler, rate limiter, validation
│   │   ├── module/         # Feature modules (auth, user, donor, etc.)
│   │   ├── templates/      # EJS email templates
│   │   └── utils/          # AppError, catchAsync, sendResponse, seed
│   └── ...
├── .env.example
├── package.json
├── tsconfig.json
└── biome.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL database
- Redis instance
- Cloudinary account
- bKash sandbox/production credentials

### Installation

```bash
git clone <repo-url>
cd life-share-backend-a6
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Key variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_USERNAME`, `REDIS_PASSWORD` | Redis connection |
| `JWT_ACCESS`, `JWT_REFRESH` | JWT signing secrets |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary credentials |
| `SMTP_USER`, `SMTP_PASSWORD` | Gmail SMTP for emails |
| `BKASH_BASE_URL`, `BKASH_APP_KEY`, `BKASH_APP_SECRET` | bKash payment gateway |

### Database Setup

```bash
npx prisma generate
npx prisma migrate dev
```

### Running the Server

```bash
npm run dev          # Development (tsx watch)
npm run build        # Build with tsup
npm start            # Production
```

The server auto-seeds a Super Admin, Tester Admin, Tester Donor, and Tester Hospital on startup using values from `.env`.

---

## API Endpoints

#### Api Docs: https://documenter.getpostman.com/view/55121364/2sBYAysU49

Base URL: `/api/v1`

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user (sends OTP email) |
| POST | `/auth/verify-email` | Verify email with OTP |
| POST | `/auth/login` | Login (returns JWT tokens) |
| POST | `/auth/refresh-token` | Refresh access token |
| POST | `/auth/forget-password` | Request password reset OTP |
| POST | `/auth/reset-password` | Reset password with OTP |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/me` | Get current user profile |
| PATCH | `/user/update-profile` | Update profile |
| POST | `/user/blood-request` | Create a blood request |
| GET | `/user/requester` | List verified blood requesters (public) |
| GET | `/user/request/:id` | Get blood request details |
| PATCH | `/user/update-my-request/:id` | Update own blood request |
| DELETE | `/user/delete-my-request/:id` | Delete own blood request |
| GET | `/user/all-users` | Admin: list all users |
| PUT | `/user/:id` | Admin: update user status |
| DELETE | `/user/:id` | Super Admin: delete user |

### Donors

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/donor/create-donor-profile` | Create donor profile |
| GET | `/donor/my-donor-profile` | Get own donor profile |
| GET | `/donor/` | Public: list verified donors |
| PATCH | `/donor/donation-request/:id` | Update donation status |
| PUT | `/donor/donor-profile-status/:id` | Admin: verify donor |
| PATCH | `/donor/donor-profile` | Update own donor profile |

### Donations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/donation/request` | Create donation request (link donor to requester) |
| GET | `/donation/my-requests` | Get own donation requests |

### Hospitals

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/hospital/create-hospital-profile` | Create hospital profile |
| GET | `/hospital/my-hospital-profile` | Get own hospital profile |
| PATCH | `/hospital/update-hospital-profile` | Update hospital profile |
| GET | `/hospital/all-hospital-profile` | Admin: list all hospitals |
| PUT | `/hospital/hospital-profile/:id` | Admin: verify hospital |

### Emergency Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/emergency-service/create-service` | Hospital: create service |
| GET | `/emergency-service/` | Public: list active services |
| GET | `/emergency-service/:id` | Get service details |
| PATCH | `/emergency-service/update-service/:id` | Hospital: update service |
| PUT | `/emergency-service/update-service-status/:id` | Admin: verify service |

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/emergency-service-booking/booking-request/:id` | Book an emergency service |
| PATCH | `/emergency-service-booking/update-booking-request/:id` | Update booking |
| PUT | `/emergency-service-booking/cancel-booking-request/:id` | Cancel booking |
| GET | `/emergency-service-booking/my-booking-request` | List own bookings |
| GET | `/emergency-service-booking/recevied-booking-request` | Hospital: received bookings |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payment/:id` | Initiate bKash payment |
| GET | `/payment/callback` | bKash payment callback |
| GET | `/payment/my-payments` | List own payments |
| GET | `/payment/hospital-payments` | Hospital: list payments for services |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/` | Admin dashboard analytics |

---

## Roles & Access Control

| Role | Description |
|------|-------------|
| `SUPER_ADMIN` | Full system access, can manage all users and delete accounts |
| `ADMIN` | Can verify donors, hospitals, services; manage users and view analytics |
| `USER` | Can create blood requests, browse donors and services, make bookings |
| `DONOR` | Can manage donor profile, accept/complete donation requests |
| `HOSPITAL` | Can create services, manage bookings and payments for their services |

---

## Key Features

- **Email Verification Flow** — Registration stores OTP in Redis (2 min TTL), verifies via email, then creates the user in DB.
- **Password Reset** — OTP-based reset with email confirmation.
- **Blood Donation Matching** — Requesters post requests; donors browse and accept; status cascades through a full lifecycle (PENDING → ACCEPTED → SCHEDULED → COMPLETED).
- **Emergency Service Marketplace** — Hospitals list services (ambulance, blood bank, lab tests, pharmacy, etc.); users browse and book.
- **bKash Payment Integration** — Tokenized checkout with Redis-cached token grant/refresh. Supports payment execution, callbacks, and refunds.
- **Image Management** — Cloudinary for profile pictures and service images with automatic cleanup on replacement.
- **Rate Limiting** — Per-route in-memory rate limiting to protect sensitive endpoints.
- **Input Validation** — Zod schemas for all request bodies and query parameters.
- **Global Error Handling** — Centralized error handler with Prisma, JWT, and Zod error normalization.
- **Seed System** — Auto-seeds admin and test users on server startup.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run format:fix` | Format code with Biome |
| `npm run lint:fix` | Lint code with Biome |

---

## Health Check

```
GET /health
```

Returns `{ "status": "ok", "timestamp": "..." }`.

---

## License

This project is for educational purposes.
