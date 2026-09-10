import { PaymentStatus, PaymentVia } from "../../../../prisma/generated/prisma/enums";
import { SortOrder } from "../donor/donor.interface";

export interface IPaymentQuery {
    search?: string;
    payment_status?: PaymentStatus;
    payment_gateway?: PaymentVia;
    sortBy?: SortOrder;
    sortByAmount?: SortOrder;
    limit?: number;
    page?: number
}