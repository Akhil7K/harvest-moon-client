'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useState } from 'react';
import axios from 'axios';
import { deleteCookie, getClientSession } from '@/lib/clientSession';


export const useCheckout = () => {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckoutNavigation = async () => {
        if (isProcessing) return;

        try {
            setIsProcessing(true);
            console.log("Button Clicked");

            if (!isAuthenticated || !user) {
                
                // const guestSession = getCookie('guest_cart_session');
                const guestSession = getClientSession();
                if (!guestSession) {
                    toast.error('Cart session initialization failed');
                    return;
                }

                // Set return url
                // sessionStorage.setItem('returnUrl', '/checkout');
                router.push(`/auth/sign-in?guestSession=${guestSession}&returnUrl=/checkout`);
                return;
            }

            // Validate cart before proceeding
            try {
                const response = await axios.get('/api/cart/validate', {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-user-id': user.id
                    },
                    withCredentials: true
                });

                if (!response.data.valid) {
                    if (response.status === 409) {
                        // Handle specific item errors
                        response.data.items?.forEach((item: { error: string }) => {
                            toast.error(`Error: ${item.error}`);
                        });
                        return;
                    }
                    
                    throw new Error('Failed to validate cart');
                }
                const guestSessionId = getClientSession();

                if (guestSessionId) {
                    const mergeResponse = await axios.post('/api/cart/merge', {guestSessionId}, {
                        headers: {
                            withCredentials: true
                        },
                    });

                    if (!mergeResponse.data) {
                        throw new Error('Cart Merge Failed');
                    }
                    localStorage.removeItem('cart_session');
                    deleteCookie('cart_session');
                    deleteCookie('guest_cart_session');
                }

                // Perform cart-merge before redirecting to Checkout Page

                router.push('/checkout');
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.error || 'Failed to validate cart');
                    return;
                }
                throw error;
            }
        } catch (error) {
            console.error('Checkout navigation error:', error);
            toast.error(
                error instanceof Error ? error.message : 'Failed to proceed to checkout'
            );
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        handleCheckoutNavigation,
        isAuthenticated,
        isProcessing,
        userId: user?.id // Expose user ID for components that need it
    } as const;
};