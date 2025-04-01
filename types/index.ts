import { JsonValue } from "@prisma/client/runtime/library";

export interface ProductImage {
    url: string;
    position: number;
    key: string;
}

export interface ProductAttribute {
    label: string;
    values: string[];
}

export interface ProductVariant {
    id: string;
    price: number | null;
    isPublished: boolean;
    attributes: JsonValue;
    isDefault: boolean;
    packageDimensions?: {  
        length: number;
        width: number;
        height: number;
        weight: number;
        unit: string;
        weightUnit: string;
    };
    stockQuantity?: number;
}

export interface Product {
    id: string;
    name: string;
    description: string | null;
    isPublished: boolean;
    category: {
        name: string;
    } | null;
    imageUrls: ProductImage[];
    attributes: ProductAttribute[];
    defaultVariant: ProductVariant | null;
    variant: ProductVariant[];
}

export interface ProductCardProps {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string;
    category: string;
    weight: string;
    price: number;
    variantId: string;
    stock?: number;
  }