import { PrismaClient } from "@prisma/client";
import { db } from "./db";

const database = new PrismaClient();

export const extendedDatabase = database.$extends({
    model: {
        productVariant: {
            async availableQuantity(variantId: string) {
                const variant = await db.productVariant.findUnique({
                    where: {id: variantId},
                    select: {stockQuantity: true, reservedQuantity: true}
                });
                return (variant?.stockQuantity || 0) - (variant?.reservedQuantity || 0);
            }
        }
    }
});