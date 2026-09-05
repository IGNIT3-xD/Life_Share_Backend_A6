import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { DonationController } from "./donation.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { DonationValidation } from "./donation.validation";

const donationRouter = Router();

donationRouter.post(
	"/request",
	auth(Role.SUPER_ADMIN, Role.ADMIN, Role.USER, Role.DONOR, Role.HOSPITAL),
	validateRequest(DonationValidation.donationRequestValidate),
	DonationController.createDonationController,
);

export default donationRouter;
