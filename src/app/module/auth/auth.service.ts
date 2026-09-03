import { AuthProvider, Role } from "../../../../prisma/generated/prisma/enums";
import config from "../../config";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions, type JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import type { ILoginUser, IRegisterUser, IUser } from "./auth.interface";
import cloudinary from "../../lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";

const registerUserService = async (payload: IRegisterUser, buffer?: Buffer) => {
	const { email, password, role } = payload;

	const isExist = await prisma.user.findUnique({ where: { email } });

	if (isExist) {
		throw new AppError(400, "User already exist. Please, login");
	}

	if (role === Role.ADMIN || role === "SUPER_ADMIN") {
		throw new AppError(
			400,
			"You are not eligible for self-registration with this role. Please contact an Administrator.",
		);
	}

	const hashedPassword = await bcrypt.hash(password, 8);

	let profile_pic: string | null = null;
	let profile_pic_public_id: string | null = null

	if (buffer) {
		const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
			cloudinary.uploader.upload_stream(
				{
					resource_type: 'image'
				},
				(error, result) => {
					if (error) {
						return reject(error);
					}
					if (!result) {
						return reject(new AppError(400, "Cloudinary upload failed without an error context."))
					}
					resolve(result)
				}
			).end(buffer)
		})

		profile_pic = uploadResult.secure_url;
		profile_pic_public_id = uploadResult.public_id;
	}

	const user = await prisma.user.create({
		data: {
			name: payload.name,
			email: payload.email,
			password: hashedPassword,
			phone: payload.phone,
			address: payload.address,
			gender: payload.gender,
			role: payload.role,
			profile_pic,
			profile_pic_public_id,
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

const getMeService = async (user: IUser) => {
	const userData = await prisma.user.findUnique({
		where: {
			email: user.email,
			id: user.userId,
		},
		omit: { password: true }
	});

	if (!userData) {
		throw new AppError(404, "User not found");
	}

	return userData
}

const refreshTokenService = async (rToken: string) => {
	const verfyToken = jwt.verify(rToken, config.JWT_REFRESH) as JwtPayload

	const { userId, name, email, role } = verfyToken

	const user = await prisma.user.findUnique({
		where: { id: userId, email },
	});

	if (!user || !user?.is_active || user.is_blocked) {
		throw new Error("User is inactive / blocked or not found.");
	}

	const jwtPayload = {
		userId,
		name,
		email,
		role,
	} as JwtPayload;

	const accessToken = jwt.sign(jwtPayload, config.JWT_ACCESS, {
		expiresIn: config.JWT_ACCESS_EXPIRES_IN,
	} as SignOptions);

	const refreshToken = jwt.sign(jwtPayload, config.JWT_REFRESH, {
		expiresIn: config.JWT_REFRESH_EXPIRES_IN,
	} as SignOptions);

	return { accessToken, refreshToken };
}

export const AuthServices = {
	registerUserService,
	loginUserService,
	getMeService,
	refreshTokenService,
};
