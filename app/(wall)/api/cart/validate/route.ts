import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const user = await currentUser();
        
        if (!user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const cart = await db.cart.findFirst({
            where: { userId: user.id },
            include: {
                items: {
                    include: {
                        variant: true
                    }
                }
            }
        });

        if (!cart?.items.length) {
            return new NextResponse("Cart is empty", { status: 400 });
        }

        // Validate all items in parallel for better performance
        const validationResults = await Promise.all(
            cart.items.map(async (item) => {
                const variant = await db.productVariant.findUnique({
                    where: { 
                        id: item.variantId,
                        isPublished: true 
                    },
                    select: {
                        stockQuantity: true,
                        reservedQuantity: true,
                        price: true
                    }
                });

                if (!variant) return { isValid: false, error: "Product unavailable" };

                const availableStock = (variant.stockQuantity || 0) - (variant.reservedQuantity || 0);
                if (availableStock < item.quantity) {
                    return { 
                        isValid: false, 
                        error: "Insufficient stock",
                        itemId: item.id 
                    };
                }

                return { isValid: true };
            })
        );

        const invalidItems = validationResults.filter(result => !result.isValid);
        if (invalidItems.length > 0) {
            return new NextResponse(
                JSON.stringify({
                    error: "Some items are unavailable",
                    items: invalidItems
                }), 
                { status: 409 }
            );
        }

        return NextResponse.json({ valid: true });
    } catch (error) {
        console.error("[CART_VALIDATION_ERROR]", error);
        return new NextResponse(
            "Internal Error", 
            { status: 500 }
        );
    }
}