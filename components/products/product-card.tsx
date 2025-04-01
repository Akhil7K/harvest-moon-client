'use client';

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/format-price";
import { ProductCardProps } from "@/types";

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

    const handleAddToCart = () => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            console.log("Added to Cart");
        } catch (error) {
            console.log("Action failed", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleBuyNow = () => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            console.log("Redirecting to Checkout");
        } catch (error) {
            console.log("Action failed", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="group relative overflow-hidden rounded-xl transition-all hover:shadow-lg">
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
                        {category === "Veg" ? 
                        (
                            <Image
                                src={`/assets/veg-sign.png`}
                                alt={category}
                                width={24}
                                height={24}
                            />
                        ) : (
                            <Image
                                src={`/assets/nonveg-sign.png`}
                                alt={category}
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
            <CardFooter className="p-4 pt-0 gap-2">
                <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleAddToCart()}
                    disabled={isLoading}
                >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                </Button>
                <Button 
                    variant="default"
                    className="flex-1"
                    onClick={() => handleBuyNow()}
                    disabled={isLoading}
                >
                    Buy Now
                </Button>
            </CardFooter>
        </Card>
    );
};