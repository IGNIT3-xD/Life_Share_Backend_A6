import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { PaymentController } from "./payment.controller";

const paymentRouter = Router();

paymentRouter.post(
	"/:id",
	auth(Role.ADMIN, Role.SUPER_ADMIN, Role.DONOR, Role.USER, Role.HOSPITAL),
	PaymentController.createPaymentController,
);

paymentRouter.get(
	"/callback",
	PaymentController.createPaymentCallbackController,
);

paymentRouter.get(
	"/my-payments",
	auth(Role.ADMIN, Role.SUPER_ADMIN, Role.DONOR, Role.USER, Role.HOSPITAL),
	PaymentController.getMyPaymentsController,
);

paymentRouter.get(
	"/",
	auth(Role.SUPER_ADMIN, Role.ADMIN),
	PaymentController.getAllPaymentsController,
);

paymentRouter.get(
	"/:id",
	auth(Role.ADMIN, Role.SUPER_ADMIN, Role.DONOR, Role.USER, Role.HOSPITAL),
	PaymentController.getPaymentDetailsController,
);

export default paymentRouter;
