import type { Request, Response } from 'express'
import { AuthServices } from './auth.service'

const registerUserController = async (req: Request, res: Response) => {
    try {
        const result = await AuthServices.registerUserService(req.body)

        res.status(200).json({
            success: true,
            message: 'User registered successfully.',
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const AuthController = {
    registerUserController
}