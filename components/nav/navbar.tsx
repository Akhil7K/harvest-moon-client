'use client';

import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "../ui/button";
import { UserButton } from "../auth/user-button";
import { MenuIcon, ShoppingBasketIcon } from "lucide-react";
import { CartCount } from "./cart-count";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const NavLinks = ({onClick}: {onClick?: () => void}) => (
    <div className="flex flex-col lg:flex-row items-center justify-around gap-x-2">
        <Link href={'/'} onClick={onClick}>
            <Button variant={'customGhost'} className="text-lg">
                Home
            </Button>
        </Link>
        <div className="border w-full mx-auto lg:h-full lg:py-2 border-harvest-primary/60" />
        <Link href={'/product'} onClick={onClick}>
            <Button variant={'customGhost'} className="text-lg">
                Product
            </Button>
        </Link>
        <div className="border w-full mx-auto lg:h-full lg:py-2 border-harvest-primary/60" />
        <Link href={'/about'} onClick={onClick}>
            <Button variant={'customGhost'} className="text-lg">
                About
            </Button>
        </Link>
        <div className="border w-full mx-auto lg:h-full lg:py-2 border-harvest-primary/60" />
        <Link href={'/contact'} onClick={onClick}>
            <Button variant={'customGhost'} className="text-lg">
                Contact
            </Button>
        </Link>
        <div className="border w-full mx-auto lg:h-full lg:py-2 border-harvest-primary/60" />
        <Link href={'/cart'} onClick={onClick}>
            <Button variant={'customGhost'} className="text-lg">
                My Plate
            </Button>
        </Link>
    </div>
);

export const Navbar = () => {
    return (
        <nav className="w-full fixed flex items-center justify-between px-2 lg:px-8 py-8 bg-gradient-to-r from-white from-40% to-[#e6e7d2] h-16 z-50">
            <Logo />
            <div className="hidden h-full lg:flex items-center justify-around gap-x-2">
                <NavLinks />
                <Link href={'/cart'}>
                    <ShoppingBasketIcon className="text-harvest-primary border-4 h-10 w-10 p-1 rounded-full border-[#c30000]" />
                    <CartCount />
                </Link>
                <UserButton />
            </div>

            {/* Mobile Nav */}
            <div className="flex items-center gap-x-2 lg:hidden">
                <Link href={'/cart'}>
                <div className="relative">
                    <ShoppingBasketIcon className="text-harvest-primary border-4 h-9 w-9 p-1 rounded-full border-[#c30000]" />
                    <CartCount />
                </div>
                </Link>
                <UserButton />
                <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Open menu">
                    <MenuIcon className="h-9 w-9 text-harvest-primary" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 flex flex-col gap-2 pt-10">
                    <NavLinks />
                </SheetContent>
                </Sheet>
            </div>
        </nav>
    )
}