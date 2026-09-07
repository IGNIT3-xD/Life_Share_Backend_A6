-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('IN_PROGRESS', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('VETERINARY', 'EMERGENCY_AMBULANCE', 'BLOOD_BANK', 'LAB_TEST', 'PHARMACY', 'OTHER');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "bookingServices" (
    "id" TEXT NOT NULL,
    "booking_status" "BookingStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_amount" DECIMAL(10,2) NOT NULL,
    "emergency_location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "patient_name" TEXT NOT NULL,
    "patient_number" TEXT NOT NULL,
    "scheduled_at" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "emergencyService_id" TEXT NOT NULL,

    CONSTRAINT "bookingServices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergencyServices" (
    "id" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "service_category" "ServiceCategory" NOT NULL,
    "service_status" "ServiceStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "service_image" TEXT NOT NULL,
    "service_image_public_id" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergencyServices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_bookings_service" ON "bookingServices"("booking_status", "payment_status", "payment_amount");

-- CreateIndex
CREATE INDEX "idx_emergency_service" ON "emergencyServices"("service_category", "service_status", "price");

-- AddForeignKey
ALTER TABLE "bookingServices" ADD CONSTRAINT "bookingServices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookingServices" ADD CONSTRAINT "bookingServices_emergencyService_id_fkey" FOREIGN KEY ("emergencyService_id") REFERENCES "emergencyServices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergencyServices" ADD CONSTRAINT "emergencyServices_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;
