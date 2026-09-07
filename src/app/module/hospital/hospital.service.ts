import { HospitalStatus } from "../../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { validateUserById } from "../../utils/isUserExist";
import type { IUser } from "../user/user.interface";
import type {
	HospitalProfile,
	IUpdateHospitalProfile,
} from "./hospital.interface";

const createHospitalProfileService = async (
	user: IUser,
	payload: HospitalProfile,
) => {
	const isExist = await prisma.hospital.findUnique({
		where: { user_id: user.userId },
	});

	if (isExist) {
		throw new AppError(400, "Hospital profile is alrady exist.");
	}

	const createProfile = await prisma.hospital.create({
		data: {
			license_number: payload.license_number,
			description: payload.description,
			hospital_status: HospitalStatus.IN_PROGRESS,
			user_id: user.userId,
		},
		include: {
			user: {
				select: {
					name: true,
					email: true,
					address: true,
				},
			},
		},
	});

	return createProfile;
};

const getMyHospitalProfileService = async (user: IUser) => {
	const isExist = await prisma.hospital.findUnique({
		where: { user_id: user.userId },
		include: {
			user: {
				select: {
					name: true,
					email: true,
					address: true,
					phone: true,
					email_verified: true,
				},
			},
		},
	});

	if (!isExist) {
		throw new AppError(404, "Hospital profile not found.");
	}

	return isExist;
};

const updateHospitalProfileService = async (
	user: IUser,
	payload: IUpdateHospitalProfile,
) => {
	const isExist = await prisma.hospital.findUnique({
		where: { user_id: user.userId },
	});

	if (!isExist) {
		throw new AppError(404, "Hospital profile is not exist.");
	}

	const userData = await validateUserById(user.userId);

	const updateProfile = await prisma.hospital.update({
		where: {
			user_id: userData.id,
		},
		data: {
			license_number: payload.license_number,
			description: payload.description,
			user: {
				update: {
					name: payload.hospital_name,
					address: payload.hospital_address,
					phone: payload.hospital_phone,
				},
			},
		},
		include: {
			user: {
				select: {
					name: true,
					email: true,
					address: true,
					phone: true,
				},
			},
		},
	});

	return updateProfile;
};

export const HospitalService = {
	createHospitalProfileService,
	getMyHospitalProfileService,
	updateHospitalProfileService,
};
