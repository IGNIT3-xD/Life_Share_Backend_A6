import { AuthProvider, Role } from "../../../../prisma/generated/prisma/enums";
import config from "../../config";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions, type JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import type { ILoginUser, IRegisterUser } from "./auth.interface";

const registerUserService = async (payload: IRegisterUser) => {
	const { email, password, role } = payload;

	const isExist = await prisma.user.findUnique({ where: { email } });

	if (isExist) {
		throw new AppError(400, "User is already exist. Please, login");
	}

	if (role === Role.ADMIN || role === "SUPER_ADMIN") {
		throw new AppError(
			400,
			"Currently, You are not eligable for registration. Please, contact with the Admin",
		);
	}

	const hashedPassword = await bcrypt.hash(password, 8);

	const user = await prisma.user.create({
		data: {
			name: payload.name,
			email: payload.email,
			password: hashedPassword,
			phone: payload.phone,
			address: payload.address,
			gender: payload.gender,
			role: payload.role,
			profile_pic: payload.profile_pic,
			auth_provider: AuthProvider.CREDENTIAL,
		},
		omit: {
			password: true,
		},
	});

	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	} as JwtPayload;

	const accessToken = jwt.sign(jwtPayload, config.JWT_ACCESS, {
		expiresIn: config.JWT_ACCESS_EXPIRES_IN,
	} as SignOptions);

	const refreshToken = jwt.sign(jwtPayload, config.JWT_REFRESH, {
		expiresIn: config.JWT_REFRESH_EXPIRES_IN,
	} as SignOptions);

	return { user, accessToken, refreshToken };
};

const loginUserService = async (payload: ILoginUser) => {
	const { email, password } = payload;

	const user = await prisma.user.findUnique({ where: { email } });

	if (!user) {
		throw new AppError(404, "User not found");
	}

	const matchedPassword = await bcrypt.compare(
		password,
		user?.password as string,
	);

	if (!matchedPassword) {
		throw new AppError(400, "Invalid credentials");
	}

	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	} as JwtPayload;

	const accessToken = jwt.sign(jwtPayload, config.JWT_ACCESS, {
		expiresIn: config.JWT_ACCESS_EXPIRES_IN,
	} as SignOptions);

	const refreshToken = jwt.sign(jwtPayload, config.JWT_REFRESH, {
		expiresIn: config.JWT_REFRESH_EXPIRES_IN,
	} as SignOptions);

	return { accessToken, refreshToken };
};

export const AuthServices = {
	registerUserService,
	loginUserService,
};
