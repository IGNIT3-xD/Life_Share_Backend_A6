import z from "zod";
import { BloodGroup, RequestStatus, RequestUrgency } from "../../../../prisma/generated/prisma/enums";

const makeBloodRequestValidate = z.object({
	patientName: z
		.string()
		.min(2, "Patient name must be at least 2 characters")
		.max(255, "Patient name is too long"),
	blood_group: z.enum(BloodGroup, "Blood group should be valid."),
	unit_required: z
		.number()
		.int("Unit required must be an integer")
		.min(1, "At least 1 unit is required")
		.max(20, "Unit required cannot exceed 20"),
	exact_location: z
		.string()
		.min(2, "Location must be at least 2 characters")
		.max(255, "Location is too long"),
	expires_at: z.coerce.date("Invalid expiry date"),
	urgency: z.enum(RequestUrgency, "Urgency should be valid."),
	note: z.string().max(1000, "Note is too long").optional(),
});

export const UserValidation = {
	makeBloodRequestValidate,
};
