import type { UploadApiResponse } from "cloudinary";
import cloudinary from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { validateUserById } from "../../utils/isUserExist";
import type { IUser } from "../user/user.interface";
import type { IService, IUpdateService } from "./service.interface";

const createService = async (
	user: IUser,
	payload: IService,
	buffer: Buffer,
) => {
	const userData = await validateUserById(user.userId);

	const hospital = await prisma.hospital.findUnique({
		where: {
			user_id: userData.id,
		},
	});

	if (!hospital) {
		throw new AppError(404, "Hospital profile not found.");
	}

	if (hospital.hospital_status !== "VERIFIED") {
		throw new AppError(400, "Hospital profile is not verified.");
	}

	const uploadResult = await new Promise<UploadApiResponse>(
		(resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{
						resource_type: "image",
					},
					(err, result) => {
						if (err) {
							return reject(err);
						}
						if (!result) {
							return reject(new AppError(400, "Cloudinary upload failed."));
						}
						resolve(result);
					},
				)
				.end(buffer);
		},
	);

	const service = await prisma.emergencyService.create({
		data: {
			service_name: payload.service_name,
			service_category: payload.service_category,
			description: payload.description,
			price: payload.price,
			availability: payload.availability,
			hospital_id: hospital.id,
			service_image: uploadResult.secure_url,
			service_image_public_id: uploadResult.public_id,
		},
		include: {
			hospital: {
				select: {
					user: {
						select: {
							name: true,
							email: true,
							address: true,
							phone: true,
						},
					},
				},
			},
		},
	});

	return service;
};

const getAllService = async () => {
	const services = await prisma.emergencyService.findMany({
		where: { service_status: "ACTIVE" },
	});

	if (!services) {
		throw new AppError(404, "No service found.");
	}

	return services;
};

const getServiceDetails = async (id: string) => {
	const service = await prisma.emergencyService.findUnique({
		where: { id },
		include: {
			hospital: {
				select: {
					license_number: true,
					description: true,
					hospital_status: true,
					user: {
						select: {
							name: true,
							email: true,
							address: true,
							phone: true,
						},
					},
				},
			},
		},
	});

	if (!service) {
		throw new AppError(404, "No service found.");
	}

	return service;
};

const getMyServices = async (user: IUser) => {
	const services = await prisma.emergencyService.findMany({
		where: {
			hospital: {
				user_id: user.userId,
			},
		},
	});

	if (!services) {
		throw new AppError(404, "No service found.");
	}

	return services;
};

const updateMyService = async (
	user: IUser,
	id: string,
	payload: IUpdateService,
	buffer?: Buffer,
) => {
	const services = await prisma.emergencyService.findUnique({
		where: { id },
		include: { hospital: true },
	});

	if (!services) {
		throw new AppError(404, "No service found.");
	}

	if (services.hospital.user_id !== user.userId) {
		throw new AppError(403, "Unauthorized access.");
	}

	const updateData: IUpdateService = {
		service_name: payload.service_name,
		service_category: payload.service_category,
		description: payload.description,
		price: payload.price,
	};

	if (buffer) {
		const uploadResult = await new Promise<UploadApiResponse>(
			(resolve, reject) => {
				cloudinary.uploader
					.upload_stream(
						{
							resource_type: "image",
						},
						(err, result) => {
							if (err) {
								return reject(err);
							}
							if (!result) {
								return reject(new AppError(400, "Cloudinary uplaod failed."));
							}
							resolve(result);
						},
					)
					.end(buffer);
			},
		);

		updateData.service_image = uploadResult.secure_url;
		updateData.service_image_public_id = uploadResult.public_id;
	}

	const updateService = await prisma.emergencyService.update({
		where: { id },
		data: updateData,
	});

	if (buffer && services.service_image_public_id) {
		try {
			await cloudinary.uploader.destroy(services.service_image_public_id);
		} catch (error) {
			throw new AppError(
				400,
				`Failed to delete old profile image from Cloudinary: ${error}`,
			);
		}
	}

	return updateService;
};

const deleteMyService = async (user: IUser, id: string) => {
	const service = await prisma.emergencyService.findUnique({
		where: { id },
		include: { hospital: true },
	});

	if (!service) {
		throw new AppError(404, "No service found.");
	}

	if (service.hospital.user_id !== user.userId) {
		throw new AppError(403, "Unauthorized access.");
	}

	await prisma.emergencyService.delete({ where: { id } });
};

export const EmergencyService = {
	createService,
	getAllService,
	getServiceDetails,
	getMyServices,
	updateMyService,
	deleteMyService,
};
