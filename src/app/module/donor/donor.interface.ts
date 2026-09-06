import type {
	BloodGroup,
	DonationStatus,
	DonorAvailability,
} from "../../../../prisma/generated/prisma/enums";

export interface IDonor {
	email: string;
	blood_group: BloodGroup;
	location: string;
	age: number;
	availability?: DonorAvailability;
	weightKg: number;
	height: number;
	totalDonations?: number | null;
	lastDonationDate?: Date | null;
}

export interface IUpdateDonor {
	blood_group?: BloodGroup;
	location?: string;
	age?: number;
	availability?: DonorAvailability;
	weightKg?: number;
	height?: number;
}

export interface IUpdateDonation {
	donationStatus: DonationStatus;
}
