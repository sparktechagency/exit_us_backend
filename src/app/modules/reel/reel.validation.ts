import {z} from 'zod'

const createReelZodSchema = z.object({
    body: z.object({
        title: z.string({required_error: 'Title is required'}),
        description: z.string({required_error: 'Description is required'}),
        video: z.string({required_error: 'Video is required'}).optional(),
        fileName:z.string({required_error: 'File Name is required'}).optional(),
        chunkIndex : z.string({required_error: 'Chunk Index is required'}).optional(),
        totalChunks : z.string({required_error: 'Total Chunks is required'}).optional(),
        
    }),
})

const updateReelZodSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        video: z.string().optional(),
        fileName:z.string().optional(),
        chunkIndex : z.string().optional(),
        totalChunks : z.string().optional(),
        
    }),
})

const likeReelZodSchema = z.object({
    body: z.object({
        reelId: z.string({required_error: 'Reel ID is required'}),
    }),
})

const createCommentZodSchema = z.object({
    body: z.object({
        reelId: z.string({required_error: 'Reel ID is required'}),
        comment: z.string({required_error: 'Comment is required'}),
    }),
})

export const ReelValidation = {
    createReelZodSchema,
    updateReelZodSchema,
    likeReelZodSchema,
    createCommentZodSchema,
}