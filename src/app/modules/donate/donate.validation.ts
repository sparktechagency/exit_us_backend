import { z } from "zod"
const createDonationZodSchema = z.object({
    body: z.object({
        amount: z.number({ required_error: 'Amount is required' }),
    }),
})

export const DonationValidation = {
    createDonationZodSchema,
 
}