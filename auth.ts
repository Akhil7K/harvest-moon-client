import NextAuth from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";

import { db } from "./lib/db";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getUserById } from "./data/user";
import authConfig from "./auth.config";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
pages: {
  signIn: "/auth/sign-in",
  error: "/auth/error",
},
  callbacks: {
    async signIn({user}) {
      const existingUser = await getUserById(user.id as string);

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
  adapter: PrismaAdapter(db),
  session: {strategy: "jwt"},
  ...authConfig,
})