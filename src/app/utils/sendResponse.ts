import type { Response } from "express";
import config from "../config";

interface IApiResponse<T> {
	statusCode: number;
	success: boolean;
	message: string;
	error?: string | null;
	data?: T | null;
}

const sendResponse = <T>(res: Response, payload: IApiResponse<T>) => {
	const response: Record<string, unknown> = {
		success: payload.success,
		message: payload.message,
		data: payload.data ?? null,
	};

	if (!payload.success) {
		response.error = payload.error ?? null;
	}

	if (!payload.success && config.NODE_ENV === "development") {
		response.stack = new Error().stack;
	}

	return res.status(payload.statusCode).json(response);
};

export default sendResponse;
