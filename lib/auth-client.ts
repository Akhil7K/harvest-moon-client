'use client';

import { SignInOptions, signIn as nextAuthSignIn, signOut } from "next-auth/react";

interface CustomSignInOptions extends SignInOptions {
    callbackUrl?: string;
    redirect?: boolean;
}

export const clientSignIn = async (
    provider: string, 
    options?: CustomSignInOptions
) => {
    return nextAuthSignIn(provider, options);
};

export { signOut };