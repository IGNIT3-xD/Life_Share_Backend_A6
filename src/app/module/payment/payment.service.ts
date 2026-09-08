import { BookingStatus, PaymentVia } from "../../../../prisma/generated/prisma/enums"
import config from "../../config"
import { getBkashIdToken } from "../../lib/bkash"
import { prisma } from "../../lib/prisma"
import AppError from "../../utils/AppError"
import { validateUserById } from "../../utils/isUserExist"
import type { IUser } from "../user/user.interface"

const createPayemntService = async (user: IUser, booking_id: string) => {
    const userData = await validateUserById(user.userId)

    const booking = await prisma.bookingService.findUnique({
        where: { id: booking_id }
    })

    if (!booking) {
        throw new AppError(404, "Not booking found.")
    }

    if (booking.booking_status !== BookingStatus.ACCEPTED) {
        throw new AppError(403, `Your booking is ${booking.booking_status}`)
    }

    if (userData.id !== booking.user_id) {
        throw new AppError(403, "Unauthorized access.")
    }

    const payment = await prisma.payment.findFirst({
        where: {
            user_id: userData.id,
            emergencyService_id: booking.emergencyService_id
        }
    })

    if (payment?.payment_status === 'PAID') {
        throw new AppError(400, "You have already paid for this service.")
    }

    // Initialize payment
    const result = await prisma.$transaction(async (tx) => {
        const bkashIdToken = await getBkashIdToken()

        if (!bkashIdToken) {
            throw new AppError(404, "Bkash id token not found.")
        }

        const createPayment = await fetch(`${config.BKASH_BASE_URL}/tokenized/checkout/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: bkashIdToken,
                "X-App-Key": config.BKASH_APP_KEY,
            },
            body: JSON.stringify({
                agreementID: "TokenizedMerchant01L3IKB6H1565072174986",
                mode: "0011",
                payerReference: user.email,
                callbackURL: `${config.BACKEND_URL}/api/v1/payment/callback`,
                merchantAssociationInfo: "MI05MID54RF09123456One",
                amount: booking.payment_amount,
                currency: "BDT",
                intent: "sale",
                merchantInvoiceNumber: booking.id,
            })
        })

        const paymentResult = await createPayment.json();

        await tx.payment.create({
            data: {
                payment_amount: paymentResult.amount,
                payment_gateway: PaymentVia.BKASH,
                merchant_invoice_number: paymentResult.merchantInvoiceNumber,
                bkash_payment_id: paymentResult.paymentID,
                payer_reference: user.email,
                gatewayResponse: paymentResult,
                emergencyService_id: booking.emergencyService_id,
                user_id: user.userId
            }
        })

        return paymentResult.bkashURL;
    })

    return result
}

export const PaymentService = {
    createPayemntService
}   