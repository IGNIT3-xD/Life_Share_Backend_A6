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
		const result = await DonorService.getAllDonorsService(req.query);

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
		const user = req.user as IUser;
		const result = await DonorService.getDonationRequestService(user, req.query);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Donation requests retrieved successfully",
			data: result,
		});
	},
);

const getDetailsDonationRequestController = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as IUser;
		const donation_id = req.params.id as string;

		const result = await DonorService.getDetailsDonationRequestService(
			user,
			donation_id,
		);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Donation request retrieved successfully",
			data: result,
		});
	},
);

const updateDonationRequestController = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as IUser;
		const donation_id = req.params.id as string;

		const result = await DonorService.updateDonationRequestService(
			user,
			donation_id,
			req.body,
		);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Donation request updated successfully",
			data: result,
		});
	},
);

const getDonorProfileController = catchAsync(
	async (req: Request, res: Response) => {
		const donor_id = req.params.id as string;

		const result = await DonorService.getDonorProfileService(donor_id);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Donor profile retrieved successfully",
			data: result,
		});
	},
);

const updateDonorProfileController = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as IUser;

		const result = await DonorService.updateDonorProfileService(user, req.body);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Donor profile updated successfully",
			data: result,
		});
	},
);

const getDonorRequestController = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as IUser;

		const result = await DonorService.getDonorRequestService(user);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Donor requesters retrieved successfully",
			data: result,
		});
	},
);

// Admin Controlled
const adminGetAllDonorsController = catchAsync(
	async (req: Request, res: Response) => {
		const result = await DonorService.adminGetAllDonorsService(req.query);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "All Donors retrieved successfully",
			data: result,
		});
	},
);

const updateDonorProfileStatusController = catchAsync(
	async (req: Request, res: Response) => {
		const donor_id = req.params.id as string;

		const result = await DonorService.updateDonorProfileStatusService(donor_id, req.body);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Donor profile retrieved successfully",
			data: result,
		});
	},
);

const deleteDonorProfileController = catchAsync(
	async (req: Request, res: Response) => {
		const donor_id = req.params.id as string;
		const user = req.user as IUser

		await DonorService.deleteDonorProfileService(user, donor_id);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Donor profile deleted successfully",
		});
	},
);

export const DonorController = {
	createDonorProfileController,
	getAllDonorsController,
	getDonationRequestController,
	getDetailsDonationRequestController,
	updateDonationRequestController,
	getDonorProfileController,
	updateDonorProfileController,
	getDonorRequestController,
	updateDonorProfileStatusController,
	adminGetAllDonorsController,
	deleteDonorProfileController
};
