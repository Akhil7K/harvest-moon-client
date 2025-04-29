import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCurrentUser } from './useCurrentUser';

export const useAuth = () => {
    const router = useRouter();
    const pathname = usePathname();
    const user = useCurrentUser();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const initAuth = async () => {
            try {
                setIsLoading(true);
                // Save the current URL when user hits login
                if (!user && pathname !== '/auth/sign-in' && pathname !== '/auth/sign-up') {
                    sessionStorage.setItem('returnUrl', pathname);
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Authentication failed'));
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, [user, pathname]);

    const redirectToLogin = () => {
        const returnUrl = sessionStorage.getItem('returnUrl') || '/';
        router.push(`/auth/sign-in?returnUrl=${encodeURIComponent(returnUrl)}`);
    };

    return {
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        redirectToLogin
    };
};