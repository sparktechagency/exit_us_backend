import {z} from 'zod';
const createMeetupZodSchema = z.object({
    body: z.object({
        title: z.string({required_error: 'Title is required'}),
        description: z.string({required_error: 'Description is required'}),
        location: z.string({required_error: 'Location is required'}),
        date: z.string({required_error: 'Date is required'}),
    }),
})
const updateMeetupZodSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        date: z.string().optional(),
    }),
})

export const MeetupValidation = {
    createMeetupZodSchema,
    updateMeetupZodSchema,
}