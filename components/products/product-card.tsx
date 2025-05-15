'use client';

import * as z from 'zod';
import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/format-price";
import { ProductCardProps } from "@/types";
import axios from 'axios';
import { toast } from "sonner";
import { QuantitySelector } from "./quantity-selector";
import { AddtoCartSchema } from '@/schemas';
import { getClientSession } from '@/lib/clientSession';
import { useRouter } from 'next/navigation';

export const ProductCard = ({
    id,
    name,
    description,
    imageUrl,
    category,
    weight,
    price,
    variantId,
}: ProductCardProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();

    const handleAddToCart = async(values: z.infer<typeof AddtoCartSchema>) => {
        if (isLoading) return;
        try {
            setIsLoading(true);
            const sessionId = getClientSession();
            const response = await axios.post(`/api/cart/items`, {
                variantId: values.variantId,
                quantity: values.quantity
            }, {
                headers: {
                    "Content-Type": 'application/json',
                    "X-Cart-Session": sessionId,
                },
                withCredentials: true
            });

            if (response.status === 200) {
                toast.success("Added to cart successfully");
                window.dispatchEvent(new Event('cart-updated'));
                router.push("/cart");
            } else {
                throw new Error("Failed to add to cart")
            }
            console.log("Added to cart successfully");
        } catch (error) {
            console.log("Action failed", error);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || 'Failed to add to cart');
            } else {
                toast.error('Something went wrong');
            }                       
        } finally {
            setIsLoading(false);
        }
    }

    const handleBuyNow = async(values: {id: string; variantId: string; quantity: number}) => {
        if (isLoading) return;

        try {
            // setIsLoading(true);
            // console.log("Redirecting to Checkout");
            // await axios.post(`/api/checkout/`, {values});

            const sessionId = getClientSession();

            await axios.post(`/api/checkout`, {
                ...values,
                sessionId
            });
        } catch (error) {
            console.log("Action failed", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full group relative overflow-hidden rounded-xl transition-all hover:shadow-lg">
            <CardHeader className="p-0">
                <div className="relative aspect-square">
                    <Image 
                        alt={`${name} image`}
                        src={imageUrl}
                        fill
                        className="object-cover transition-transform"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        priority
                    />
                    <div className="absolute top-2 right-2">
                        {category?.name === "Veg" ? 
                        (
                            <Image
                                src={`/assets/veg-sign.png`}
                                alt={category.name}
                                width={24}
                                height={24}
                            />
                        ) : (
                            <Image
                                src={`/assets/nonveg-sign.png`}
                                alt={category?.name as string}
                                width={24}
                                height={24}
                            />
                        )
                    }
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
                <h3 className="text-lg font-semibold tracking-tight text-slate-800">
                    {name}
                </h3>
                {description && (
                    <p className="text-sm text-slate-500 line-clamp-2">
                        {description}
                    </p>
                )}
                <div className="flex flex-col items-start justify-center">
                    <span className="text-lg font-base text-slate-600">
                        {weight}
                    </span>
                    <span className="text-lg font-base text-harvest-primary">
                        {formatPrice(price)}
                    </span>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 gap-2 flex flex-col items-center justify-center w-full">
                <div className="w-full">
                    <QuantitySelector 
                        quantity={quantity}
                        onQuantityChange={setQuantity}
                    />
                </div>
                <div className="flex gap-2 w-full">
                    <Button 
                        variant="harvest" 
                        className="flex-1"
                        onClick={() => handleAddToCart({
                            variantId,
                            quantity,
                        })}
                        disabled={isLoading}
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                    </Button>
                    <Button 
                        variant="green"
                        className="flex-1"
                        onClick={() => handleBuyNow({
                            id,
                            variantId,
                            quantity,
                        })}
                        disabled={isLoading}
                    >
                        Buy Now
                    </Button>
                </div>
                
            </CardFooter>
        </Card>
    );
};