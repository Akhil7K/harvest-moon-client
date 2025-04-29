'use client';

import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "../ui/button";
import { UserButton } from "../auth/user-button";
import { ShoppingBasketIcon } from "lucide-react";
import { CartCount } from "./cart-count";

export const Navbar = () => {
    return (
        <div className="w-full fixed flex items-center justify-between px-8 py-8 bg-gradient-to-r from-white from-40% to-[#e6e7d2] h-16 z-50">
            <Logo />
            <div className="h-full flex items-center justify-around gap-x-2">
                <Link href={'/'}>
                    <Button variant={'customGhost'} className="text-lg">
                        Home
                    </Button>
                </Link>
                <div className="border h-full py-2 border-harvest" />
                <Link href={'/product'}>
                    <Button variant={'customGhost'} className="text-lg">
                        Product
                    </Button>
                </Link>
                <div className="border h-full py-2 border-harvest" />
                <Link href={'/about'}>
                    <Button variant={'customGhost'} className="text-lg">
                        About
                    </Button>
                </Link>
                <div className="border h-full py-2 border-harvest" />
                <Link href={'/contact'}>
                    <Button variant={'customGhost'} className="text-lg">
                        Contact
                    </Button>
                </Link>
                <div className="border h-full py-2 border-harvest" />
                <Link href={'/cart'}>
                    <Button variant={'customGhost'} className="text-lg">
                        My Plate
                    </Button>
                </Link>
                <Link href={'/cart'}>
                    <ShoppingBasketIcon className="text-harvest-primary border-4 h-10 w-10 p-1 rounded-full border-[#c30000]" />
                    <CartCount />
                </Link>
                <UserButton />
            </div>
        </div>
    )
}