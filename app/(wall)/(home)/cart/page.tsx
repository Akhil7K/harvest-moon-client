import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-user";
import { CartClient } from "./_components/cart-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getCartSession } from "@/lib/session";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

async function getCart(userId?: string | null, sessionId?: string | null) {
    if (!userId && !sessionId) return null;

    try {
        return await db.cart.findFirst({
            where: userId ? { userId } : { sessionId },
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
    } catch (error) {
        console.error("[CART_GET]", error);
        throw new Error("Failed to fetch cart");
    }
}

export default async function CartPage() {
    const user = await currentUser();
    const sessionId = await getCartSession();
    const initialCart = await getCart(user?.id, sessionId);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-harvest-primary mb-6">
                Your Cart
            </h1>
            <Suspense fallback={<Skeleton />}>
                <CartClient initialCart={initialCart} />
            </Suspense>
        </div>
    );
}