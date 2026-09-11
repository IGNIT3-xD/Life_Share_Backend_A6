import type { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";

export const requestId = (req: Request, res: Response, next: NextFunction) => {
	const id = (req.headers["x-request-id"] as string) || crypto.randomUUID();
	req.headers["x-request-id"] = id;
	res.setHeader("X-Request-Id", id);
	next();
};
