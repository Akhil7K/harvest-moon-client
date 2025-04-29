import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    props: {params: {id: string}}
) {
    try {
        const headerList = headers();
        const sessionId = headerList.get("x-cart-session");

        if (!sessionId) {
            throw new Error("No valid session found");
        }
        const user = await currentUser();
        const userId = user?.id;

        const body = await req.json();
        const {quantity} = body
        const id = props.params.id;

        if (!id || typeof quantity !== 'number' || quantity < 1) {
            return new NextResponse("invalid request", {status: 400})
;        }

        const result = await db.$transaction(async(tx) => {
            // Get cart item with variant details
            const item = await tx.cartItem.findUnique({
                where: {id: id},
                include: {
                    cart: true,
                    variant: true
                }
            });

            if (!item) {
                return new NextResponse("Item not found", {status: 404});
            }

            if (userId) {
                if (item.cart.userId !== userId) {
                    return new NextResponse("Unauthorized access", {status: 403});
                }
            } else {
                // For guest users
                if (item.cart.sessionId !== sessionId) {
                    return new NextResponse("Unauthorized access", {status: 403});
                }
            } 

            const quantityDiff = quantity - item.quantity;

            // Stock validation
            const variant = await tx.productVariant.findUnique({
                where: {
                    id: item.variantId,
                },
                select: {
                    stockQuantity: true,
                    reservedQuantity: true,
                }
            });

            const availableStock = (variant?.stockQuantity || 0) - (variant?.reservedQuantity || 0);
            if (availableStock < quantityDiff) {
                return new NextResponse(
                    "Insufficient stoack available",
                    {status: 409}
                );
            }

            const updatedItem = await tx.cartItem.update({
                where: {
                    id: item.id
                },
                data: {
                    quantity
                }
            });

            await tx.productVariant.update({
                where: {
                    id: item.variantId
                },
                data: {
                    reservedQuantity: {
                        increment: quantityDiff
                    }
                }
            });

            return updatedItem
        });

        if (result instanceof NextResponse) {
            return result;
        }

        return NextResponse.json(result, {status: 200});
    } catch (error) {
        console.error('[CART_UPDATE]', error);
        return new NextResponse('Internal Error', {status: 500});
    }
}

export async function DELETE(
    req: Request,
    props: {params: {id: string}}
) {
    try {
        const headerList = headers();
        const sessionId = headerList.get('x-cart-session');
        if(!sessionId) {
            console.error('No valid session found');
            throw new Error('No valid session found');
        }
        const user = await currentUser();
        const userId = user?.id;

        const id = props.params.id;

        const result = await db.$transaction(async(tx) => {
            const item = await tx.cartItem.findUnique({
                where: {
                    id: id
                },
                include: {
                    cart: true,
                    variant: true
                }
            });

            if (!item) {
                return null
            }

            // Release reservedQuantity
            await tx.productVariant.update({
                where: {
                    id: item.variantId
                },
                data: {
                    reservedQuantity: {
                        decrement: item.quantity
                    }
                }
            });

            // Delete cart item
            await tx.cartItem.delete({
                where: {
                    id: item.id
                }
            });

            return {success: true}
        });

        return NextResponse.json(result, {status: 200});
    } catch (error) {
        console.error("[CART_DELETE]", error);
        return new NextResponse("INTERNAL ERROR", {status: 500});
    }
}