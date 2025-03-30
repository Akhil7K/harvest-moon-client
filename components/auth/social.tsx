'use client';

import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { clientSignIn } from "@/lib/auth-client";

export const Social = () => {
    const onClick = async(provider: "google") => {
        try {
            await clientSignIn(provider, {
                callbackUrl: DEFAULT_LOGIN_REDIRECT,
            });
        } catch (error) {
            console.error("Social Sign-in error");
        }
    }

    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                size={"sm"}
                variant={"outline"}
                className="w-full"
                onClick = {() => onClick("google")}
            >
                <FcGoogle className="h-5 w-5"/>
                Google
            </Button>
        </div>
    )
}