'use client';

import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { clientSignIn } from "@/lib/auth-client";
import { useState } from "react";
import { getClientSession } from "@/lib/clientSession";

export const Social = () => {
    const [loading, setIsLoading] = useState(false);

    const onClick = async(provider: "google") => {
        try {
            setIsLoading(true);
            const returnUrl = sessionStorage.getItem('returnUrl');
            const guestSession = getClientSession();
            if (guestSession) {
                localStorage.setItem('guest_cart_session', guestSession.id);
            }
            const callbackUrl = returnUrl || DEFAULT_LOGIN_REDIRECT;

            await clientSignIn(provider, {
                callbackUrl: callbackUrl,
                redirect: true
            });
        } catch (error) {
            console.error("Social Sign-in error", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                size={"sm"}
                variant={"outline"}
                className="w-full"
                onClick = {() => onClick("google")}
                disabled={loading}
            >
                <FcGoogle className="h-5 w-5"/>
                Google
            </Button>
        </div>
    )
}