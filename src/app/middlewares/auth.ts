import type { Role } from "../../../prisma/generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import type { IUser } from "../module/auth/auth.interface";
import AppError from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

declare global {
	namespace Express {
		interface Request {
			user?: IUser;
		}
	}
}

export const auth = (...requiredRoles: Role[]) => {
	return catchAsync(
		async (req: Request, _res: Response, next: NextFunction) => {
			const token = req.cookies.accessToken
				? req.cookies.accessToken
				: req.headers.authorization?.startsWith("Bearer ")
					? req.headers.authorization?.split(" ")[1]
					: req.headers.authorization;

			if (!token) {
				throw new AppError(403, "Please, Login to access.");
			}

			const verifiedToken = jwt.verify(token, config.JWT_ACCESS) as JwtPayload;

			const { userId, name, email, role } = verifiedToken;

			if (requiredRoles.length && !requiredRoles.includes(role)) {
				throw new AppError(
					403,
					"Forbidden. You don't have permission to access this resource.",
				);
			}

			const user = await prisma.user.findUnique({
				where: {
					id: userId,
					email,
					name,
					role,
				},
			});

			if (!user) {
				throw new AppError(404, "User not found. Please log in again.");
			}

			if (!user.is_active || user.is_blocked) {
				throw new AppError(
					403,
					"Your account has been blocked or not active. Please contact support.",
				);
			}

			req.user = {
				userId,
				email,
				name,
				role,
			};

			next();
		},
	);
};
