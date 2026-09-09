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

export const PaymentController = {
	createPaymentController,
	createPaymentCallbackController,
};
