import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { DonorController } from "./donor.controller";
import { DonorValidtaion } from "./donor.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const donorRouter = Router();

donorRouter.post(
	"/create-donor-profile",
	auth(Role.USER, Role.DONOR),
	validateRequest(DonorValidtaion.createDonorProfileValidate),
	DonorController.createDonorProfileController,
);

donorRouter.get("/", DonorController.getAllDonorsController);

donorRouter.get(
	"/donation-request",
	auth(Role.SUPER_ADMIN, Role.ADMIN, Role.DONOR, Role.HOSPITAL),
	DonorController.getDonationRequestController,
);

donorRouter.get(
	"/donation-request/:id",
	auth(Role.SUPER_ADMIN, Role.ADMIN, Role.DONOR, Role.HOSPITAL),
	DonorController.getDetailsDonationRequestController,
);

donorRouter.patch(
	"/donation-request/:id",
	auth(Role.SUPER_ADMIN, Role.ADMIN, Role.DONOR, Role.HOSPITAL),
	validateRequest(DonorValidtaion.updateDonationRequestValidate),
	DonorController.updateDonationRequestController,
);

export default donorRouter;
