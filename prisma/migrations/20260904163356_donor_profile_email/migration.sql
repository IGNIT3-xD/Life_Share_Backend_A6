/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `donor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `donor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "donor" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "donor_email_key" ON "donor"("email");

-- CreateIndex
CREATE INDEX "idx_donor_email" ON "donor"("email");
