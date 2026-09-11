import type { ServiceCategory, ServiceStatus } from "../../../../prisma/generated/prisma/enums";
import type { SortOrder } from "../donor/donor.interface";

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
	service_status?: ServiceStatus;
	service_category?: ServiceCategory;
	sortBy?: SortOrder;
	sortByPrice?: SortOrder;
	rawPage?: number;
	rawLimit?: number;
}

export interface IUpdateServiceStatus {
	service_status: ServiceStatus
}