'use client'

import Link from "next/link";

interface BackButtonProps {
    note: string;
    label: string;
    href: string;
};

const BackButton = ({
    note,
    label,
    href,
} : BackButtonProps) => {
    return ( 
        <>
            <p className="text-sm text-center">
                {note}
                <Link href={href} className="text-purple-700/90 font-semibold mx-1 hover:text-purple-700/70 hover:underline hover:underline-offset-4 transition-all">
                    {label}
                </Link>
            </p>
        </>
     );
}
 
export default BackButton;