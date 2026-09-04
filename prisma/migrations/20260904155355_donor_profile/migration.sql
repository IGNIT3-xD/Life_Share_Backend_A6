-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG');

-- CreateEnum
CREATE TYPE "DonorAvailability" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "DonorStatus" AS ENUM ('VERIFIED', 'NOT_ELIGIBLE', 'IN_PROGRESS');

-- CreateTable
CREATE TABLE "donor" (
    "id" TEXT NOT NULL,
    "blood_group" "BloodGroup" NOT NULL,
    "location" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "availability" "DonorAvailability" NOT NULL DEFAULT 'AVAILABLE',
    "weightKg" DECIMAL(10,2) NOT NULL,
    "height" DECIMAL(10,2) NOT NULL,
    "donorStatus" "DonorStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "totalDonations" INTEGER DEFAULT 0,
    "lastDonationDate" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "donor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "donor_userId_key" ON "donor"("userId");

-- CreateIndex
CREATE INDEX "idx_donor_location" ON "donor"("location");

-- CreateIndex
CREATE INDEX "idx_donor_blood_grp" ON "donor"("blood_group");

-- AddForeignKey
ALTER TABLE "donor" ADD CONSTRAINT "donor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
