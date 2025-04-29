import { db } from "./db";

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
    async mergeCarts(userId: string, sessionId: string) {
        return  db.$transaction(async (tx) => {

            // Getting both carts
            const [guestCart, userCart] = await Promise.all([
                tx.cart.findUnique({
                    where: {
                        sessionId,
                    },
                    include: {
                        items: true,
                    }
                }),
                tx.cart.findUnique({
                    where: {
                        userId,
                    },
                    include: {
                        items: true,
                    },
                })
            ]);

            if (!guestCart) return userCart;  //No guest cart to merge

            const mergedItems = [...(userCart?.items || [])];

            for (const guestItem of guestCart.items) {
                const existingItem = mergedItems.find(
                    item => item.variantId === guestItem.variantId
                );

                if (existingItem) {
                    await tx.cartItem.update({
                        where: {
                            id: existingItem.id
                        },
                        data: {
                            quantity: {
                                increment: guestItem.quantity
                            }
                        }
                    });
                } else {
                    if (userCart?.id) {
                        mergedItems.push(
                            await tx.cartItem.create({
                                data: {
                                    cartId: userCart.id,
                                    variantId: guestItem.variantId,
                                    quantity: guestItem.quantity,
                                }
                            })
                        )
                    }
                }
            }
        })
    }
}