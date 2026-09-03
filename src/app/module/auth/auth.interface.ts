import type { Gender, Role } from "../../../../prisma/generated/prisma/enums";

export interface IRegisterUser {
	name: string;
	email: string;
	password: string;
	phone?: string;
	address?: string;
	gender: Gender;
	role?: Role;
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