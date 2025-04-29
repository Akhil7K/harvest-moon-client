import { cache } from 'react';
import { db } from "@/lib/db";
import { Product } from '@/types';

export const getProducts = cache(async (): Promise<Product[]> => {
    try {
        const products= await db.product.findMany({
            take: 4,
            where: {
                isPublished: true,
                defaultVariant: {
                    isPublished: true,
                },
                defaultVariantId: {
                    not: null,
                }
            },
            select: {
                id: true,
                name: true,
                description: true,
                isPublished: true,
                category: {
                    select: {
                        name: true,
                    }
                },
                imageUrls: {
                    orderBy: { position: 'asc' }, // Get ordered images
                    take: 1,
                    select: { url: true, key: true, position: true}
                  },
                attributes: {
                where: { label: 'weight' },
                select: { label: true, values: true }
                },
                defaultVariant: {
                select: {
                    id: true,
                    price: true,
                    stockQuantity: true,
                    packageDimensions: {
                        select: {
                          length: true,
                          width: true,
                          height: true,
                          weight: true,
                          unit: true,
                          weightUnit: true
                        }
                    },
                    isDefault: true,
                    isPublished: true,
                    attributes: true,
                }
                },
                variant: {
                    select: {
                        id: true,
                        price: true,
                        isPublished: true,
                        attributes: true, // Add missing fields
                        isDefault: true,
                        packageDimensions: {
                            select: {
                                length: true,
                                width: true,
                                height: true,
                                weight: true,
                                unit: true,
                                weightUnit: true
                            }
                        },
                        stockQuantity: true
                    }
                }
            },
        });

        return products.map(product => ({
            ...product,
            category: product.category ? { name: product.category.name } : null,
            // Add temporary computed fields for ProductCardProps
            imageUrl: product.imageUrls[0]?.url || "/default-image.jpg",
            weight: product.attributes.find(a => a.label === 'weight')?.values[0] || "",
        })) as Array<Product & { 
            imageUrl: string; 
            weight: string 
        }>;
    } catch (error) {
        console.error("[PRODUCTS_GET]", error);
        return [];
    }
});