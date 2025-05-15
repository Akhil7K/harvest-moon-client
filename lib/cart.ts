import { MergeConflictStrategy } from "@/schemas";
import { db } from "./db";
import * as z from 'zod';

export class CartService {
    // Main entry point for cart resolution among users and guests
    async getOrCreateCart(sessionId: string, userId?: string) {
        console.log('CartService - Getting cart for: ', {sessionId, userId});
        // Check if the user is logged in
        try {
            if (userId) {
                const userCart = await this.getUserCart(userId);
                console.log('CartService - Found user cart: ', userCart.id);
                return userCart;
            }

            const sessionCart = await this.getSessionCart(sessionId);
            console.log('CartService - Found session cart: ', sessionCart.id);
            return sessionCart;
        } catch (error) {
            console.error('CartService - Error: ', error);
            throw error;
        }
    }

    // User Cart Mangement
    private async getUserCart(userId: string) {
        return db.cart.upsert({
            where: {
                userId: userId,
            },
            create: {
                userId: userId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // User Cart will expire in 7 days from creation
            },
            update: {}
        });
    }

    // Session Cart Management
    private async getSessionCart(sessionId: string) {
        return db.cart.upsert({
            where: {
                sessionId: sessionId,
            },
            create: {
                sessionId: sessionId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) //Session Cart or Guest Cart will expire in 7 days from creation
            },
            update: {}
        });
    }

    // Merge User Cart with Guest Cart upon login
    async mergeCarts(userId: string, sessionId: string, strategy: z.infer<typeof MergeConflictStrategy> = 'PRIORITIZE_USER') {
        return  db.$transaction(async (tx) => {
            console.log("Starting cart merging for: ", {userId, sessionId});

            // Lock rows for update
            await tx.$executeRaw`
                SELECT * FROM "Cart"
                WHERE "userId" = ${userId} OR "sessionId" = ${sessionId}
                FOR UPDATE SKIP LOCKED
            `;

            // Getting both carts
            const [guestCart, userCart] = await Promise.all([
                tx.cart.findUnique({
                    where: {
                        sessionId,
                    },
                    include: {
                        items: {
                            include: {variant: true}
                        },
                    },
                }),
                tx.cart.findFirst({
                    where: {
                        userId,
                    },
                    include: {
                        items: {
                            include: {variant: true}
                        },
                    },
                })
            ]);

            if (!guestCart || guestCart.userId) {
                throw new Error('Invalid guest cart');
            }

            if (!guestCart?.items.length) return userCart;  //No guest cart to merge

            // Create or use existing user cart
            const finalUserCart = userCart || await tx.cart.create({
                data: {
                    userId,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                },
                include: {
                    items: {
                        include: { variant: true }
                    }
                }
            });

            const mergeOperations = guestCart.items.map(async (guestItem) => {
                const existingItem = finalUserCart.items.find(
                    item => item.variantId === guestItem.variantId
                );
                // Check stock availability
                const variant = await tx.productVariant.findUnique({
                    where: {
                        id: guestItem.variantId
                    },
                    select: {
                        stockQuantity: true,
                        reservedQuantity: true
                    }
                });

                const availableStock = (variant?.stockQuantity || 0) - (variant?.reservedQuantity || 0);

                const maxPossible = Math.min(guestItem.quantity, availableStock);

                if (maxPossible <= 0) return;

                // Conflict Resolution
                const finalQuantity = existingItem ?
                    this.resolveConflict(
                        existingItem.quantity,
                        maxPossible,
                        strategy
                    ) : maxPossible;

                await tx.cartItem.upsert({
                    where: {
                        cartId_variantId: {
                            cartId: finalUserCart.id,
                            variantId: guestItem.variantId
                        }
                    },
                    create: {
                        cartId: finalUserCart.id,
                        variantId: guestItem.variantId,
                        quantity: finalQuantity
                    },
                    update:{
                        quantity: finalQuantity
                    }
                });
                

                return tx.cart.findUnique({
                    where: {
                        id: finalUserCart.id
                    },
                    include: {
                        items: {
                            include: {
                                variant: {
                                    include: {
                                        product: {
                                            include: {
                                                imageUrls: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            });
            await Promise.all(mergeOperations);

                // Cleanup guest cart
                try {
                    await tx.cartItem.deleteMany({
                        where: {cartId: guestCart.id}
                    });
                    await tx.cart.delete({
                        where: {
                            id: guestCart.id
                        }
                    });
                    console.log("Guest Cart cleaned up");
                } catch (error) {
                    console.error('Error cleaning guest cart');
                }
        })
    }

    private resolveConflict(
        userQty: number,
        guestQty: number,
        strategy: z.infer<typeof MergeConflictStrategy>
      ) {
        switch(strategy) {
          case 'PRIORITIZE_USER':
            return userQty;
          case 'PRIORITIZE_GUEST':
            return guestQty;
          case 'SUM_QUANTITIES':
            return userQty + guestQty;
          default:
            return Math.max(userQty, guestQty);
        }
      }
}