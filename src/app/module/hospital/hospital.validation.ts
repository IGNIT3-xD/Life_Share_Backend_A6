import z from "zod"

const createHospitalProfileValidate = z.object({
    license_number: z
        .string()
        .min(8, "License number must be at least 8 characters length")
        .max(12, "License number is too big."),
    description: z.string().min(10).max(255)
})

export const HospitalValidation = {
    createHospitalProfileValidate
}