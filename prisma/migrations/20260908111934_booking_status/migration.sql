/*
  Warnings:

  - The values [IN_PROGRESS] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'ACCEPTED', 'COMPLETED', 'CANCELLED', 'FAILED');
ALTER TABLE "public"."bookingServices" ALTER COLUMN "booking_status" DROP DEFAULT;
ALTER TABLE "bookingServices" ALTER COLUMN "booking_status" TYPE "BookingStatus_new" USING ("booking_status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "public"."BookingStatus_old";
ALTER TABLE "bookingServices" ALTER COLUMN "booking_status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "bookingServices" ALTER COLUMN "booking_status" SET DEFAULT 'PENDING';
