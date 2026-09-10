import type {
	BloodGroup,
	Gender,
	RequestStatus,
	RequestUrgency,
	Role,
} from "../../../../prisma/generated/prisma/enums";
import type { SortOrder } from "../donor/donor.interface";

export interface IUser {
	userId: string;
	email: string;
	name: string;
	role: Role;
}

export interface IBloodRequester {
	patientName: string;
	blood_group: BloodGroup;
	unit_required: number;
	exact_location: string;

	expires_at: Date;

	urgency: RequestUrgency;
	note?: string;
}

export interface IRequestUpdate {
	patientName?: string;
	blood_group?: BloodGroup;
	unit_required?: number;
	exact_location?: string;
	expires_at?: Date;
	urgency?: RequestUrgency;
	note?: string;
	request_status?: Extract<RequestStatus, "PENDING" | "CANCELLED">;
}

export interface IUpdateProfile {
	name?: string;
	phone?: string;
	address?: string;
	gender?: Gender;
	profile_pic?: string;
	profile_pic_public_id?: string;
}

export interface IRequesterQuery {
	search?: string;
	blood_group?: BloodGroup;
	urgency?: RequestUrgency;
	sortBy?: SortOrder;
	page?: number;
	limit?: number;
}

export interface IUserQuery {
	search?: string;
	role?: Role;
	gender?: Gender;
	is_active?: boolean;
	is_blocked?: boolean;
	sortBy?: SortOrder;
	page?: number;
	limit?: number;
}

export interface IUpdateProfileStatus {
	is_active?: boolean;
	is_blocked?: boolean;
}