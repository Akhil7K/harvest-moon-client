"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema } from "@/schemas";

export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token?: string | null,
) => {
    if (!token) {
        return { error: "Missing token!" };
    }

    const validatedFields = NewPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return {error: "Invalid fields!"}
    };

    const { password } = validatedFields.data;

    const exisitingToken = await getPasswordResetTokenByToken(token);

    if (!exisitingToken) {
        return { error: "Invalid token!" };
    }

    const hasExpired = new Date(exisitingToken.expiresAt) < new Date();

    if (hasExpired) {
        return { error: "Token has expired!" };
    }

    const existingUser = await getUserByEmail(exisitingToken.email);

    if (!existingUser) {
        return { error: "Email not found!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            password: hashedPassword
        }
    });

    await db.passwordResetToken.delete({
        where: {
            id: exisitingToken.id
        }
    });

    return {success: "Password successfully changed!"};
}