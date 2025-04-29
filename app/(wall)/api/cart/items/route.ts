// app/api/cart/items/route.ts
import { CartService } from '@/lib/cart';
import { currentUser } from '@/lib/current-user';
import { db } from '@/lib/db';
import { getCartSession } from '@/lib/session';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {

    const headerList = headers();
    const clientSessionId = headerList.get("x-cart-session");

    // Get cart session first
    const serverSessionId = await getCartSession();
3
    // Get user if logged in
    const user = await currentUser();
    const userId = user?.id;
    console.log("API received user: ", userId);

    const sessionId = clientSessionId || serverSessionId
    
    console.log("API received Cart Session: ", sessionId);

    if (!sessionId) {
      console.error("No valid session found");
      return new NextResponse("Session required", {status: 500});
    }

    const cartService = new CartService();

    // Parsing request body
    const values = await req.json();
    const {variantId, quantity} = values;

    // Validating inputs
    if (!variantId || !quantity) {
      return new NextResponse("Missing required fields", {status: 400});
    }

    // Get or create cart
    const cart = await cartService.getOrCreateCart(sessionId, userId);
    console.log("API received cart: ", cart);

    const result = await db.$transaction(async (tx) => {
      const variant = await tx.productVariant.findUnique({
        where: {
          id: variantId,
          isPublished: true,
        },
        select: {
          stockQuantity: true,
          reservedQuantity: true,
          minStockQuantity: true,
        }
      });
      // Check if variant is valid
      console.log(variant);

      if (!variant) {
        return new NextResponse("Variant not found", {status: 404});
      }
      const quantityIncrease = Number(quantity);

      console.log(quantityIncrease);

      if (isNaN(quantityIncrease)) {
        return new NextResponse("Invalid quantity", {status: 400})
      }

      const availableStock = (variant.stockQuantity || 0) - (variant.reservedQuantity || 0);

      console.log(availableStock);

      if (availableStock < quantityIncrease) {
        return new NextResponse("Insuffiecient stock", {status: 400});
      }

      // Create or update cart Item
      const cartItem = await tx.cartItem.upsert({
        where: {
          cartId_variantId: {
            variantId: variantId,
            cartId: cart.id
          }
        },
        create: {
          cartId: cart.id,
          variantId: variantId,
          quantity: quantityIncrease,
        },
        update: {
          quantity: {
            increment: quantityIncrease
          }
        }
      });

      await tx.productVariant.update({
        where: {
          id: variantId,
        },
        data: {
          reservedQuantity: { increment: quantityIncrease }
        }
      });
      console.log(cartItem);
      return cartItem;
    });
    console.log(result);
    return NextResponse.json(result, {status: 200});

    
  } catch (error) {
    return handleCartError(error);
  }
}

const handleCartError = (error: unknown) => {
  if (error instanceof Error) {
    switch (error.message) {
      case 'INSUFFICIENT_STOCK':
        return NextResponse.json(
          { error: "Item exceeds available stock" },
          { status: 409 }
        );
      default:
        return NextResponse.json(
          { error: "Failed to update cart" },
          { status: 500 }
        );
    }
  }
  return NextResponse.json(
    { error: "Unknown error occurred" },
    { status: 500 }
  );
};

export async function GET() {
  try {
    const headerList = headers();

    const clientSessionId = headerList.get("x-cart-session");
    console.log("API received client session: ", clientSessionId);

    const serverSessionId = await getCartSession();
    console.log("API received cart session: ", serverSessionId);

    const sessionId = clientSessionId || serverSessionId;

    const user = await currentUser();
    const userId = user?.id;

    if (!sessionId) {
      console.error("No valid session found");
      return new NextResponse("Valid Session Required", {status: 401});
    }

    const cart = await db.cart.findFirst({
      where: userId ? {userId} : {sessionId},
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include:{
                    imageUrls: true,
                  }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json(cart ? [cart] : [], {
      headers: {
        'cache-control': 'no-store',
      }
    })
  } catch (error) {
    console.error("Erro fetching cart: ", error);
    return new NextResponse("Failed to fetch cart", {status: 500})
  }
}


// Clear Cart API (DELETE)
export async function DELETE() {
  try {
    const headerList = headers();
    const sessionId = headerList.get('x-cart-session');
    if (!sessionId) {
      console.error("No valid session found");
      throw new Error("No valid session found");
    }

    const user = await currentUser();
    const userId = user?.id;

    const cart = await db.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: {
        items: true
      }
    });

    if (!cart) {
      return new NextResponse('No cart found', {status: 401});
    }

    await db.$transaction(async (tx) => {
      // Release all reserved quantitites
      await Promise.all(cart.items.map(async (item) => {
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
      }));

      // Delete all cartitems
      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id
        }
      });
    });

    return NextResponse.json({success: true}, {status: 200});
  } catch (error) {
    console.error("[CART_DELETE]", error);
    return new NextResponse("INTERNAL ERROR", {status: 500});
  }
}