import { z } from "zod";
import { PaymentVia } from "../../../../prisma/generated/prisma/enums";

const createBookingValidate = z.object({
    patient_name: z
        .string("Patient name is required")
        .trim()
        .min(2, "Patient name must be at least 2 characters long.")
        .max(30, "Patient name is too long."),

    patient_number: z
        .string("Patient phone number is required")
        .trim()
        .regex(/^\+?[0-9]{10,15}$/, "Please provide a valid phone number."),

    payment_via: z.enum(
        PaymentVia,
        "Please select a valid payment method."
    ),

    emergency_location: z
        .string("Emergency location address is required")
        .trim()
        .min(5, "Please provide a more descriptive location.")
        .max(500, "Location address is too long."),

    description: z
        .string("Emergency description is required")
        .trim()
        .min(5, "Please briefly describe the nature of the emergency.")
        .max(1000, "Description cannot exceed 1000 characters."),

    scheduled_at: z.coerce
        .date("Booking schedule time is required")
        .refine(
            (date) => date.getTime() > Date.now(),
            "Booking schedule time must be in the future."
        ),

    note: z
        .string()
        .trim()
        .max(500, "Optional note cannot exceed 500 characters.")
        .optional(),
});

export const BookingValidation = {
    createBookingValidate,
};
