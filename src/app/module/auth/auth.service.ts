import { prisma } from "../../lib/prisma"
import { IRegisterUser } from "./auth.interface"

const registerUserService = async (payload: IRegisterUser) => {
    const { email } = payload

    const isExist = await prisma.user.findUnique({ where: { email } })

    if (isExist) {
        throw new Error("User is already exist. Please, login")
    }

    const user = await prisma.user.create({
        data: payload
    })

    return user
}

export const AuthServices = {
    registerUserService
}