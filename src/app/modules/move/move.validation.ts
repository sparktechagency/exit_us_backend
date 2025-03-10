import { z } from "zod";

const createMovingFromCountryZodSchema = z.object({
    body: z.object({
        originCountry: z.string({ required_error: "Country is required" }),
        destinationCountry : z.string({required_error:"Destination Country is Required"}),
        checkout_date : z.string({required_error:"Checkout Date is Required"}),
        visa_type : z.string({required_error:"Visa Type is Rquired"})
    }),
})

const updateMovingFromCountryZodSchema = z.object({
    body: z.object({
        originCountry: z.string().optional(),
        destinationCountry : z.string().optional(),
        checkout_date : z.string().optional(),
        visa_type : z.string().optional()
    }),
})

export const MovingValidation = {
    createMovingFromCountryZodSchema,
    updateMovingFromCountryZodSchema,
}