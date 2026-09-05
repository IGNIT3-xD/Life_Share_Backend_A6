import { isPast } from "date-fns";
import {
	DonationStatus,
	DonorStatus,
	VerificationStatus,
} from "../../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import type { IDonation } from "./donation.interface";

const createDonationService = async (payload: IDonation) => {
	const { donor_id, requester_id, scheduled_at } = payload;

	const requester = await prisma.requester.findUnique({
		where: { id: requester_id },
	});

	if (!requester) {
		throw new AppError(404, "Blood requester record not found.");
	}

	if (requester.verificationStatus !== VerificationStatus.VERIFIED) {
		throw new AppError(
			403,
			"This blood request profile has not been verified yet.",
		);
	}

	const donor = await prisma.donor.findUnique({ where: { id: donor_id } });

	if (!donor) {
		throw new AppError(404, "Target donor profile not found.");
	}

	if (donor.donorStatus !== DonorStatus.VERIFIED) {
		throw new AppError(403, "This donor profile has not been verified yet.");
	}

	if (donor.availability !== "AVAILABLE") {
		throw new AppError(400, "This donor is currently marked as unavailable.");
	}

	const existingActiveDonation = await prisma.donation.findFirst({
		where: {
			donor_id,
			requester_id,
			donationStatus: DonationStatus.PENDING,
		},
	});

	if (existingActiveDonation) {
		throw new AppError(
			400,
			"A pending donation matching this request and donor pair is already active.",
		);
	}

	const targetDate = new Date(scheduled_at);

	if (isPast(targetDate)) {
		throw new AppError(
			400,
			"The scheduled donation date cannot be in the past.",
		);
	}

	const donation = await prisma.donation.create({
		data: {
			donor_id,
			requester_id,
			scheduled_at,
		},
		include: {
			donor: true,
			requester: true,
		},
	});

	return donation;
};

export const DonationService = {
	createDonationService,
};
