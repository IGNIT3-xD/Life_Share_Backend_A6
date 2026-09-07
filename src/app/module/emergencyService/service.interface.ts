import type { ServiceCategory } from "../../../../prisma/generated/prisma/enums";

export interface IService {
    service_name: string;
    service_category: ServiceCategory;
    description: string;
    price: number;
    availability: string;
}