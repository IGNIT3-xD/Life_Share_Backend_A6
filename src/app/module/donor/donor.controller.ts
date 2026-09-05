import { catchAsync } from "../../utils/catchAsync";
import type { Request, Response } from "express";
import type { IUser } from "../auth/auth.interface";
import { DonorService } from "./donor.service";
import sendResponse from "../../utils/sendResponse";

const createDonorProfileController = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as IUser;

		const result = await DonorService.createDonorProfileService(req.body, user);

		sendResponse(res, {
			statusCode: 201,
			success: true,
			message: "Donor profile created successfully",
			data: result,
		});
	},
);

const getAllDonorsController = catchAsync(
	async (req: Request, res: Response) => {
		const result = await DonorService.getAllDonorsService();

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Donors retrieved successfully",
			data: result,
		});
	},
);

const getDonationRequestController = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as IUser
		const result = await DonorService.getDonationRequestService(user);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Donation requests retrieved successfully",
			data: result,
		});
	},
);

export const DonorController = {
	createDonorProfileController,
	getAllDonorsController,
	getDonationRequestController
};
