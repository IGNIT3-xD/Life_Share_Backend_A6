-- CreateEnum
CREATE TYPE "RequestUrgency" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'SCHEDULED', 'COMPLETED', 'DONOR_CANCELLED', 'REJECTED');

-- DropIndex
DROP INDEX "idx_donor_email";

-- DropIndex
DROP INDEX "idx_user_email";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "gender" DROP NOT NULL;

-- CreateTable
CREATE TABLE "donations" (
    "id" TEXT NOT NULL,
    "requester_id" TEXT NOT NULL,
    "donor_id" TEXT NOT NULL,
    "donationStatus" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "scheduled_at" TIMESTAMP(3),
    "donated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requester" (
    "id" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "blood_group" "BloodGroup" NOT NULL,
    "unit_required" INTEGER NOT NULL,
    "exact_location" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "urgency" "RequestUrgency" NOT NULL,
    "request_status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requester_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_requester" ON "requester"("urgency", "blood_group", "exact_location", "expires_at");

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "requester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_donor_id_fkey" FOREIGN KEY ("donor_id") REFERENCES "donor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requester" ADD CONSTRAINT "requester_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
