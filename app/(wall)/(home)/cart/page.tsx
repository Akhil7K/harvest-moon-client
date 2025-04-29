import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-user";
import { CartClient } from "./_components/cart-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { headers } from "next/headers";
import { CartProps } from "@/types";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

async function getCart(userId?: string | null) {
    const headerList = headers();
    const clientSessionId = headerList.get('x-cart-session');
    if (!userId && !clientSessionId) return null;

    try {
        const cart = await db.cart.findFirst({
            where: userId ? { userId } : { sessionId: clientSessionId },
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

        return cart as CartProps | null;
    } catch (error) {
        console.error("[CART_GET]", error);
        throw new Error("Failed to fetch cart");
    }
}

export default async function CartPage() {
    const user = await currentUser();
    const initialCart = await getCart(user?.id);

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