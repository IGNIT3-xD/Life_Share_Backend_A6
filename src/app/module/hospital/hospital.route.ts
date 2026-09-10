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

hospitalRouter.get(
	"/all-hospital-profile",
	auth(Role.ADMIN, Role.SUPER_ADMIN),
	HospitalController.getAllHospitalProfileController,
);

hospitalRouter.get(
	"/hospital-profile/:id",
	auth(Role.ADMIN, Role.SUPER_ADMIN),
	HospitalController.getHospitalProfileDetailsController,
);

hospitalRouter.put(
	"/hospital-profile/:id",
	auth(Role.ADMIN, Role.SUPER_ADMIN),
	HospitalController.updateHospitalProfileStatusController,
);

hospitalRouter.delete(
	"/hospital-profile/:id",
	auth(Role.SUPER_ADMIN, Role.HOSPITAL),
	HospitalController.deleteHospitalProfileController,
);

export default hospitalRouter;
