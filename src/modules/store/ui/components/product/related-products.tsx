"use client";

import { Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface RelatedProductsProps {
  productId: string;
  categoryId: string;
}

export const RelatedProducts = ({ productId, categoryId }: RelatedProductsProps) => {
  const trpc = useTRPC();
  
  const { data: relatedProducts } = useSuspenseQuery(
    trpc.products.getRelated.queryOptions({
      productId,
      categoryId,
      limit: 4,
    })
  );

  if (relatedProducts.length === 0) {
    return null; 
  }

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              You May Also Like
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
              Related Products
            </h2>
          </div>
          <Link href="/#shop">
            <Button variant="outline" size="lg">
              View All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {product.badge && (
                <div className="absolute top-3 left-3 z-10">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${
                    product.badge === 'sale' 
                      ? 'bg-red-500 text-white'
                      : product.badge === 'new'
                      ? 'bg-blue-500 text-white'
                      : product.badge === 'bestseller'
                      ? 'bg-amber-500 text-white'
                      : 'bg-purple-500 text-white'
                  }`}>
                    {product.badge}
                  </span>
                </div>
              )}

              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  size="icon" 
                  variant="default" 
                  className="h-8 w-8 rounded-full shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Add to cart:", product.id);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="aspect-square bg-secondary relative overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image.url}
                    alt={product.image.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain p-6 group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-4">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {product.category.name}
                </span>
                
                <h3 className="font-semibold text-foreground mt-1 line-clamp-1 group-hover:text-brand transition-colors">
                  {product.name}
                </h3>
                
                {product.reviewCount > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium">
                      {product.averageRating.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviewCount})
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold text-foreground">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
                    <span className="text-xs text-muted-foreground line-through">
                      ${Number(product.compareAtPrice).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};