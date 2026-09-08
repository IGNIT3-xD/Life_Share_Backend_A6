import { catchAsync } from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import type { Request, Response } from "express";
import { BookingService } from "./booking.service";
import type { IUser } from "../user/user.interface";

const createBookingController = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser
    const service_id = req.params.id as string

    const result = await BookingService.createBookingService(user, service_id, req.body)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking created successfully",
        data: result,
    });
})

export const BookingController = {
    createBookingController
}