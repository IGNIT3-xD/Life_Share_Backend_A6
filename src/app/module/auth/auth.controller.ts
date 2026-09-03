import type { Request, Response } from "express";
import config from "../../config";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import type { IUser } from "./auth.interface";

const registerUserController = catchAsync(
	async (req: Request, res: Response) => {
		const result = await AuthServices.registerUserService(req.body);

		const { user, accessToken, refreshToken } = result;

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			sameSite: "lax",
			secure: config.NODE_ENV !== "development",
			maxAge: 1000 * 60 * 60 * 24,
		});
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			sameSite: "lax",
			secure: config.NODE_ENV !== "development",
			maxAge: 1000 * 60 * 60 * 24 * 7,
		});

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "User registered successfully.",
			data: {
				user,
				accessToken,
				refreshToken,
			},
		});
	},
);

const loginUser = catchAsync(async (req: Request, res: Response) => {
	const result = await AuthServices.loginUserService(req.body);

	const { accessToken, refreshToken } = result;

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		sameSite: "lax",
		secure: config.NODE_ENV !== "development",
		maxAge: 1000 * 60 * 60 * 24,
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		sameSite: "lax",
		secure: config.NODE_ENV !== "development",
		maxAge: 1000 * 60 * 60 * 24 * 7,
	});

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "User login successfully.",
		data: {
			accessToken,
			refreshToken,
		},
	});
});

const getMeController = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as IUser

	const result = await AuthServices.getMeService(user);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "User profile retrieved successfully.",
		data: result
	});
});

const refreshTokenController = catchAsync(
	async (req: Request, res: Response) => {
		if (!req.cookies.refreshToken) {
			throw new Error("Refresh token is missing");
		}

		const result = await AuthServices.refreshTokenService(req.cookies.refreshToken);

		const { accessToken, refreshToken: newRefreshToken } = result;

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			sameSite: "lax",
			secure: config.NODE_ENV !== "development",
			maxAge: 1000 * 60 * 60 * 24,
		});
		res.cookie("refreshToken", newRefreshToken, {
			httpOnly: true,
			sameSite: "lax",
			secure: config.NODE_ENV !== "development",
			maxAge: 1000 * 60 * 60 * 24 * 7,
		});

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Token generated successfully.",
			data: {
				accessToken,
				refreshToken: newRefreshToken,
			},
		});
	},
);

export const AuthController = {
	registerUserController,
	loginUser,
	getMeController,
	refreshTokenController
};
