import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { upload } from "../../lib/multer";

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

userRouter.get("/requester", UserController.getAllRequesterController);

userRouter.get("/my-request", auth(Role.USER), UserController.getMyRequestController);

userRouter.get("/my-request/:id", auth(Role.USER), UserController.getMyRequestDetailsController);

userRouter.patch(
	"/update-my-request/:id",
	auth(Role.USER),
	validateRequest(UserValidation.updateMyRequestValidationSchema),
	UserController.updateMyRequestController
);

userRouter.delete(
	"/delete-my-request/:id",
	auth(Role.USER),
	UserController.deleteMyRequestController
);

userRouter.patch(
	"/update-profile",
	auth(Role.SUPER_ADMIN, Role.ADMIN, Role.DONOR, Role.HOSPITAL, Role.USER),
	upload.single("profile_pic"),
	validateRequest(UserValidation.updateUserValidation),
	UserController.updateProfileController
);

export default userRouter;
