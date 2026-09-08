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

bookingRouter.patch(
	"/update-booking-request/:id",
	auth(Role.SUPER_ADMIN, Role.ADMIN, Role.USER, Role.DONOR, Role.HOSPITAL),
	validateRequest(BookingValidation.updateBookingValidate),
	BookingController.updateBookingController,
);

bookingRouter.put(
	"/cancel-booking-request/:id",
	auth(Role.SUPER_ADMIN, Role.ADMIN, Role.USER, Role.DONOR, Role.HOSPITAL),
	BookingController.cancelBookingController,
);

bookingRouter.put(
	"/booking-request/:id",
	auth(Role.SUPER_ADMIN, Role.ADMIN, Role.USER, Role.DONOR, Role.HOSPITAL),
	BookingController.updateBookingStatusController,
);

bookingRouter.get(
	"/booking-request/:id",
	auth(Role.HOSPITAL),
	BookingController.getBookingRequestsDetailsController,
);

bookingRouter.delete(
	"/delete-booking-request/:id",
	auth(Role.SUPER_ADMIN, Role.ADMIN, Role.USER, Role.DONOR, Role.HOSPITAL),
	BookingController.deleteBookingController,
);

bookingRouter.get(
	"/booking-request/:id",
	auth(Role.SUPER_ADMIN, Role.ADMIN, Role.USER, Role.DONOR, Role.HOSPITAL),
	BookingController.getMyBookingDetailsController,
);

bookingRouter.get(
	"/my-booking-request",
	auth(Role.SUPER_ADMIN, Role.ADMIN, Role.USER, Role.DONOR, Role.HOSPITAL),
	BookingController.getMyBookingController,
);

bookingRouter.get(
	"/recevied-booking-request",
	auth(Role.HOSPITAL),
	BookingController.getBookingRequestsController,
);

export default bookingRouter;
