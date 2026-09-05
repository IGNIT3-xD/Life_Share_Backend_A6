import cookieParser from "cookie-parser";
import type { Application, Request, Response } from "express";
import express from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import authRouter from "./app/module/auth/auth.router";
import donorRouter from "./app/module/donor/donor.route";
import userRouter from "./app/module/user/user.router";
import donationRouter from "./app/module/donation/donation.router";

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
	res.send("Hello World!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/donor", donorRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/donation", donationRouter);

app.use(globalErrorHandler);

export default app;
