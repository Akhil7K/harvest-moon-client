import NextAuth from "next-auth";

import authConfig from "./auth.config";
import { 
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
 } from "@/routes";
import { getCookie } from "./lib/clientSession";


const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;

    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isCartRoute = nextUrl.pathname.startsWith('/api/cart');

    if (isApiAuthRoute || isCartRoute) {
      return;
    }

    if (isAuthRoute) {
      if (isLoggedIn){
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return;
    }

    if (!isLoggedIn && !isPublicRoute) {
      return Response.redirect(new URL("/auth/sign-in", nextUrl));
    }

    if (nextUrl.pathname.startsWith('/checkout')) {
      const guestSession = getCookie('cart_session');
      // const callbackUrl = encodeURIComponent(nextUrl.pathname);
      const callbackUrl = encodeURIComponent(`/checkout?mergeSession=${guestSession}`);
      return Response.redirect(new URL(`/auth/sign-in?callback=${callbackUrl}`, nextUrl));
    }
});

export const config = {
    matcher: [
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      '/(api|trpc)(.*)',
    ],
  };