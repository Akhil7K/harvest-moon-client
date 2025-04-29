import { v4 as uuidv4 } from 'uuid';

const CART_SESSION_KEY = 'guest_cart_session';

export const getClientSession = () => {
  try {
    let sessionId = localStorage.getItem(CART_SESSION_KEY);

    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem(CART_SESSION_KEY, sessionId);
      console.log('ClientSession - Created new session: ', sessionId);
    } else {
      console.log('ClientSession - Using existing session: ', sessionId);
    }

    return sessionId;
  } catch (error) {
    console.error("Failed to get client session:", error);
    throw new Error("Failed to get client session");
  }
};