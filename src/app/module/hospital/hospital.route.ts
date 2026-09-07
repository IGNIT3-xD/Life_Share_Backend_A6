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

export default hospitalRouter