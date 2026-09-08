import type { PaymentVia } from "../../../../prisma/generated/prisma/enums";

export interface IBooking {
    payment_via: PaymentVia;

    emergency_location: string;

    description: string;
    patient_name: string;
    patient_number: string;

    note?: string;

    scheduled_at: Date;
}