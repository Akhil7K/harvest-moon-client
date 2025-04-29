import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';

const CART_SESSION_TTL = 60 * 60 * 24 * 3; // 3 days in seconds

export const getCartSession = async () => {
  try {
    const cookieStore = cookies();
    let sessionId = cookieStore.get('cart_session')?.value;

    console.log("Getting Cart Session: ", sessionId);

    // Validate existing session
    if (sessionId && !validateUUID(sessionId)) {
      console.log('Invalid session ID format:', sessionId);
      sessionId = undefined;
      cookieStore.delete('cart_session');
    }

    // Create new session if needed
    if (!sessionId) {
      sessionId = uuidv4();
      cookieStore.set('cart_session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'lax',
        maxAge: CART_SESSION_TTL,
        path: '/'
      });

      console.log("Created new Cart Session: ", sessionId);

      // Create cart record
      await db.cart.create({
        data: {
          sessionId,
          expiresAt: new Date(Date.now() + CART_SESSION_TTL * 1000)
        }
      });
    }

    return sessionId;
  } catch (error) {
    console.error("Session creation error: ", error);
    return null;
  }
  
};

const validateUUID = (uuid: string) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
};