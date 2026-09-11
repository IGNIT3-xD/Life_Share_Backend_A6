import type z from "zod";
import { catchAsync } from "../utils/catchAsync";
import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

export const validateRequest = (
	zodSchema: z.ZodObject,
	source: "body" | "query" = "body",
) => {
	return catchAsync(
		async (req: Request, _res: Response, next: NextFunction) => {
			const payload = source === "query" ? (req.query ?? {}) : (req.body ?? {});

			const result = zodSchema.safeParse(payload);

			if (!result.success) {
				throw new AppError(400, result.error.issues[0].message);
			}

			if (source === "body") {
				req.body = result.data;
			}

			next();
		},
	);
};
