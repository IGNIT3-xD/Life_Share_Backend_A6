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

export default paymentRouter;
