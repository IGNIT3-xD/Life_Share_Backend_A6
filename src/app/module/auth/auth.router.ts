import { Router } from "express";
import { AuthController } from "./auth.controller";

const authRouter = Router()

authRouter.post(
    '/register',
    AuthController.registerUserController
)

export default authRouter