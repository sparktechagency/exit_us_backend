import { date, z } from "zod";

const createAdviceValidationZodSchema = z.object({
    body: z.object({
        description: z.string({required_error: 'Description is required'}),
        date: z.string().optional(),
    }),
})

const updateAdviceValidationZodSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
    }),
})

export const AdviceValidation = {
    createAdviceValidationZodSchema,
    updateAdviceValidationZodSchema
}