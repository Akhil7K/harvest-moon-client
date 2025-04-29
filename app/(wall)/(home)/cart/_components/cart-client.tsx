'use client';

import { useEffect, useState } from 'react';
import { CartTable } from './cart-table';
import { cartColumns } from './cartColumns';
import { CartSummary } from './cart-summary';
import { useRouter } from 'next/navigation';
import { CartItemProps } from '@/types';
import { Loader2 } from 'lucide-react';
import { getClientSession } from '@/lib/clientSession';

interface CartClientProps {
    initialCart: any;
}

export function CartClient({ initialCart }: CartClientProps) {
    const [items, setItems] = useState(initialCart?.items || []);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Initialize client session on mount
    useEffect(() => {
        // Ensure client session exists
        getClientSession();
    }, []);

    useEffect(() => {
        // Handle cart updates
        const handleCartUpdate = async () => {
            try {
                setIsLoading(true);
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