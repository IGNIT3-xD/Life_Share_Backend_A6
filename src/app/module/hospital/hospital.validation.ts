import z from "zod";

const createHospitalProfileValidate = z.object({
	license_number: z
		.string()
		.min(8, "License number must be at least 8 characters length")
		.max(12, "License number is too big."),
	description: z.string().min(10).max(255),
});

const updateHospitalProfileValidate = z.object({
	license_number: z
		.string()
		.min(8, "License number must be at least 8 characters length")
		.max(12, "License number is too big.")
		.optional(),
	description: z.string().min(10).max(255).optional(),
	hospital_name: z
		.string("Hospital Name must be characters")
		.min(10, "Name must be at least 2 characters long.")
		.max(255, "Name is too long")
		.optional(),
	hospital_address: z.string().min(5).max(255).optional(),
	hospital_phone: z
		.string()
		.min(11, "Phone no. must be 11 numbers")
		.max(14, "Phone no. is too long")
		.optional(),
});

export const HospitalValidation = {
	createHospitalProfileValidate,
	updateHospitalProfileValidate,
};
