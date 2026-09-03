import type { Gender, Role } from "../../../../prisma/generated/prisma/enums";

export interface IRegisterUser {
	name: string;
	email: string;
	password: string;
	phone?: string;
	address?: string;
	gender: Gender;
	profile_pic?: string;
	role?: Role;
}

export interface ILoginUser {
	email: string;
	password: string;
}
