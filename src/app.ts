import cookieParser from "cookie-parser";
import type { Application, Request, Response } from "express";
import express from "express";
import authRouter from "./app/module/auth/auth.router";

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
	res.send("Hello World!");
});

app.use('/api/v1/auth', authRouter);

export default app;