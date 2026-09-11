import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { PaymentController } from "./payment.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { PaymentValidation } from "./payment.validation";

const paymentRouter = Router();

paymentRouter.post(
	"/:id",
	auth(Role.ADMIN, Role.SUPER_ADMIN, Role.DONOR, Role.USER, Role.HOSPITAL),
	PaymentController.createPaymentController,
);

paymentRouter.get(
	"/callback",
	validateRequest(PaymentValidation.callbackQueryValidation, "query"),
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
	"/hospital-payments",
	auth(Role.HOSPITAL),
	PaymentController.getAllPaymentsHospitalController,
);

paymentRouter.put(
	"/hospital-payments/:id",
	auth(Role.HOSPITAL),
	PaymentController.updatePaymentStatusController,
);

paymentRouter.get(
	"/:id",
	auth(Role.ADMIN, Role.SUPER_ADMIN, Role.DONOR, Role.USER, Role.HOSPITAL),
	PaymentController.getPaymentDetailsController,
);

export default paymentRouter;
