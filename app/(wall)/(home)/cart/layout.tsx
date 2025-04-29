import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Cart",
    description: "Your cart page",
}

export default async function CartLayout({
    children,
}: {children: React.ReactNode}) {
    return (
        <div className="pt-20 w-full h-full px-16">
            <div className="w-full">
                {children}
            </div>
        </div>
    )
}