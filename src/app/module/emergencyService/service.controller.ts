import { catchAsync } from "../../utils/catchAsync"
import type { Request, Response } from 'express'
import type { IUser } from "../user/user.interface"
import { EmergencyService } from "./service.service"
import AppError from "../../utils/AppError"
import sendResponse from "../../utils/sendResponse"

const createServiceController = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const file = req.file?.buffer
    if (!file) {
        throw new AppError(400, "Service image is missing.")
    }

    const result = await EmergencyService.createService(user, req.body, file)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Emergency service created successfully",
        data: result,
    });
})

export const EmergencyServiceController = {
    createServiceController
}