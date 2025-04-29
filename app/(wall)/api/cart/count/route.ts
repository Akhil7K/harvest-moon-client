import { db } from '@/lib/db';
import { currentUser } from '@/lib/current-user';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
    try {
        const user = await currentUser();
        const headersList = headers();
        const sessionId = headersList.get('x-cart-session');

        // Log the session info for debugging
        console.log('User:', user?.id);
        console.log('Guest Session:', sessionId);

        // If neither user nor guest session, return 0
        if (!user?.id && !sessionId) {
            throw Error("No user or session ID found.");
        }

        // Query based on either user ID or session ID
        const cart = await db.cart.findFirst({
            where: user?.id ? {
                userId: user.id
            } : sessionId ? {
                sessionId: sessionId
            } : undefined,
            include: {
                items: {
                    select: {
                        quantity: true,
                    }
                }
            }
        });

        console.log('Found cart:', cart?.id);

        const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
        console.log("Cart Count API - Total item: ", totalItems);
        return NextResponse.json({ count: totalItems });
    } catch (error) {
        console.error('[CART_COUNT]', error);
        return NextResponse.json({ count: 0 });
    }
}