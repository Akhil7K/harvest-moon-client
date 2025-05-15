'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getClientSession } from '@/lib/clientSession';
import { useAuth } from '@/hooks/useAuth';

export const CartCount = () => {
    const [count, setCount] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        let mounted = true;
        const getCartCount = async () => {
            try {
                // Always get session ID regardless of user state
                const session = getClientSession();
                console.log("CartCount - using sessionId: ", session);
                const response = await axios.get('/api/cart/count', {
                    headers: {
                        'X-Cart-Session': session || ''
                    }
                });

                if (mounted) {
                    console.log('CartCount - Received count: ', response.data.count);
                    setCount(response.data.count);
                }
            } catch (error) {
                console.error('Failed to fetch cart count:', error);
                if (mounted) setCount(0);
            }
        };

        getCartCount();

        const handleCartUpdate = () => {
            console.log('CartCount - Cart updated event received');
            getCartCount();
        };

        window.addEventListener('cart-updated', handleCartUpdate);
        
        return () => {
            mounted = false;
            window.removeEventListener('cart-updated', handleCartUpdate);
        };
    }, [user]);

    if (count === 0) return null;

    return (
        <div className="absolute bottom-1.5 right-20">
            {count > 0 && (
                <div className="h-6 w-6 rounded-full bg-harvest-primary/80 flex items-center justify-center">
                    <span className='text-xs font-medium text-white'>
                        {count > 10 ? '9+' : count}
                    </span>
                </div>
            )}
        </div>
    );
};