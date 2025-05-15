import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google';
import { LoginSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { getUserByEmail, getUserById } from "./data/user";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { db } from "./lib/db";
import { CartService } from "./lib/cart";
import { deleteCookie, getCookie } from "./lib/clientSession";

export default {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: 'select_account',
                access_type: 'offline',
                response_type: 'code'
              }
            }
        }),
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await getUserByEmail(email);
                    if (!user || !user.password) return null;

                    const passwordsMatch = await bcrypt.compare(
                        password,
                        user.password,
                    );

                    if (passwordsMatch) return user;
                }
                return null;
            }
        }),
    ],
    pages: {
      signIn: "/auth/sign-in",
      error: "/auth/error",
    },
    events: {
      async linkAccount({user}) {
        await db.user.update({
          where: {
            id: user.id
          },
          data: {
            emailVerified: new Date()
          }
        })
      }
    },
    callbacks: {
      async signIn({user, account}) {
        try{
          const existingUser = await getUserById(user.id as string);

          if (!existingUser || existingUser.role !== 'USER') {
            console.error("Error signing-in: User does not exist or has invalid role");
            return false;
          }
          if (user.id) {
            const cartService = new CartService();
            const guestSessionId = getCookie('guest_cart_session')

            if (guestSessionId) {
              // Validate session before merge
              const isValidSession = await db.cart.findUnique({
                where: {
                  sessionId: guestSessionId
                },
                select: {
                  userId: true,
                }
              });

              if (!isValidSession?.userId && guestSessionId) {
                await cartService.mergeCarts(user.id, guestSessionId, 'PRIORITIZE_USER');
                deleteCookie('guest_cart_session');
                localStorage.removeItem('cart_session');
              }
            }
            return true;
          }

          if (account?.provider !== 'credentials') return true;

          
    
          // Prevent sign-in if email not verified
          if(!existingUser?.emailVerified) return false;
          
          if (existingUser.isTwoFactorEnabled) {
            const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
    
            if (!twoFactorConfirmation) return false;
    
            // Delete two factor confirmation for next sign-in
            await db.twoFactorConfirmation.delete({
              where: {id: twoFactorConfirmation.id}
            });
          }
      
          return true;
        } catch (error) {
          console.error("Error during sign-in");
          return false; 
        }
      },
      async session({token, session}) {
        if (token.sub && session.user) {
          session.user.id = token.sub;
        }
  
        if (token.role && session.user) {
          session.user.role = token.role as "ADMIN" | "USER";
        }
        return session;
      },
        async jwt({token}) {
        if (!token.sub) return token;
  
        const existingUser = await getUserById(token.sub);
  
        if (!existingUser) return token;
        token.role = existingUser.role;
        return token;
        }
    },
} satisfies NextAuthConfig;