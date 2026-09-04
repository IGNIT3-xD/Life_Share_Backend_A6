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

export default donorRouter;
