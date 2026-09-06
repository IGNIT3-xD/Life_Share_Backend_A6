import { isPast } from "date-fns";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { validateUserById } from "../../utils/isUserExist";
import type { IBloodRequester, IRequestUpdate, IUser } from "./user.interface";

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

	const targetDate = new Date(payload.expires_at);

	if (isPast(targetDate)) {
		throw new AppError(400, "The expire date cannot be in the past.");
	}

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

const getAllRequestersService = async () => {
	const requester = await prisma.requester.findMany();

	return requester;
};

const getMyRequestService = async (user: IUser) => {
	const request = await prisma.requester.findMany({
		where: {
			user_id: user.userId
		}
	})

	if (!request) {
		throw new AppError(404, "No request record found.")
	}

	return request
}

const getMyRequestDetailsService = async (user: IUser, request_id: string) => {
	const requestData = await prisma.requester.findUnique({
		where: {
			id: request_id
		},
		include: {
			donations: true
		}
	})

	if (!requestData) {
		throw new AppError(404, "No request record found.")
	}

	if (requestData.user_id !== user.userId) {
		throw new AppError(403, "Unauthorized access. You do not own this request record.")
	}

	return requestData
}

const updateMyRequestService = async (user: IUser, request_id: string, payload: IRequestUpdate) => {
	const requestData = await prisma.requester.findUnique({
		where: { id: request_id }
	})

	if (!requestData) {
		throw new AppError(404, "No request record found.")
	}

	if (requestData.user_id !== user.userId) {
		throw new AppError(403, "Unauthorized access. You do not own this request record.")
	}

	const updateRequesterDetails = await prisma.requester.update({
		where: { id: request_id },
		data: {
			patientName: payload.patientName,
			blood_group: payload.blood_group,
			unit_required: payload.unit_required,
			exact_location: payload.exact_location,
			expires_at: payload.expires_at,
			urgency: payload.urgency,
			note: payload.note,
			request_status: payload.request_status
		}
	})

	return updateRequesterDetails
}

const deleteMyRequestService = async (user: IUser, request_id: string) => {
	const requestData = await prisma.requester.findUnique({
		where: { id: request_id }
	})

	if (!requestData) {
		throw new AppError(404, "No request record found.")
	}

	if (requestData.user_id !== user.userId) {
		throw new AppError(403, "Unauthorized access. You do not own this request record.")
	}

	await prisma.requester.delete({
		where: { id: request_id }
	})

	return null
}

export const UserService = {
	getMeService,
	makeBloodRequestService,
	getAllRequestersService,
	getMyRequestService,
	getMyRequestDetailsService,
	updateMyRequestService,
	deleteMyRequestService
};
