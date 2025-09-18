const CART_SESSION_KEY = 'cart_session';

export const getClientSession = () => {

  if (typeof window === 'undefined') return null;

  try {
    // Add a cookie to store server exposed client session
    const cookieSession = getCookie(CART_SESSION_KEY);
    if (cookieSession) return cookieSession;
    // Fallback to localStorage if cookie is not available
    const sessionId = localStorage.getItem(CART_SESSION_KEY);

    return sessionId;
    
    
} catch (error) {
    console.error("Client Session - Invalid client session format: ", error);
    return null;
}
};


export const persistClientSession = (sessionId: string) => {
  if (typeof window === 'undefined') return;
  // Persist server exposed client session to cookie
  document.cookie = `${CART_SESSION_KEY}=${sessionId}; path=/; max-age=259200`;
  localStorage.setItem(CART_SESSION_KEY, sessionId);
}

export const clearClientSession = () => {
  if (typeof window === undefined) return;
  try {
    // Clear server exposed client session from localStorage and cookie
    localStorage.removeItem(CART_SESSION_KEY);
    deleteCookie(CART_SESSION_KEY);
  } catch (error) {
    console.error("Failed to clear session");
  }
}

export const getCookie = (name: string) => {
  if (typeof document === 'undefined') return;
    
    const value = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${name}=`))
        ?.split('=')[1];
        
    return value ? decodeURIComponent(value) : undefined;
};

export const deleteCookie = (name: string) => {
  const date = new Date();
  date.setTime(date.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
  
  document.cookie = [
    `${name}=`, 
    `expires=${date.toUTCString()}`, 
    'path=/',
    process.env.NODE_ENV === 'production' ? 'secure' : '',
    'samesite=strict'
  ].join('; ');
};