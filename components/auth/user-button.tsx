'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar';
import { LogoutButton } from './logout-button';
import { LoginButton } from './login-button';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';
import { useState } from 'react';
import { toast } from 'sonner';
import LottieComponent from '../lottie-component';

export const UserButton = () => {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, error } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    // Handle loading state
    if (isLoading) {
        return (
            <Skeleton className="h-9 w-9 rounded-full" />
        );
    }

    // Handle error state
    if (error) {
        toast.error("Failed to load user data");
        return (
            <Avatar className="hover:opacity-75 transition bg-red-100">
                <AvatarFallback>
                    <LottieComponent />
                </AvatarFallback>
            </Avatar>
        );
    }

    const handleNavigate = (path: string) => {
        setIsOpen(false); // Close dropdown
        router.push(path);
    };
    console.log('User Avatar: ', user?.image);

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className="outline-none">
                <Avatar className="hover:opacity-75 transition">
                    <AvatarImage 
                        src={user?.image || ''} 
                        alt={user?.name || 'User avatar'}
                    />
                    <AvatarFallback className='bg-harvest-primary'>
                        <LottieComponent />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-60' align='end'>
                {isAuthenticated ? (
                    <>
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            onClick={() => handleNavigate('/profile')}
                            className="cursor-pointer"
                        >
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => handleNavigate('/orders')}
                            className="cursor-pointer"
                        >
                            Orders
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <LogoutButton>
                            <DropdownMenuItem 
                                className="cursor-pointer text-red-600 focus:text-red-600"
                                onSelect={(e) => e.preventDefault()}
                            >
                                Logout
                            </DropdownMenuItem>
                        </LogoutButton>
                    </>
                ) : (
                    <>
                        <DropdownMenuLabel>
                            Welcome to Harvest Moon!
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <LoginButton>
                            <DropdownMenuItem 
                                className="cursor-pointer"
                                onSelect={(e) => e.preventDefault()}
                            >
                                Sign In
                            </DropdownMenuItem>
                        </LoginButton>
                        <DropdownMenuItem 
                            onClick={() => handleNavigate('/auth/sign-up')}
                            className="cursor-pointer"
                        >
                            Create Account
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};