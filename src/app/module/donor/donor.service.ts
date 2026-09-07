import {
	DonationStatus,
	DonorStatus,
	RequestStatus,
	Role,
} from "../../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { validateUserById } from "../../utils/isUserExist";
import type { IUser } from "../auth/auth.interface";
import type { IDonor, IUpdateDonation, IUpdateDonor } from "./donor.interface";

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

const getAllDonorsService = async () => {
	const donor = await prisma.donor.findMany();

	return donor;
};

const getDonationRequestService = async (user: IUser) => {
	const donation = await prisma.donation.findMany({
		where: {
			donor: {
				userId: user.userId,
			},
		},
	});

	return donation;
};

const getDetailsDonationRequestService = async (
	user: IUser,
	donation_id: string,
) => {
	const donation = await prisma.donation.findUnique({
		where: { id: donation_id },
		include: { donor: true },
	});

	if (!donation) {
		throw new AppError(404, "Donation request not found.");
	}

	const isAdministrative =
		user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN;

	if (!isAdministrative && donation.donor.userId !== user.userId) {
		throw new AppError(
			403,
			"Unauthorized access. You do not own this donation record.",
		);
	}

	return donation;
};

const updateDonationRequestService = async (
	user: IUser,
	donation_id: string,
	payload: IUpdateDonation,
) => {
	const donation = await prisma.donation.findUnique({
		where: { id: donation_id },
		include: { donor: true },
	});

	if (!donation) {
		throw new AppError(404, "Donation request not found.");
	}

	const isAdministrative =
		user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN;

	if (!isAdministrative && donation.donor.userId !== user.userId) {
		throw new AppError(
			403,
			"Unauthorized access. You do not own this donation record.",
		);
	}

	const result = await prisma.$transaction(async (tx) => {
		const updatedDonation = await tx.donation.update({
			where: { id: donation.id },
			data: {
				donationStatus: payload.donationStatus,
			},
		});

		if (
			updatedDonation.donationStatus === DonationStatus.ACCEPTED ||
			updatedDonation.donationStatus === DonationStatus.SCHEDULED
		) {
			await tx.requester.update({
				where: { id: donation.requester_id },
				data: {
					request_status: RequestStatus.IN_PROGRESS,
				},
			});
		} else if (updatedDonation.donationStatus === DonationStatus.COMPLETED) {
			await tx.requester.update({
				where: { id: donation.requester_id },
				data: {
					request_status: RequestStatus.COMPLETED,
				},
			});

			await tx.donation.update({
				where: { id: donation.id },
				data: {
					donated_at: new Date(),
				},
			});

			await tx.donor.update({
				where: {
					email: user.email,
				},
				data: {
					totalDonations: { increment: 1 },
					lastDonationDate: new Date(),
					availability: "ON_HOLD",
				},
			});
		} else if (
			updatedDonation.donationStatus === DonationStatus.DONOR_CANCELLED
		) {
			await tx.requester.update({
				where: { id: donation.requester_id },
				data: {
					request_status: RequestStatus.PENDING,
				},
			});
		} else {
			await tx.requester.update({
				where: { id: donation.requester_id },
				data: {
					request_status: RequestStatus.PENDING,
				},
			});
		}

		return updatedDonation;
	});

	return result;
};

const getDonorProfileService = async (donor_id: string) => {
	const donor = await prisma.donor.findUnique({
		where: { id: donor_id },
		include: {
			user: {
				select: {
					name: true,
					gender: true,
					phone: true,
					profile_pic: true,
				},
			},
		},
	});

	if (!donor) {
		throw new AppError(404, "Donor profile not found.");
	}

	return donor;
};

const updateDonorProfileService = async (
	user: IUser,
	payload: IUpdateDonor,
) => {
	const donor = await prisma.donor.findUnique({
		where: { userId: user.userId },
	});

	if (!donor) {
		throw new AppError(404, "Donor profile not found.");
	}

	const updateDonorProfile = await prisma.donor.update({
		where: {
			userId: user.userId,
		},
		data: {
			blood_group: payload.blood_group,
			age: payload.age,
			availability: payload.availability,
			weightKg: payload.weightKg,
			height: payload.height,
		},
	});

	return updateDonorProfile;
};

const getDonorRequestService = async (user: IUser) => {
	const donor = await prisma.donor.findUnique({
		where: { userId: user.userId },
	});

	if (!donor) {
		throw new AppError(404, "Donor not found found.");
	}

	const donations = await prisma.donation.findMany({
		where: {
			donor_id: donor.id,
		},
	});

	if (!donations) {
		throw new AppError(404, "No donation request found.");
	}

	return donations;
};

export const DonorService = {
	createDonorProfileService,
	getAllDonorsService,
	getDonationRequestService,
	getDetailsDonationRequestService,
	updateDonationRequestService,
	getDonorProfileService,
	updateDonorProfileService,
	getDonorRequestService,
};
