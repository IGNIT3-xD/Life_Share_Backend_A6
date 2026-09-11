import { catchAsync } from "../../utils/catchAsync";
import type { Request, Response } from "express";
import type { IUser } from "../auth/auth.interface";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const createPaymentController = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as IUser;
		const booking_id = req.params.id as string;

		const result = await PaymentService.createPayemntService(user, booking_id);

		sendResponse(res, {
			success: true,
			statusCode: 201,
			message: "Payment created successfully",
			data: result,
		});
	},
);

const createPaymentCallbackController = catchAsync(
	async (req: Request, res: Response) => {
		const { redirectUrl } = await PaymentService.createPaymentCallbackService(
			req.query,
		);

		res.redirect(redirectUrl);
	},
);

const getMyPaymentsController = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as IUser;

		const result = await PaymentService.getMyPayments(user, req.query);

		sendResponse(res, {
			success: true,
			statusCode: 201,
			message: "Payments retrieved successfully",
			data: result,
		});
	},
);

const getAllPaymentsController = catchAsync(
	async (req: Request, res: Response) => {
		const result = await PaymentService.getAllPayments(req.query);

		sendResponse(res, {
			success: true,
			statusCode: 201,
			message: "Payments retrieved successfully",
			data: result,
		});
	},
);

const getAllPaymentsHospitalController = catchAsync(
	async (req: Request, res: Response) => {
		const result = await PaymentService.getAllPaymentsHospital(
			req.query,
			req.user as IUser,
		);

		sendResponse(res, {
			success: true,
			statusCode: 201,
			message: "Payments retrieved successfully",
			data: result,
		});
	},
);

const getPaymentDetailsController = catchAsync(
	async (req: Request, res: Response) => {
		const result = await PaymentService.getPaymentDetails(
			req.params.id as string,
			req.user as IUser,
		);

		sendResponse(res, {
			success: true,
			statusCode: 201,
			message: "Payment details retrieved successfully",
			data: result,
		});
	},
);

const updatePaymentStatusController = catchAsync(
	async (req: Request, res: Response) => {
		const result = await PaymentService.updatePaymentStatus(
			req.params.id as string,
			req.body,
		);

		sendResponse(res, {
			success: true,
			statusCode: 200,
			message: "Payment status updated successfully",
			data: result,
		});
	},
);

export const PaymentController = {
	createPaymentController,
	createPaymentCallbackController,
	getMyPaymentsController,
	getAllPaymentsController,
	getPaymentDetailsController,
	getAllPaymentsHospitalController,
	updatePaymentStatusController,
};
