import { z } from "zod";

const createTextTranlateZodSchema = z.object({
    body: z.object({
        text: z.string({ required_error: "Text is required" }),
        to: z.string({ required_error: "Target language is required" }),
    }),
})

const createImageTranslateZodSchema = z.object({
    body: z.object({
        image: z.any({ required_error: "Image URL is required" }),
        to: z.string({ required_error: "Target language is required" }),
    }),
})

const createVoiceTranslateZodSchema = z.object({
    body: z.object({
        to: z.string({ required_error: "Target language is required" }),
        media: z.any({ required_error: "Audio file URL is required" }),
    }),
})

export const TranslatorValidation = {
    createTextTranlateZodSchema,
    createImageTranslateZodSchema,
    createVoiceTranslateZodSchema,

}