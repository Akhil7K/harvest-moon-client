import { z } from "zod";

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => 
    z.object({
        success: z.boolean(),
        data: z.optional(dataSchema),
        error: z.optional(z.object({
            code: z.string(),
            message: z.string(),
            details: z.unknown().optional()
        }))
    });

