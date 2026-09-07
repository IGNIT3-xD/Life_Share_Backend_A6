import { catchAsync } from "../../utils/catchAsync"
import type { Request, Response } from 'express'
import { IUser } from "../auth/auth.interface"
import { HospitalService } from "./hospital.service"
import sendResponse from "../../utils/sendResponse"

const createHospitalProfileController = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const result = await HospitalService.createHospitalProfileService(user, req.body)

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Hospital profile created successfully",
        data: result
    })
})

export const HospitalController = {
    createHospitalProfileController
}