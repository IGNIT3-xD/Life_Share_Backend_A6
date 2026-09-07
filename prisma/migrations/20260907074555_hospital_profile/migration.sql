-- CreateEnum
CREATE TYPE "HospitalStatus" AS ENUM ('VERIFIED', 'NOT_ELIGIBLE', 'IN_PROGRESS');

-- CreateTable
CREATE TABLE "hospital" (
    "id" TEXT NOT NULL,
    "license_number" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hospital_status" "HospitalStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "hospital_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hospital_user_id_key" ON "hospital"("user_id");

-- AddForeignKey
ALTER TABLE "hospital" ADD CONSTRAINT "hospital_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
