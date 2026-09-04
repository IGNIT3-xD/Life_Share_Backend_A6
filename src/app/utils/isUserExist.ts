import { AuthProvider } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../lib/prisma";
import AppError from "./AppError";

export const isUserExist = async (email: string) => {
	const user = await prisma.user.findUnique({
		where: {
			email,
		}
	});

	if (!user) {
		throw new AppError(404, "User not found");
	}

	if (!user.email_verified) {
		throw new AppError(400, "User email is not verified.");
	}

	if (user.is_blocked) {
		throw new AppError(400, "User is blocked.");
	}

	if (user.auth_provider === AuthProvider.GOOGLE) {
		throw new AppError(400, "User is already registered with Google.");
	}

	return user;
};
