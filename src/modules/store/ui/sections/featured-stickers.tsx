"use client"

import Link from "next/link";
import Image from "next/image";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import useCart from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export const FeaturedStickers = () => {
  const router = useRouter();

  const cart = useCart();

  const trpc = useTRPC();
  const { data } = useSuspenseInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions(
      { limit: 6 },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      }
    )
  );

  const products = data.pages.flatMap((page) => page.data);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent, product: any) => {
      e.stopPropagation();

      cart.addItem(
        {
          productId: product.id.toString(),
          name: product.name,
          price: product.price,
          image: product.primaryImage?.url || "",
          category: product.category?.name || "Uncategorized",
          slug: product.slug,
        },
        1
      );
    },
    [cart]
  );

  return (
    <section id="shop" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Featured
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">
              Best Sellers
            </h2>
          </div>
          <Button variant="outline" size="lg" asChild>
            <Link href={"/products"}>View All Stickers</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(`/products/${product.slug}`)}
            >
              <div className="relative aspect-square bg-secondary overflow-hidden">
                {product.primaryImage ? (
                  <Image
                    src={product.primaryImage.url}
                    alt={product.primaryImage.alt || product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No image</p>
                    </div>
                  </div>
                )}
                {product.badge && (
                  <Badge
                    variant="secondary"
                    className="absolute top-2 left-2 capitalize"
                  >
                    {product.badge}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                {product.category && (
                  <p className="text-xs text-primary font-medium mb-1 uppercase tracking-wide">
                    {product.category.name}
                  </p>
                )}
                <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                {product.shortDescription && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.shortDescription}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold">
                      ₹{Number(product.price).toFixed(2)}
                    </span>
                    {product.compareAtPrice &&
                      Number(product.compareAtPrice) >
                      Number(product.price) && (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{Number(product.compareAtPrice).toFixed(2)}
                          </span>
                          <Badge variant="destructive" className="text-xs">
                            {Math.round(
                              ((Number(product.compareAtPrice) -
                                Number(product.price)) /
                                Number(product.compareAtPrice)) *
                              100
                            )}
                            % OFF
                          </Badge>
                        </>
                      )}
                  </div>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Bag
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FeaturedStickersSkeleton = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Featured
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">
            Best Sellers
          </h2>
        </div>
        <Button variant="outline" size="lg" asChild>
          <Link href={"/products"}>View All Stickers</Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden transition-shadow hover:shadow-lg">
            <CardContent className="p-0">
              <div className="relative">
                <Skeleton className="aspect-square w-full" />

                {index % 3 === 0 && (
                  <div className="absolute right-2 top-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                )}
              </div>

              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-20" />

                <Skeleton className="h-6 w-full" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-20" />
                  {index % 2 === 0 && (
                    <>
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-14" />
                    </>
                  )}
                </div>

                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};