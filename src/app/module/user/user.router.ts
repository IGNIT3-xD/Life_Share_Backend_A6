import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";

const userRouter = Router();

userRouter.get(
	"/me",
	auth(Role.SUPER_ADMIN, Role.ADMIN, Role.DONOR, Role.HOSPITAL, Role.USER),
	UserController.getMeController,
);

userRouter.post(
	"/blood-request",
	auth(Role.SUPER_ADMIN, Role.ADMIN, Role.DONOR, Role.HOSPITAL, Role.USER),
	validateRequest(UserValidation.makeBloodRequestValidate),
	UserController.makeBloodRequestController,
);

export default userRouter;
