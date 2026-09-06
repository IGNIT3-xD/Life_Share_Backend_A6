import z from "zod";
import {
	BloodGroup,
	DonationStatus,
	DonorAvailability,
} from "../../../../prisma/generated/prisma/enums";

const createDonorProfileValidate = z.object({
	blood_group: z.enum(BloodGroup, "Blood group should be valid."),
	location: z
		.string()
		.min(2, "Location must be at least 2 characters")
		.max(255, "Location is too long"),
	age: z
		.number()
		.int("Age must be an integer")
		.min(18, "Donor must be at least 18 years old")
		.max(65, "Donor age cannot exceed 65"),
	weightKg: z
		.number()
		.positive("Weight must be greater than 0")
		.max(500, "Invalid weight"),
	height: z
		.number()
		.positive("Height must be greater than 0")
		.max(300, "Invalid height"),
	totalDonations: z
		.number()
		.int("Total donations must be an integer")
		.min(0, "Total donations cannot be negative")
		.optional(),
	lastDonationDate: z.coerce.date().optional(),
});

const updateDonationRequestValidate = z.object({
	donationStatus: z.enum(DonationStatus, "Donation status should be valid."),
});

const updateDonorProfileValidate = z.object({
	blood_group: z.enum(BloodGroup, "Blood group should be valid.").optional(),
	location: z
		.string()
		.min(2, "Location must be at least 2 characters")
		.max(255, "Location is too long")
		.optional(),
	age: z
		.number()
		.int("Age must be an integer")
		.min(18, "Donor must be at least 18 years old")
		.max(65, "Donor age cannot exceed 65")
		.optional(),
	weightKg: z
		.number()
		.positive("Weight must be greater than 0")
		.max(500, "Invalid weight")
		.optional(),
	height: z
		.number()
		.positive("Height must be greater than 0")
		.max(300, "Invalid height")
		.optional(),
	availability: z.enum(DonorAvailability).optional()
});

export const DonorValidtaion = {
	createDonorProfileValidate,
	updateDonationRequestValidate,
	updateDonorProfileValidate
};
