import {
	BloodGroup,
	DonorAvailability,
	DonorStatus,
	Gender,
	Role,
} from "../../../prisma/generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import AppError from "./AppError";

async function hashPassword(password: string) {
	return await bcrypt.hash(password, 8);
}

export const seedSuperAdmin = async () => {
	try {
		const superAdmin = await prisma.user.findFirst({
			where: {
				role: Role.SUPER_ADMIN,
			},
		});

		if (superAdmin) {
			// console.log("Super Admin is already exist!");
			return;
		}

		const name = config.SUPER_ADMIN_NAME;
		const email = config.SUPER_ADMIN_EMAIL;
		const password = config.SUPER_ADMIN_PASSWORD as string;

		if (!name || !email || !password) {
			throw new AppError(
				400,
				"Super Admin Name , Email, Password Missing In Env File!!!",
			);
		}

		// const hashedPassword = await bcrypt.hash(password, 8)

		const hashedPassword = await hashPassword(password);

		await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				gender: Gender.MALE,
				role: Role.SUPER_ADMIN,
				email_verified: true,
			},
			omit: { password: true },
		});

		// console.log("Super Admin Has Been Created : ", createSuperAdmin);
	} catch (error) {
		console.log("Error Seeding Super Admin : ", error);
		try {
			await prisma.user.delete({
				where: {
					email: config.SUPER_ADMIN_EMAIL,
				},
			});
		} catch {
			// User may not exist, ignore cleanup error
		}
	}
};

export const seedTesterAdmin = async () => {
	try {
		const name = config.TESTER_ADMIN_NAME;
		const email = config.TESTER_ADMIN_EMAIL;
		const password = config.TESTER_ADMIN_PASSWORD;

		const testerAdmin = await prisma.user.findUnique({
			where: { email, role: Role.ADMIN },
		});

		if (testerAdmin) {
			// console.log("Tester Admin is already exist!");
			return;
		}

		if (!name || !email || !password) {
			throw new AppError(
				400,
				"Tester Admin Name , Email, Password Missing In Env File!!!",
			);
		}

		const hashedPassword = await hashPassword(password);

		await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				gender: Gender.MALE,
				role: Role.ADMIN,
				email_verified: true,
			},
			omit: { password: true },
		});

		// console.log("Tester Admin Has Been Created : ", createTesterAdmin);
	} catch (error) {
		console.log("Error Seeding Tester Admin : ", error);
		try {
			await prisma.user.delete({
				where: {
					email: config.TESTER_ADMIN_EMAIL,
				},
			});
		} catch {
			// User may not exist, ignore cleanup error
		}
	}
};

export const seedTesterDonor = async () => {
	try {
		const name = config.TESTER_DONOR_NAME;
		const email = config.TESTER_DONOR_EMAIL;
		const password = config.TESTER_DONOR_PASSWORD;

		const testerDonor = await prisma.user.findUnique({
			where: { email, role: Role.DONOR },
		});

		if (testerDonor) {
			// console.log("Tester Donor is already exist!");
			return;
		}

		if (!name || !email || !password) {
			throw new AppError(
				400,
				"Tester Donor Name , Email, Password Missing In Env File!!!",
			);
		}

		const hashedPassword = await hashPassword(password);

		await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				gender: Gender.MALE,
				role: Role.DONOR,
				email_verified: true,
				donor: {
					create: {
						email,
						age: 24,
						blood_group: BloodGroup.A_POS,
						location: "Anywhere in Dhaka",
						weightKg: 75,
						height: 165,
						availability: DonorAvailability.AVAILABLE,
						donorStatus: DonorStatus.VERIFIED,
					},
				},
			},
			omit: { password: true },
		});

		// console.log("Tester Donor Has Been Created : ", createTesterDonor);
	} catch (error) {
		console.log("Error Seeding Tester Donor : ", error);
		try {
			await prisma.user.delete({
				where: {
					email: config.TESTER_DONOR_EMAIL,
				},
			});
		} catch {
			// User may not exist, ignore cleanup error
		}
	}
};

export const seedTesterHospital = async () => {
	try {
		const name = config.TESTER_HOSPITAL_NAME;
		const email = config.TESTER_HOSPITAL_EMAIL;
		const password = config.TESTER_HOSPITAL_PASSWORD;

		const testerHospital = await prisma.user.findUnique({
			where: { email, role: Role.HOSPITAL },
		});

		if (testerHospital) {
			// console.log("Tester Hospital is already exist!");
			return;
		}

		if (!name || !email || !password) {
			throw new AppError(
				400,
				"Tester Hospital Name , Email, Password Missing In Env File!!!",
			);
		}

		const hashedPassword = await hashPassword(password);

		await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				gender: Gender.OTHERS,
				role: Role.HOSPITAL,
				email_verified: true,
				address: "Tester Hospital Address",
				phone: "01xxxxxxx",
				hospital: {
					create: {
						license_number: "TEST1234",
						description: "This is tester hospital.",
						hospital_status: "VERIFIED",
					},
				},
			},
			omit: { password: true },
		});

		// console.log("Tester Admin Has Been Created : ", createTesterHospital);
	} catch (error) {
		console.log("Error Seeding Tester Hospital : ", error);
		try {
			await prisma.user.delete({
				where: {
					email: config.TESTER_HOSPITAL_EMAIL,
				},
			});
		} catch {
			// User may not exist, ignore cleanup error
		}
	}
};
