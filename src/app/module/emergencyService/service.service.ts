import type { UploadApiResponse } from "cloudinary"
import cloudinary from "../../lib/cloudinary"
import { prisma } from "../../lib/prisma"
import AppError from "../../utils/AppError"
import { validateUserById } from "../../utils/isUserExist"
import type { IUser } from "../user/user.interface"
import type { IService } from "./service.interface"

const createService = async (user: IUser, payload: IService, buffer: Buffer) => {
    const userData = await validateUserById(user.userId)

    const hospital = await prisma.hospital.findUnique({
        where: {
            user_id: userData.id
        }
    })

    if (!hospital) {
        throw new AppError(404, "Hospital profile not found.")
    }

    if (hospital.hospital_status !== 'VERIFIED') {
        throw new AppError(400, "Hospital profile is not verified.")
    }

    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.upload_stream({
            resource_type: 'image'
        },
            (err, result) => {
                if (err) {
                    return reject(err)
                }
                if (!result) {
                    return reject(new AppError(400, "Cloudinary upload failed."))
                }
                resolve(result)
            }

        ).end(buffer)
    })

    const service = await prisma.emergencyService.create({
        data: {
            service_name: payload.service_name,
            service_category: payload.service_category,
            description: payload.description,
            price: payload.price,
            availability: payload.availability,
            hospital_id: hospital.id,
            service_image: uploadResult.secure_url,
            service_image_public_id: uploadResult.public_id
        },
        include: {
            hospital: {
                select: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            address: true,
                            phone: true
                        }
                    }
                }
            },
        }
    })

    return service
}

export const EmergencyService = {
    createService
}