import { BookingStatus } from "../../../../prisma/generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import AppError from "../../utils/AppError"
import { validateUserById } from "../../utils/isUserExist"
import type { IUser } from "../auth/auth.interface"
import type { IBooking } from "./booking.interface"

const createBookingService = async (user: IUser, service_id: string, payload: IBooking) => {
    const userData = await validateUserById(user.userId)

    const service = await prisma.emergencyService.findUnique({ where: { id: service_id } })

    if (!service) {
        throw new AppError(404, "Service not found.")
    }

    if (service.service_status !== 'ACTIVE') {
        throw new AppError(400, "Service is not verified by the admin.")
    }

    const isBookingAlreadyExist = await prisma.bookingService.findFirst({
        where: {
            emergencyService_id: service_id,
            user_id: userData.id
        }
    })

    if (isBookingAlreadyExist) {
        if (isBookingAlreadyExist.booking_status === BookingStatus.CONFIRMED) {
            throw new AppError(400, "Booking is already confirmed. Please, wait!")
        }

        if (isBookingAlreadyExist.booking_status === BookingStatus.IN_PROGRESS ||
            isBookingAlreadyExist.booking_status === BookingStatus.PENDING) {
            throw new AppError(
                400,
                `You have an active booking for this service. Current status: ${isBookingAlreadyExist.booking_status.toLowerCase()}`
            )
        }
    }

    const createBooking = await prisma.bookingService.create({
        data: {
            patient_name: payload.patient_name,
            patient_number: payload.patient_number,
            payment_amount: service.price,
            payment_via: payload.payment_via,
            description: payload.description,
            emergency_location: payload.emergency_location,
            scheduled_at: payload.scheduled_at,
            note: payload.note,
            user_id: userData.id,
            emergencyService_id: service.id,
            hospital_id: service.hospital_id,
            booking_status: BookingStatus.PENDING
        }
    })

    return createBooking
}

export const BookingService = {
    createBookingService
}