'use client';

import { formatPrice } from "@/lib/format-price";
import { CartItemProps } from "@/types";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import { Loader2 } from "lucide-react";

interface CartSummaryProps {
    items: CartItemProps[];
}

export const CartSummary = ({ items }: CartSummaryProps) => {
    const {handleCheckoutNavigation, isProcessing} = useCheckout();

    const subtotal = useMemo(() => {
        return items.reduce((total, item) => {
            return total + (item.variant.price * item.quantity);
        }, 0);
    }, [items]); 

    return (
        <div className="mt-8 rounded-lg bg-gray-50 px-4 py-6">
            <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div className="text-base font-medium text-gray-900">Subtotal</div>
                    <div className="text-xl font-semibold text-harvest-primary">
                        {formatPrice(subtotal)}
                    </div>
                </div>
                
                <Button 
                    variant="harvest"
                    size="lg"
                    className="w-full"
                    disabled={items.length === 0 || isProcessing}
                    onClick={handleCheckoutNavigation}
                    aria-label={
                        items.length === 0
                        ? "Cart is empty"
                        : "Proceed to Checkout"
                    }
                >
                    {isProcessing ? (
                        <div className="flex items-center gap-2">
                            Processing...
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    ) : (
                        'Proceed to Checkout'
                    )}
                </Button>
            </div>
        </div>
    );
};