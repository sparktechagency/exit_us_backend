import {z} from 'zod'

const createReelZodSchema = z.object({
    body: z.object({
        caption: z.string({required_error: 'Title is required'}),
        chunk: z.string({required_error: 'Video is required'}).optional(),
        fileName:z.string({required_error: 'File Name is required'}).optional(),
        chunkIndex : z.string({required_error: 'Chunk Index is required'}).optional(),
        totalChunks : z.string({required_error: 'Total Chunks is required'}).optional(),
        
    }),
})

const updateReelZodSchema = z.object({
    body: z.object({
        caption: z.string().optional(),
        chunk: z.string().optional(),
        fileName:z.string().optional(),
        chunkIndex : z.string().optional(),
        totalChunks : z.string().optional(),
        
    }),
})

const likeReelZodSchema = z.object({
    body: z.object({
        reelId: z.string({required_error: 'Reel ID is required'}),
        status:z.boolean({required_error:"status is required"})
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