/*
  Warnings:

  - Changed the type of `scheduled_at` on the `bookingServices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "bookingServices" DROP COLUMN "scheduled_at",
ADD COLUMN     "scheduled_at" TIMESTAMP(3) NOT NULL;
