import { prisma } from "../lib/prisma";
import AppError from "./AppError";

export const isUserExists = async (email: string) => {
	const user = await prisma.user.findUnique({
		where: {
			email
		},
		omit: { password: true }
	});

	if (!user) {
		throw new AppError(404, "User not found");
	}

	return user
};
