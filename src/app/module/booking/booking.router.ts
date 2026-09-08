import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { BookingController } from "./booking.controller";
import { BookingValidation } from "./booking.validation";

const bookingRouter = Router();

bookingRouter.post(
    "/booking-request/:id",
    auth(Role.SUPER_ADMIN, Role.ADMIN, Role.USER, Role.DONOR, Role.HOSPITAL),
    validateRequest(BookingValidation.createBookingValidate),
    BookingController.createBookingController,
);

export default bookingRouter;
