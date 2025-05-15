import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required!"
    }),
    password: z.string().min(8,{
        message: "Password is required!"
    }),
    code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required"
    }),
    email: z.string().email({
        message: "Email is required!"
    }),
    password: z.string().min(8,{
        message: "Password is required!"
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(8, {
        message: "Minimum 8 characters required",
    })
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
});

export const AddtoCartSchema = z.object({
    quantity: z.number().int().positive().max(5),
    variantId: z.string().uuid()
});

export const SessionSchema = z.object({
    id: z.string().uuid(),
    expiresAt: z.date(),
    userId: z.string().nullable()
});

export const ClientSessionSchema = z.object({
    id: z.string().uuid(),
    expiresAt: z.date()
});

export const MergeConflictStrategy = z.enum([
    'PRIORITIZE_USER', 
    'SUM_QUANTITIES',
    'PRIORITIZE_GUEST'
]);

export const MergeRequestSchema = z.object({
    guestSessionId: z.string().uuid(),
    strategy: z.enum([
        'PRIORITIZE_USER', 'SUM_QUANTITIES', 'PRIORITIZE_GUEST'
    ])
})