import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const cleanupInterval = setInterval(() => {
	const now = Date.now();
	for (const [key, entry] of rateLimitStore) {
		if (now > entry.resetAt) {
			rateLimitStore.delete(key);
		}
	}
}, 60_000);

if (cleanupInterval.unref) {
	cleanupInterval.unref();
}

export const rateLimit = (maxRequests: number, windowMs: number) => {
	return (req: Request, _res: Response, next: NextFunction) => {
		const key = `${req.ip}:${req.route?.path || req.path}`;
		const now = Date.now();

		const entry = rateLimitStore.get(key);

		if (!entry || now > entry.resetAt) {
			rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
			return next();
		}

		entry.count++;

		if (entry.count > maxRequests) {
			const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
			throw new AppError(
				429,
				`Too many requests. Please try again in ${retryAfter} seconds.`,
			);
		}

		next();
	};
};
