/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string}
 */
export const publicRoutes = [
    "/",
    "/product",
    "/cart",
    "/auth/new-verification",
    "/api/webhook",
    "/api/cart/items",
    '/auth/sign-in',
    '/auth/sign-up',
    '/api/cart/count',
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect users to /settings
 * @type {string}
 */
export const authRoutes = [
    '/auth/error',
    '/auth/reset-password',
    '/auth/new-password',
];

/**
 * Prefix for api authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';


/**
 * Default redirect path after sign-in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/';
