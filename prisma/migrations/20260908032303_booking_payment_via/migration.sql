/*
  Warnings:

  - Added the required column `payment_via` to the `bookingServices` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentVia" AS ENUM ('BKASH', 'ON_HAND');

-- AlterTable
ALTER TABLE "bookingServices" ADD COLUMN     "note" TEXT,
ADD COLUMN     "payment_via" "PaymentVia" NOT NULL;
