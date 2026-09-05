import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidation } from "./auth.validation";
import { upload } from "../../lib/multer";

const authRouter = Router();

authRouter.post(
	"/register",
	upload.single("profile_pic"),
	validateRequest(UserValidation.registerUserValidation),
	AuthController.registerUserController,
);

authRouter.post(
	"/verify-email",
	validateRequest(UserValidation.verifyEmail),
	AuthController.verifyEmailController,
);

authRouter.post(
	"/login",
	validateRequest(UserValidation.loginUserValidation),
	AuthController.loginUser,
);

authRouter.post("/refresh-token", AuthController.refreshTokenController);

authRouter.post(
	"/forget-password",
	validateRequest(UserValidation.forgetPassEmail),
	AuthController.forgetPasswordController,
);

authRouter.post(
	"/reset-password",
	validateRequest(UserValidation.resetPassword),
	AuthController.resetPasswordController,
);

export default authRouter;
