'use client';

import { useState } from "react";
import { logout } from "@/actions/auth/logout";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
    children: React.ReactNode;
}

export const LogoutButton = ({
    children
}: LogoutButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onClick = async () => {
        try {
            setIsLoading(true);
            await logout();
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
            router.refresh();
        }
    };

    return (
        <span 
            onClick={onClick} 
            className={cn("cursor-pointer flex items-center justify-start", isLoading && "pointer-events-none opacity-70")}
        >
            {isLoading && (
                <Loader2 className="animate-spin text-harvest-primary" />
            )}
            {children}
        </span>
    );
};