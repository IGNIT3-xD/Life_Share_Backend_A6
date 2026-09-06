import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import type { IUser } from "./user.interface";
import type { Request, Response } from "express";
import { UserService } from "./user.service";

const getMeController = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as IUser;

	const result = await UserService.getMeService(user);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "User profile retrieved successfully.",
		data: result,
	});
});

const makeBloodRequestController = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as IUser;

		const result = await UserService.makeBloodRequestService(req.body, user);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Blood request send successfully.",
			data: result,
		});
	},
);

const getAllRequesterController = catchAsync(
	async (req: Request, res: Response) => {
		const result = await UserService.getAllRequestersService();

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Requester retrieved successfully",
			data: result,
		});
	},
);

export const UserController = {
	getMeController,
	makeBloodRequestController,
	getAllRequesterController,
};
