import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { validateUserById } from "../../utils/isUserExist";
import type { IBloodRequester, IUser } from "./user.interface";

const getMeService = async (user: IUser) => {
	const userData = await prisma.user.findUnique({
		where: {
			email: user.email,
			id: user.userId,
		},
		omit: { password: true },
	});

	if (!userData) {
		throw new AppError(404, "User not found");
	}

	return userData;
};

const makeBloodRequestService = async (
	payload: IBloodRequester,
	user: IUser,
) => {
	const isUserExist = await validateUserById(user.userId);

	const bloodRequest = await prisma.requester.create({
		data: {
			user_id: isUserExist.id,
			patientName: payload.patientName,
			blood_group: payload.blood_group,
			unit_required: payload.unit_required,
			exact_location: payload.exact_location,
			expires_at: payload.expires_at,
			urgency: payload.urgency,
			note: payload.note,
		},
		include: {
			user: { omit: { password: true } },
		},
	});

	return bloodRequest;
};

export const UserService = {
	getMeService,
	makeBloodRequestService,
};
