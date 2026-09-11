import type {
	BookingStatus,
	PaymentStatus,
	PaymentVia,
} from "../../../../prisma/generated/prisma/enums";
import type { SortOrder } from "../donor/donor.interface";

export interface IBooking {
	payment_via: PaymentVia;

	emergency_location: string;

	description: string;
	patient_name: string;
	patient_number: string;

	note?: string;

	scheduled_at: Date;
}

export interface IUpdateBooking {
	emergency_location?: string;

	description?: string;
	patient_name?: string;
	patient_number?: string;

	note?: string;

	scheduled_at?: Date;
}

export interface IUpdateBookingStatus {
	booking_status: BookingStatus;
}

export interface IUpdatePaymentStatus {
	payment_status: PaymentStatus;
}

export interface IBookingQuery {
	search?: string;
	booking_status?: BookingStatus;
	payment_status?: PaymentStatus;
	payment_via?: PaymentVia;
	sortBy?: SortOrder;
	page?: number;
	limit?: number;
}
