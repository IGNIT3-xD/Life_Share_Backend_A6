import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DonationService } from "./donation.service";
import type { Request, Response } from "express";

const createDonationController = catchAsync(
	async (req: Request, res: Response) => {
		const result = await DonationService.createDonationService(req.body);

		sendResponse(res, {
			statusCode: 201,
			success: true,
			message: "Donation created successfully",
			data: result,
		});
	},
);

export const DonationController = {
	createDonationController,
};
