import z from "zod";
import { Gender, Role } from "../../../../prisma/generated/prisma/enums";

const registerUserValidation = z.object({
	name: z
		.string("Name must be characters")
		.min(2, "Name must be at least 2 characters long.")
		.max(255, "Name is too long"),
	email: z.email("Enter an email."),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters long.")
		.max(20, "Password is too long")
		.regex(/[a-z]/, "Password must contain at least 1 lower case letter.")
		.regex(/[A-Z]/, "Password must contain at least 1 upper case letter.")
		.regex(/[0-9]/, "Password must contain at least 1 number.")
		.regex(
			/[^A-Za-z0-9\s]/,
			"Password must contain at least 1 special character.",
		),
	phone: z.string().optional(),
	address: z.string().optional(),
	gender: z.enum(Gender, "Gender must be Male, Female or Others"),
	role: z
		.enum(Role, "Role must be User, Donor or Hospital.")
		.optional()
		.default(Role.USER),
}).superRefine((data, ctx) => {
	if (data.role === 'HOSPITAL') {
		if (!data.phone || data.phone.trim() === "") {
			ctx.addIssue({
				code: "custom",
				message: "Phone number is strictly required for Hospital registration profiles.",
				path: ["phone"]
			})
		}

		if (!data.address || data.address.trim() === "") {
			ctx.addIssue({
				code: "custom",
				message: "Physical address is strictly required for Hospital registration profiles.",
				path: ["address"],
			});
		}
	}
})

const loginUserValidation = z.object({
	email: z.email("Enter an email."),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters long.")
		.max(20, "Password is too long")
		.regex(/[a-z]/, "Password must contain at least 1 lower case letter.")
		.regex(/[A-Z]/, "Password must contain at least 1 upper case letter.")
		.regex(/[0-9]/, "Password must contain at least 1 number.")
		.regex(
			/[^A-Za-z0-9\s]/,
			"Password must contain at least 1 special character.",
		),
});

const verifyEmail = z.object({
	email: z.email(),
	otp: z.string().length(6),
});

const forgetPassEmail = z.object({
	email: z.email(),
});

const resetPassword = z.object({
	email: z.email("Enter an email."),
	otp: z.string().length(6),
	newPassword: z
		.string()
		.min(6, "Password must be at least 6 characters long.")
		.max(20, "Password is too long")
		.regex(/[a-z]/, "Password must contain at least 1 lower case letter.")
		.regex(/[A-Z]/, "Password must contain at least 1 upper case letter.")
		.regex(/[0-9]/, "Password must contain at least 1 number.")
		.regex(
			/[^A-Za-z0-9\s]/,
			"Password must contain at least 1 special character.",
		),
});

export const UserValidation = {
	registerUserValidation,
	verifyEmail,
	loginUserValidation,
	forgetPassEmail,
	resetPassword,
};
