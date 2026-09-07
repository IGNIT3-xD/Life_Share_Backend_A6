import z from "zod";
import { ServiceCategory } from "../../../../prisma/generated/prisma/enums";

const createServiceValidate = z.object({
    service_name: z
        .string()
        .min(10, "Service name is required")
        .max(30, "Service name is too larg"),

    service_category: z
        .enum(ServiceCategory, "Service category is not valid"),

    description: z
        .string()
        .min(1, "Description is required")
        .max(255, "Service description is too long"),

    price: z
        .coerce
        .number()
        .nonnegative("Price cannot be negative"),

    availability: z
        .string()
        .min(3, "Availability time is required"),
});

export const ServiceValidation = {
    createServiceValidate,
};
