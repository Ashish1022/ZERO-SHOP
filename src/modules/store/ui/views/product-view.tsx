"use client";

import { Gallery } from "../components/gallery";
import { Price } from "../../ui/components/price";
import { Prose } from "../../ui/components/prose";
import { Plus, ShoppingCart, Package, Truck, Shield, CheckCircle, ChevronRight, Star } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ProductProvider } from "@/modules/products/lib/product-context";
import { GridTileImage } from "../components/tile";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import useCart from "@/hooks/use-cart";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductView = ({ slug }: { slug: string }) => {
  const trpc = useTRPC();
  const cart = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { data: product } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ slug: slug })
  );

  const { data: products } = useSuspenseInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions(
      { limit: 10 },
      {
        getNextPageParam: (lastpage) => {
          return lastpage.nextCursor;
        },
      }
    )
  );

  const onAddToCart = () => {
    if (product) {
      setIsAdding(true);
      setTimeout(() => {
        cart.addItem(product);
        setIsAdding(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }, 500);
    }
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images[0]?.isPrimary
      ? product.images[0].url
      : product.images[1]?.url || product.images[0]?.url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.featured
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: "INR",
      price: product.price,
    },
  };

  return (
    <ProductProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 shadow-lg backdrop-blur-sm">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-sm font-medium text-green-500">Added to cart!</p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-400">
          <Link href="/" className="hover:text-neutral-200 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products" className="hover:text-neutral-200 transition-colors">
            Products
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-neutral-200">{product.name}</span>
        </nav>

        <div className="flex flex-col gap-6 rounded-2xl border border-neutral-800 bg-linear-to-br from-neutral-900 via-black to-neutral-900 p-4 shadow-2xl sm:p-6 md:p-8 lg:flex-row lg:gap-10 lg:p-12">
          <div className="h-full w-full basis-full lg:basis-3/5">
            <div className="overflow-hidden rounded-xl bg-neutral-950/50 p-2">
              <Gallery
                images={product.images
                  .slice(0, 5)
                  .map((image: (typeof product.images)[0]) => ({
                    src: image.url,
                  }))}
              />
            </div>
          </div>

          <div className="basis-full lg:basis-2/5">
            <div className="space-y-6 lg:sticky lg:top-20">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {product.featured && (
                    <Badge variant="secondary" className="gap-1.5 border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500/20">
                      <CheckCircle className="h-3 w-3" />
                      In Stock
                    </Badge>
                  )}
                  <Badge variant="outline" className="gap-1.5">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    4.8 (124 reviews)
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  {product.name}
                </h1>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <Price
                    amount={product.price}
                    currencyCode="INR"
                    size="xl"
                    className="text-4xl font-bold text-blue-500"
                  />
                  <span className="text-sm text-neutral-500 line-through">
                    ₹{(parseFloat(product.price) * 1.2).toFixed(2)}
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    20% OFF
                  </Badge>
                </div>
                <p className="text-sm text-neutral-400">
                  Inclusive of all taxes
                </p>
              </div>

              <Separator className="bg-neutral-800" />

              {product.description && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                    About This Product
                  </h3>
                  <Prose
                    className="text-sm leading-relaxed text-neutral-300"
                    html={product.description}
                  />
                </div>
              )}

              <div className="space-y-3">
                <Button
                  aria-label="Add to cart"
                  className="relative h-14 w-full overflow-hidden rounded-full bg-linear-to-r from-blue-600 to-blue-500 text-base font-semibold shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={onAddToCart}
                  disabled={isAdding || !product.featured}
                >
                  {isAdding ? (
                    <>
                      <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add To Cart
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-full border-neutral-700 hover:bg-neutral-800"
                  asChild
                >
                  <Link href="/cart">
                    View Cart
                  </Link>
                </Button>
              </div>

              <div className="grid gap-3 rounded-xl border border-neutral-800 bg-linear-to-br from-neutral-900/80 to-neutral-950/80 p-5 backdrop-blur-sm">
                <div className="flex items-start gap-3 group">
                  <div className="rounded-lg bg-blue-500/10 p-2 transition-colors group-hover:bg-blue-500/20">
                    <Truck className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Free Shipping</p>
                    <p className="text-xs text-neutral-400">
                      On orders over ₹500
                    </p>
                  </div>
                </div>
                
                <Separator className="bg-neutral-800" />
                
                <div className="flex items-start gap-3 group">
                  <div className="rounded-lg bg-blue-500/10 p-2 transition-colors group-hover:bg-blue-500/20">
                    <Shield className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Secure Payment</p>
                    <p className="text-xs text-neutral-400">
                      100% secure transactions
                    </p>
                  </div>
                </div>
                
                <Separator className="bg-neutral-800" />
                
                <div className="flex items-start gap-3 group">
                  <div className="rounded-lg bg-blue-500/10 p-2 transition-colors group-hover:bg-blue-500/20">
                    <Package className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Easy Returns</p>
                    <p className="text-xs text-neutral-400">
                      30-day return policy
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-500">500+</p>
                  <p className="text-xs text-neutral-400">Happy Customers</p>
                </div>
                <Separator orientation="vertical" className="h-12 bg-neutral-800" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-500">4.8</p>
                  <p className="text-xs text-neutral-400">Average Rating</p>
                </div>
                <Separator orientation="vertical" className="h-12 bg-neutral-800" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-500">100%</p>
                  <p className="text-xs text-neutral-400">Authentic</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-6 lg:mt-20">
          <style jsx>{`
            @keyframes carousel {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-100% / 3));
              }
            }

            .animate-carousel {
              animation: carousel 60s linear infinite;
            }

            .animate-carousel:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                You May Also Like
              </h2>
              <p className="mt-2 text-sm text-neutral-400">
                Discover similar products curated just for you
              </p>
            </div>
            <Button 
              variant="ghost" 
              asChild 
              className="hidden gap-2 hover:bg-neutral-800 sm:flex"
            >
              <Link href="/products">
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="relative w-full overflow-hidden rounded-xl">
            <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />
            
            <ul className="flex animate-carousel gap-4">
              {[
                ...products.pages.flatMap((page) => page.data),
                ...products.pages.flatMap((page) => page.data),
                ...products.pages.flatMap((page) => page.data),
              ].map((item, index) => {
                const imageUrl =
                  item.images?.find((img) => img.isPrimary)?.url ||
                  item.images?.[0]?.url;

                if (!imageUrl) return null;

                return (
                  <li
                    key={`${item.slug}-${index}`}
                    className="aspect-square w-44 shrink-0 sm:w-[220px] md:w-60 lg:w-64"
                  >
                    <Link
                      className="group relative block h-full w-full"
                      href={`/product/${item.slug}`}
                      prefetch={true}
                    >
                      <div className="relative h-full w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 transition-all hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-105">
                        <GridTileImage
                          alt={item.name}
                          label={{
                            title: item.name,
                            amount: item.price,
                            currencyCode: "INR",
                          }}
                          src={imageUrl}
                          fill
                          sizes="(min-width: 1024px) 256px, (min-width: 768px) 240px, (min-width: 640px) 220px, 176px"
                        />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <Button 
            variant="outline" 
            asChild 
            className="w-full gap-2 sm:hidden"
          >
            <Link href="/products">
              View All Products
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </ProductProvider>
  );
};

export const ProductViewSkeleton = () => {
    return (
      <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <nav className="mb-6 flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </nav>
  
        <div className="flex flex-col gap-6 rounded-2xl border border-neutral-800 bg-linear-to-br from-neutral-900 via-black to-neutral-900 p-4 shadow-2xl sm:p-6 md:p-8 lg:flex-row lg:gap-10 lg:p-12">
          <div className="h-full w-full basis-full lg:basis-3/5">
            <div className="overflow-hidden rounded-xl bg-neutral-950/50 p-2">
              <div className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="aspect-square w-20 rounded-md" />
                  ))}
                </div>
              </div>
            </div>
          </div>
  
          <div className="basis-full lg:basis-2/5">
            <div className="space-y-6 lg:sticky lg:top-20">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-8 w-3/4" />
              </div>
  
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-40" />
              </div>
  
              <Separator className="bg-neutral-800" />
  
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
  
              <div className="space-y-3">
                <Skeleton className="h-14 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
              </div>
  
              <div className="space-y-3 rounded-xl border border-neutral-800 bg-linear-to-br from-neutral-900/80 to-neutral-950/80 p-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    {i < 2 && <Separator className="mt-3 bg-neutral-800" />}
                  </div>
                ))}
              </div>
  
              <div className="flex items-center justify-center gap-4 pt-4">
                <div className="text-center space-y-2">
                  <Skeleton className="h-8 w-16 mx-auto" />
                  <Skeleton className="h-3 w-24 mx-auto" />
                </div>
                <Separator orientation="vertical" className="h-12 bg-neutral-800" />
                <div className="text-center space-y-2">
                  <Skeleton className="h-8 w-16 mx-auto" />
                  <Skeleton className="h-3 w-24 mx-auto" />
                </div>
                <Separator orientation="vertical" className="h-12 bg-neutral-800" />
                <div className="text-center space-y-2">
                  <Skeleton className="h-8 w-16 mx-auto" />
                  <Skeleton className="h-3 w-24 mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div className="mt-16 space-y-6 lg:mt-20">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="hidden h-10 w-24 sm:block" />
          </div>
  
          <div className="relative w-full overflow-hidden rounded-xl">
            <div className="flex gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square w-44 shrink-0 sm:w-[220px] md:w-60 lg:w-64"
                >
                  <Skeleton className="h-full w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>
  
          <Skeleton className="h-12 w-full sm:hidden" />
        </div>
      </div>
    );
  };