import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';

const SESSION_COOKIE_NAME = 'cart_session';
const CART_SESSION_TTL = 60 * 60 * 24 * 3; // 3 days in seconds

export const getCartSession = async () => {
  try {
    const cookieStore = cookies();
    let sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    console.log("SESSION: Getting Cart Session: ", sessionId);

    // Validate existing session
    if (sessionId) {
      const validSession = await db.cart.findUnique({
        where: {
          sessionId
        },
        select: {
          expiresAt: true
        }
      });

      if (!validSession || validSession.expiresAt < new Date()) {
        await db.cart.deleteMany({
          where: {
            sessionId
          }
        });
        sessionId = undefined;
        cookieStore.delete(SESSION_COOKIE_NAME);
      }
    }

    // Create new session if needed
    if (!sessionId) {
      sessionId = uuidv4();
      cookieStore.set({
        name: SESSION_COOKIE_NAME,
        value: sessionId,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: CART_SESSION_TTL,
        path: '/'
      });

      console.log("Created new Cart Session: ", sessionId);

      // Create cart record
      await db.cart.create({
        data: {
          sessionId,
          expiresAt: new Date(Date.now() + CART_SESSION_TTL * 1000),
          items: {create: []}
        }
      });
    }
    console.log('Final sessionId: ', sessionId);
    return sessionId;
  } catch (error) {
    console.error("Session creation error: ", error);
    throw new Error("Failed to initialize cart session");
  }
};

export const validateSession = async (sessionId: string) => {
  return db.cart.findUnique({
    where: {
      sessionId
    },
    select: {
      id: true,
      expiresAt: true
    }
  })
}