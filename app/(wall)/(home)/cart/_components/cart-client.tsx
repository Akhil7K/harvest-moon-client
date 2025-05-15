'use client';

import { useEffect, useState } from 'react';
import { CartTable } from './cart-table';
import { cartColumns } from './cartColumns';
import { CartSummary } from './cart-summary';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { CartItemProps, CartProps } from '@/types';
import axios from 'axios';
import { getClientSession, persistClientSession } from '@/lib/clientSession';

type CartResponse = CartProps;

interface CartClientProps {
    initialCart: CartResponse | null;
}

export function CartClient({ initialCart }: CartClientProps) {
    const [items, setItems] = useState<CartItemProps[]>(initialCart?.items || []);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Initialize client session on mount
    useEffect(() => {
        const initializeCart = async () => {
            try {
                // const response = await axios.get('/api/cart/session');
                // const {id: sessionId} = response.data;

                // // Storing in local-storage
                // localStorage.setItem('cart_session', sessionId);
                // console.log("CartClient - Session ID: ", sessionId);

                let sessionId = getClientSession();
                if (!sessionId) {
                    const response = await axios.get('/api/cart/session');
                    sessionId = response.data.sessionId;
                    if (sessionId) {
                        persistClientSession(sessionId);
                    }
                }
                if (!initialCart) {
                    const response = await axios.get('/api/cart/items', {
                        headers: {
                            'x-cart-session': sessionId
                        }
                    });
                    const cart = response.data[0];
                    setItems(cart?.items || []);
                }
            } catch (error) {
                console.error('Failed to initialize cart:', error);
            }
        };

        initializeCart();
    }, [initialCart]);

    useEffect(() => {
        // Handle cart updates
        const handleCartUpdate = async () => {
            try {
                setIsLoading(true);
                const sessionId = localStorage.getItem('cart_session');
                const response = await axios.get('/api/cart/items', {
                    headers: {
                        'x-cart-session': sessionId
                    }
                });
                const cart = response.data[0];
                setItems(cart?.items || []);
                router.refresh();
            } catch (error) {
                console.error('Failed to update cart:', error);
            } finally {
                setIsLoading(false);
            }
        };

        window.addEventListener('cart-updated', handleCartUpdate);
        return () => window.removeEventListener('cart-updated', handleCartUpdate);
    }, [router]);

    // Update items when initialCart changes
    useEffect(() => {
        setItems(initialCart?.items || []);
    }, [initialCart]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-harvest-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="w-full">
                <CartTable 
                    columns={cartColumns}
                    data={items}
                    isLoading={isLoading}
                />
            </div>
            
            <div className="flex justify-end">
                <div className="w-full max-w-md">
                    <CartSummary items={items} />
                </div>
            </div>
        </div>
    );
}