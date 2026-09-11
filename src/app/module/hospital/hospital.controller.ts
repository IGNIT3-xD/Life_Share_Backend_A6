import { catchAsync } from "../../utils/catchAsync";
import type { Request, Response } from "express";
import type { IUser } from "../auth/auth.interface";
import { HospitalService } from "./hospital.service";
import sendResponse from "../../utils/sendResponse";

const createHospitalProfileController = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as IUser;

		const result = await HospitalService.createHospitalProfileService(
			user,
			req.body,
		);

		sendResponse(res, {
			success: true,
			statusCode: 201,
			message: "Hospital profile created successfully",
			data: result,
		});
	},
);

const getMyHospitalProfileController = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as IUser;

		const result = await HospitalService.getMyHospitalProfileService(user);

		sendResponse(res, {
			success: true,
			statusCode: 200,
			message: "Hospital profile retrieved successfully",
			data: result,
		});
	},
);

const updateHospitalProfileController = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as IUser;

		const result = await HospitalService.updateHospitalProfileService(
			user,
			req.body,
		);

		sendResponse(res, {
			success: true,
			statusCode: 200,
			message: "Hospital profile updated successfully",
			data: result,
		});
	},
);

// Admin controlled
const getAllHospitalProfileController = catchAsync(
	async (req: Request, res: Response) => {
		const result = await HospitalService.getAllHospitalProfile(req.query);

		sendResponse(res, {
			success: true,
			statusCode: 200,
			message: "Hospital profiles retrieved successfully",
			data: result,
		});
	},
);

const getHospitalProfileDetailsController = catchAsync(
	async (req: Request, res: Response) => {
		const result = await HospitalService.getHospitalProfileDetails(
			req.params.id as string,
		);

		sendResponse(res, {
			success: true,
			statusCode: 200,
			message: "Hospital profile details retrieved successfully",
			data: result,
		});
	},
);

const updateHospitalProfileStatusController = catchAsync(
	async (req: Request, res: Response) => {
		const result = await HospitalService.updateHospitalProfileStatus(
			req.params.id as string,
			req.body,
		);

		sendResponse(res, {
			success: true,
			statusCode: 200,
			message: "Hospital profile status updated successfully",
			data: result,
		});
	},
);

const deleteHospitalProfileController = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as IUser;
		await HospitalService.deleteHospitalProfile(user, req.params.id as string);

		sendResponse(res, {
			success: true,
			statusCode: 200,
			message: "Hospital profile deleted updated successfully",
		});
	},
);

export const HospitalController = {
	createHospitalProfileController,
	getMyHospitalProfileController,
	updateHospitalProfileController,
	getAllHospitalProfileController,
	getHospitalProfileDetailsController,
	updateHospitalProfileStatusController,
	deleteHospitalProfileController,
};
