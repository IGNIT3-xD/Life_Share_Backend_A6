import type { ServiceCategory } from "../../../../prisma/generated/prisma/enums";

export interface IService {
	service_name: string;
	service_category: ServiceCategory;
	description: string;
	price: number;
	availability: string;
}

export interface IUpdateService {
	service_name?: string;
	service_category?: ServiceCategory;
	description?: string;
	price?: number;
	availability?: string;
	service_image?: string;
	service_image_public_id?: string;
}
