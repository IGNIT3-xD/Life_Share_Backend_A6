import z from "zod";

const donationRequestValidate = z.object({
	requester_id: z.string(),
	donor_id: z.string(),
	scheduled_at: z.coerce.date("Invalid schedule date"),
});

export const DonationValidation = {
	donationRequestValidate,
};
