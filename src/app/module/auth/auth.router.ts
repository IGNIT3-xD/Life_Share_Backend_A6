import { Router } from "express";
import { AuthController } from "./auth.controller";

const authRouter = Router();

authRouter.post("/register", AuthController.registerUserController);

authRouter.post("/login", AuthController.loginUser);

export default authRouter;
