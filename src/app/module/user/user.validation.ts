import z from "zod";
import {
	BloodGroup,
	Gender,
	RequestStatus,
	RequestUrgency,
} from "../../../../prisma/generated/prisma/enums";

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

const updateMyRequestValidationSchema = z.object({
	patientName: z
		.string()
		.min(2, "Patient name must be at least 2 characters")
		.max(255, "Patient name is too long")
		.optional(),
	blood_group: z.enum(BloodGroup, "Blood group should be valid.").optional(),
	unit_required: z
		.number()
		.int("Unit required must be an integer")
		.min(1, "At least 1 unit is required")
		.max(20, "Unit required cannot exceed 20")
		.optional(),
	exact_location: z
		.string()
		.min(2, "Location must be at least 2 characters")
		.max(255, "Location is too long")
		.optional(),
	expires_at: z.coerce.date("Invalid expiry date").optional(),
	urgency: z.enum(RequestUrgency, "Urgency should be valid.").optional(),
	note: z.string().max(1000, "Note is too long").optional(),
	request_status: z
		.enum(
			[RequestStatus.PENDING, RequestStatus.CANCELLED],
			"You can only cancel or pending the request status.",
		)
		.optional(),
});

const updateUserValidation = z.object({
	name: z
		.string("Name must be characters")
		.min(2, "Name must be at least 2 characters long.")
		.max(15, "Name is too long")
		.optional(),
	phone: z.string().optional().optional(),
	address: z.string().optional().optional(),
	gender: z.enum(Gender, "Gender must be Male, Female or Others").optional(),
});

export const UserValidation = {
	makeBloodRequestValidate,
	updateMyRequestValidationSchema,
	updateUserValidation,
};
