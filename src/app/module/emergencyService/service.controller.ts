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

const getAllServiceController = catchAsync(async (_req: Request, res: Response) => {
    const result = await EmergencyService.getAllService()

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Emergency services retrieved successfully",
        data: result,
    });
})

const getServiceDetailsController = catchAsync(async (req: Request, res: Response) => {
    const result = await EmergencyService.getServiceDetails(req.params.id as string)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Emergency service details retrieved successfully",
        data: result,
    });
})

const getMyServicesController = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser
    const result = await EmergencyService.getMyServices(user)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "My Emergency services retrieved successfully",
        data: result,
    });
})

const updateMyServicesController = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser
    const id = req.params.id as string

    const result = await EmergencyService.updateMyService(user, id, req.body, req.file?.buffer)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Emergency service updated successfully",
        data: result,
    });
})

const deleteMyServicesController = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser
    const id = req.params.id as string

    await EmergencyService.deleteMyService(user, id)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Emergency service deleted successfully"
    });
})

export const EmergencyServiceController = {
    createServiceController,
    getAllServiceController,
    getServiceDetailsController,
    getMyServicesController,
    updateMyServicesController,
    deleteMyServicesController
}