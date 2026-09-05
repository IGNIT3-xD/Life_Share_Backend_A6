import { DonorStatus } from "../../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { validateUserById } from "../../utils/isUserExist";
import type { IUser } from "../auth/auth.interface";
import type { IDonor } from "./donor.interface";

const createDonorProfileService = async (payload: IDonor, user: IUser) => {
	const isUserExist = await validateUserById(user.userId);
	// console.log(isUserExist);

	const isDonorExist = await prisma.donor.findUnique({
		where: { email: isUserExist.email },
	});

	if (isDonorExist) {
		throw new AppError(400, "Donor profile is already exist.");
	}

	const donor = await prisma.donor.create({
		data: {
			userId: isUserExist.id,
			email: isUserExist.email,
			age: payload.age,
			blood_group: payload.blood_group,
			location: payload.location,
			height: payload.height,
			weightKg: payload.weightKg,
			availability: payload.availability,
			donorStatus: DonorStatus.IN_PROGRESS,
			totalDonations: payload.totalDonations,
			lastDonationDate: payload.lastDonationDate,
		},
		include: {
			user: { omit: { password: true } },
		},
	});

	return donor;
};

export const DonorService = {
	createDonorProfileService,
};
