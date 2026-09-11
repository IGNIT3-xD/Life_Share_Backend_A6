import cookieParser from "cookie-parser";
import type { Application, Request, Response } from "express";
import express from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import authRouter from "./app/module/auth/auth.router";
import donorRouter from "./app/module/donor/donor.route";
import userRouter from "./app/module/user/user.router";
import donationRouter from "./app/module/donation/donation.router";
import hospitalRouter from "./app/module/hospital/hospital.route";
import serviceRouter from "./app/module/emergencyService/service.router";
import bookingRouter from "./app/module/booking/booking.router";
import paymentRouter from "./app/module/payment/payment.router";
import config from "./app/config";
import cors from "cors";
import AppError from "./app/utils/AppError";

const app: Application = express();

const allowedOrigins = config.FRONTEND_URL
	? config.FRONTEND_URL.split(",").map((o) => o.trim())
	: ["http://localhost:3000"];

// app.use(requestId);

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new AppError(403, "Not allowed by CORS"));
			}
		},
		credentials: true,
	}),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req: Request, res: Response) => {
	res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (_req: Request, res: Response) => {
	res.send("Hello World!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/donor", donorRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/donation", donationRouter);
app.use("/api/v1/hospital", hospitalRouter);
app.use("/api/v1/emergency-service", serviceRouter);
app.use("/api/v1/emergency-service-booking", bookingRouter);
app.use("/api/v1/payment", paymentRouter);

app.use(globalErrorHandler);

export default app;
