'use client';

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/format-price";
import axios from "axios";
import { useState } from "react";
import { getClientSession } from "@/lib/clientSession";
import { toast } from "sonner";

interface CartItem {
    id: string;
    quantity: number;
    variant: {
        id: string;
        title: string;
        price: number;
        product: {
            id: string;
            name: string;
            description: string | null;
            imageUrls: {
                url: string;
                position: number;
            }[];
        };
    };
}

export const cartColumns: ColumnDef<CartItem>[] = [
    {
        accessorKey: "variant.product.imageUrls",
        header: "Image",
        cell: ({ row }) => {
            const imageUrl = row.original.variant.product.imageUrls;
            const defaultImage = imageUrl.find(img => img.position === 1) || imageUrl[0]
            return (
                <div className="relative h-20 w-20">
                    <Image
                        src={defaultImage.url || "/placeholder.png"}
                        alt={row.original.variant.product.name}
                        fill
                        className="object-cover rounded-md"
                    />
                </div>
            );
        },
    },
    {
        accessorKey: "variant.product.name",
        header: "Product",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="font-medium">
                        {row.original.variant.product.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {row.original.variant.title}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "variant.product.description",
        header: "Description",
        cell: ({ row }) => {
            return (
                <p className="max-w-[200px] truncate">
                    {row.original.variant.product.description}
                </p>
            );
        },
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => {
            const QuantityCell =() => {
                const [loading, setLoading] = useState(false);
                const [quantity, setQuantity] = useState(row.original.quantity);

                const updateQuantity = async (newQuantity: number) => {
                    if (loading) return;
                    const sessionId = localStorage.getItem('cart_session');

                    if (!sessionId) {
                        toast.error("Invalid Session")
                    }
                    try {
                        setLoading(true);
                        await axios.patch(`/api/cart/items/${row.original.id}`,
                            {quantity: newQuantity},
                            {headers: {
                                'Content-Type': 'application/json',
                                'x-cart-session': sessionId,
                            }}
                        );

                        setQuantity(newQuantity);
                        window.dispatchEvent(new Event('cart-updated'));
                    } catch (error) {
                        console.error("Error updating quantity: ", error);
                        toast.error('Failed to update quantity. Please try again');
                        setQuantity(row.original.quantity);
                    } finally {
                        setLoading(false);
                    }
                };
                return (
                    <div className="flex items-center gap-2">
                        <Button variant={'outline'} size={'sm'} disabled={loading || quantity <= 1} onClick={() => updateQuantity(quantity - 1)}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className='font-medium'>{quantity}</span>
                        <Button variant={'outline'} size={'sm'} disabled={loading || quantity >= 5} onClick={() => updateQuantity(quantity + 1)}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                );
            }
            return <QuantityCell />
            
        },
    },
    {
        accessorKey: "variant.price",
        header: "Price",
        cell: ({ row }) => {
            return formatPrice(row.original.quantity * row.original.variant.price);
        },
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <Button
                variant="ghost"
                size="icon"
                className="text-harvest-primary hover:text-harvest-primary/80"
                onClick={async () => {
                    try {
                        const sessionId = getClientSession();
                        if (!sessionId) {
                            toast.error('Invalid session');
                        }
                        await axios.delete(`/api/cart/items/${row.original.id}`, {
                            headers: {
                                'x-cart-session': sessionId
                            }
                        });
                        window.dispatchEvent(new Event('cart-updated'));
                    } catch (error) {
                        console.error("Delete error: ", error);
                    }
                }}
            >
                <Trash2 className='h-4 w-4' />
            </Button>
        ),
    },
];