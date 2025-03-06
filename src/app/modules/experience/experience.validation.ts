import {string, z} from 'zod'

const createExperienceZodSchema = z.object({
    body: z.object({
        date: z.string({required_error: 'Date is required'}),
        description: z.string({required_error: 'Description is required'}),
        image:string().optional()
    }),
})

const updateExperienceZodSchema = z.object({
    body: z.object({
        date: z.string().optional(),
        description: z.string().optional(),
        image: string().optional()
    }),
})

export const ExperienceValidation = {
    createExperienceZodSchema,
    updateExperienceZodSchema,
}