import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidation } from "./auth.validation";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const authRouter = Router();

authRouter.post(
    "/register",
    validateRequest(UserValidation.registerUserValidation),
    AuthController.registerUserController
);

authRouter.post(
    "/login",
    validateRequest(UserValidation.loginUserValidation),
    AuthController.loginUser
);

authRouter.get(
    "/me",
    auth(Role.SUPER_ADMIN, Role.ADMIN, Role.DONOR, Role.HOSPITAL, Role.USER),
    AuthController.getMeController
);

authRouter.post(
    "/refresh-token",
    AuthController.refreshTokenController
);

export default authRouter;
