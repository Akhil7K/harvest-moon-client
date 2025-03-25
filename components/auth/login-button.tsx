'use client';

import { useRouter } from "next/navigation";
interface LoginButtonProps{
    children: React.ReactNode;
    mode?: "modal" | "redirect",
    asChild?: boolean;
}

export const LoginButton = ({
    children,
    mode = "redirect",
}: LoginButtonProps) =>{

    const router = useRouter();

    const onClick = ()=>{
        router.push("/auth/sign-in");
    }

    if (mode === 'redirect') {
        return;
    }
    
    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
};