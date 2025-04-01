import { Suspense } from "react";
import { ProductCard } from "@/components/products/product-card";
import { ProductSkeleton } from "@/components/skeletons/product-skeleton";
import { getProducts } from "@/lib/get-products";

export const ProductSection = async () => {
    const products = await getProducts();

    return (
        <section className="w-full py-12">
            <div className="container mx-auto px-8">
                <h2 className="text-2xl md:text-3xl font-semibold mb-8">
                    Featured Products
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Suspense fallback={<ProductSkeleton count={4} />}>
                        {products.map((product) => {
                            if (!product.defaultVariant?.isPublished) {
                                return null;
                            }

                            return (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    description={product.description}
                                    imageUrl={product.imageUrls[0]?.url || '/assets/fallback-product.png'}
                                    category={product.category?.name || 'Veg'}
                                    weight={product.attributes[0]?.values[0] || ''}
                                    price={product.defaultVariant.price || 0}
                                    variantId={product.defaultVariant.id}
                                />
                            );
                        })}
                    </Suspense>
                </div>
            </div>
        </section>
    );
};