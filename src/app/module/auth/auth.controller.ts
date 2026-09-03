import type { Request, Response } from "express";
import config from "../../config";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

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

export const AuthController = {
	registerUserController,
	loginUser,
};
