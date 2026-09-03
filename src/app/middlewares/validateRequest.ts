import type z from 'zod'
import { catchAsync } from '../utils/catchAsync'
import type { Request, Response, NextFunction } from "express";
import AppError from '../utils/AppError';

export const validateRequest = (zodSchema: z.ZodObject) => {
    return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
        const payload = req.body ?? {}

        const result = zodSchema.safeParse(payload)

        if (!result.success) {
            // console.log(result.error);
            throw new AppError(400, result.error.issues[0].message);
        }

        req.body = result.data

        next()
    })
}