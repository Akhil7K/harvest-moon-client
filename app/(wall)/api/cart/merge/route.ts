import { CartService } from "@/lib/cart";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { MergeRequestSchema } from "@/schemas";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
) {
    try {
        const user = await currentUser();
        const userId = user?.id;

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const body = req.json();
        const validation = MergeRequestSchema.safeParse(body);

        if (!validation.success) {
            return new NextResponse("Invalid reuqest data", {status: 400});
        }

        const {guestSessionId, strategy} = validation.data;
        const cartService = new CartService();

        // Validating guest cart ownership
        const guestCart = await db.cart.findUnique({
            where: {
                sessionId: guestSessionId
            },
            select: {
                userId: true
            }
        });

        if (guestCart?.userId) {
            return new NextResponse("Invalid guest cart", {status: 403});
        }

        // Perform merge with conflict resolution
        const mergedCart = await cartService.mergeCarts(
            userId,
            guestSessionId,
            strategy
        )
            .catch(error => {
                console.error('[Merge Error', error);
                throw new Error('Merge ytransaction failed');
            });
        
        if (!mergedCart?.items?.length) {
            console.error('[MERGE] Empty result');
            return new NextResponse("Merge failed", { status: 500 });
        }
        // update session
        await db.cart.update({
            where: {
                id: mergedCart?.id
            },
            data:{
                sessionId: null
            }
        });

        // Clearing client side session storage
        cookies().delete("guest_cart_session");

        return NextResponse.json({ 
          success: true,
          message: "Cart merged successfully",
          cart: mergedCart
        });
    } catch (error) {
        console.error("[CART_MERGE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}