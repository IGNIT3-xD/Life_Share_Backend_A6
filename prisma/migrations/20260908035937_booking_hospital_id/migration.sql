/*
  Warnings:

  - Added the required column `hospital_id` to the `bookingServices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookingServices" ADD COLUMN     "hospital_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "bookingServices" ADD CONSTRAINT "bookingServices_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;
