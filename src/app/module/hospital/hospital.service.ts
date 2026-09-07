import { HospitalStatus } from "../../../../prisma/generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import AppError from "../../utils/AppError"
import { IUser } from "../user/user.interface"
import { HospitalProfile } from "./hospital.interface"

const createHospitalProfileService = async (user: IUser, payload: HospitalProfile) => {
    const isExist = await prisma.hospital.findUnique({ where: { user_id: user.userId } })

    if (isExist) {
        throw new AppError(400, "Hospital profile is alrady exist.")
    }

    const createProfile = await prisma.hospital.create({
        data: {
            license_number: payload.license_number,
            description: payload.description,
            hospital_status: HospitalStatus.IN_PROGRESS,
            user_id: user.userId
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    address: true,
                }
            }
        }
    })

    return createProfile
}

export const HospitalService = {
    createHospitalProfileService
}