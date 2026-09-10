import type { ServiceCategory } from "../../../../prisma/generated/prisma/enums";
import { SortOrder } from "../donor/donor.interface";

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

export interface IServiceQuery {
	search?: string;
	service_category?: ServiceCategory;
	sortBy?: SortOrder;
	sortByPrice?: SortOrder;
	page?: number;
	limit?: number;
}