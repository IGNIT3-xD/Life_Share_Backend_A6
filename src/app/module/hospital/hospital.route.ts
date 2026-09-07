import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { HospitalController } from "./hospital.controller";
import { HospitalValidation } from "./hospital.validation";

const hospitalRouter = Router();

hospitalRouter.post(
	"/create-hospital-profile",
	auth(Role.HOSPITAL),
	validateRequest(HospitalValidation.createHospitalProfileValidate),
	HospitalController.createHospitalProfileController,
);

hospitalRouter.get(
	"/my-hospital-profile",
	auth(Role.HOSPITAL),
	HospitalController.getMyHospitalProfileController,
);

hospitalRouter.patch(
	"/update-hospital-profile",
	auth(Role.HOSPITAL),
	validateRequest(HospitalValidation.updateHospitalProfileValidate),
	HospitalController.updateHospitalProfileController,
);

export default hospitalRouter;
