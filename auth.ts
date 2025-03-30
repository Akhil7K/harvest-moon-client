import NextAuth from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import { db } from "./lib/db";
 
export const { handlers, signIn, signOut, auth } = NextAuth({

  adapter: PrismaAdapter(db),
  session: {strategy: "jwt", maxAge: 30 * 24 * 60 * 60, },  //30 days
  ...authConfig,
})