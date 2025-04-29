'use client';

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { getClientSession } from '@/lib/clientSession';

export function ClearCartButton() {
    const handleClearCart = async () => {
        try {
            await axios.delete('/api/cart/items', {
                headers: { 'x-cart-session': getClientSession() }
            });
            window.dispatchEvent(new Event('cart-updated'));
        } catch (error) {
            console.error('Failed to clear cart:', error);
        }
    };

    return (
        <Button 
            variant="destructive"
            onClick={handleClearCart}
        >
            Clear Cart
        </Button>
    );
}