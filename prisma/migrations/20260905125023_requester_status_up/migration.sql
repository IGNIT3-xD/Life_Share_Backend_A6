/*
  Warnings:

  - The values [IN_PROGRESS] on the enum `RequestStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RequestStatus_new" AS ENUM ('PENDING', 'VERIFIED', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."requester" ALTER COLUMN "request_status" DROP DEFAULT;
ALTER TABLE "requester" ALTER COLUMN "request_status" TYPE "RequestStatus_new" USING ("request_status"::text::"RequestStatus_new");
ALTER TYPE "RequestStatus" RENAME TO "RequestStatus_old";
ALTER TYPE "RequestStatus_new" RENAME TO "RequestStatus";
DROP TYPE "public"."RequestStatus_old";
ALTER TABLE "requester" ALTER COLUMN "request_status" SET DEFAULT 'PENDING';
COMMIT;
