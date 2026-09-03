import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "../../../prisma/generated/prisma/client";
import AppError from "../utils/AppError";
import sendResponse from "../utils/sendResponse";

const globalErrorHandler = (
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	let statusCode = 500;
	let message = "Internal server error";
	let error: string | null = null;

	if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;
		error = err.message;
	} else if (err instanceof ZodError) {
		statusCode = 400;
		message = "Validation failed";
		error = err.issues
			.map((i) => `${i.path.join(".")}: ${i.message}`)
			.join("; ");
	} else if (err instanceof Prisma.PrismaClientKnownRequestError) {
		if (err.code === "P2002") {
			statusCode = 409;
			const target = (err.meta?.target as string[])?.join(", ") ?? "field";
			message = `Unique constraint violation on ${target}`;
			error = message;
		} else if (err.code === "P2025") {
			statusCode = 404;
			message = "Record not found";
			error = message;
		} else {
			message = `Database error: ${err.code}`;
			error = message;
		}
	} else if (err.name === "JsonWebTokenError") {
		statusCode = 401;
		message = "Invalid token";
		error = message;
	} else if (err.name === "TokenExpiredError") {
		statusCode = 401;
		message = "Token has expired";
		error = message;
	}

	sendResponse(res, {
		statusCode,
		success: false,
		message,
		error,
	});
};

export default globalErrorHandler;
