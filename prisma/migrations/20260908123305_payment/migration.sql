-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'CANCELLED';

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "payment_gateway" "PaymentVia" NOT NULL,
    "merchant_invoice_number" TEXT,
    "payer_reference" TEXT,
    "bkash_payment_id" TEXT,
    "bkash_trx_id" TEXT,
    "paid_at" TIMESTAMP(3),
    "gatewayResponse" JSONB,
    "refund_amount" DECIMAL(10,2),
    "refund_trx_id" TEXT,
    "refund_reason" TEXT,
    "refunded_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emergencyService_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_merchant_invoice_number_key" ON "payment"("merchant_invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "payment_bkash_payment_id_key" ON "payment"("bkash_payment_id");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_emergencyService_id_fkey" FOREIGN KEY ("emergencyService_id") REFERENCES "emergencyServices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
