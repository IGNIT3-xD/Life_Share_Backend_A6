import z from "zod";

const callbackQueryValidation = z.object({
	paymentID: z.string().min(1, "Payment ID is required."),
	status: z.enum(["success", "failure", "cancel"], "Invalid payment status."),
});

export const PaymentValidation = {
	callbackQueryValidation,
};
