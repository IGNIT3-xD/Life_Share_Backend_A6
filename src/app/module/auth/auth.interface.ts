import type { Gender, Role } from "../../../../prisma/generated/prisma/enums";

export interface IRegisterUser {
	id: string;
	name: string;
	email: string;
	password: string;
	phone?: string;
	address?: string;
	gender: Gender;
	role?: Role;
	profile_pic?: string;
	profile_pic_public_id?: string;
}

export interface ILoginUser {
	email: string;
	password: string;
}

export interface IUser {
	userId: string;
	email: string;
	name: string;
	role: Role;
}

export interface IVerifyRegisterOtp {
	email: string;
	otp: string;
}
