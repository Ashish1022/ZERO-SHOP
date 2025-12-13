"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Star } from "lucide-react";

import { GridTileImage } from "../components/tile";
import { Badge } from "@/components/ui/badge";

export const CarouselView = () => {
  const trpc = useTRPC();
  const { data: products } = useSuspenseInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions(
      { limit: 10 },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      }
    )
  );

  const allProducts = products.pages.flatMap((page) => page.data);

  const carouselProducts = [...allProducts, ...allProducts, ...allProducts];

  return (
    <section className="w-full pb-4 pt-3 lg:pb-6 lg:pt-4">
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

      <div className="mx-auto max-w-7xl px-4 mb-3 lg:px-6 lg:mb-4">
        <h2 className="text-xl font-bold tracking-tight lg:text-2xl">
          Trending Now
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground lg:text-sm">
          Popular products you might like
        </p>
      </div>

      <div className="w-full overflow-hidden pb-6 pt-1">
        <ul className="flex animate-carousel gap-2 lg:gap-3">
          {carouselProducts.map((product, i) => {
            const imageUrl =
              product.images?.find((img) => img.isPrimary)?.url ||
              product.images?.[0]?.url ||
              product.images?.find((img) => img.thumbnailUrl)?.thumbnailUrl;

            if (!imageUrl) {
              return null;
            }

            return (
              <li
                key={`${product.slug}-${i}`}
                className="relative aspect-square w-[45vw] max-w-[300px] flex-none md:w-[30vw] lg:w-[22vw]"
              >
                <div className="group relative h-full w-full overflow-hidden rounded-md border border-neutral-800 bg-neutral-900/50 transition-all hover:border-neutral-700 hover:shadow-lg hover:shadow-neutral-900/50">
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative block h-full w-full"
                    prefetch={true}
                  >
                    <GridTileImage
                      alt={product.name}
                      src={imageUrl}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      label={{
                        position: "bottom",
                        title: product.name,
                        amount: product.price,
                        currencyCode: "INR",
                      }}
                    />

                    {product.badge && (
                      <>
                        {(product.badge === "new" ||
                          product.badge.toLowerCase().includes("new")) && (
                          <Badge className="absolute left-2 top-2 z-10 bg-primary text-primary-foreground shadow-lg text-xs">
                            New
                          </Badge>
                        )}

                        {(product.badge === "sale" ||
                          product.badge.toLowerCase().includes("sale")) && (
                          <Badge
                            variant="destructive"
                            className="absolute right-2 top-2 z-10 shadow-lg text-xs"
                          >
                            Sale
                          </Badge>
                        )}
                      </>
                    )}

                    {product.reviewRating > 0 &&
                      product.badge &&
                      !product.badge.toLowerCase().includes("sale") && (
                        <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 backdrop-blur-sm">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-semibold text-white">
                            {product.reviewRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export function CarouselViewSkeleton() {
  return (
    <section className="w-full pb-4 pt-3 lg:pb-6 lg:pt-4">
      <div className="mx-auto max-w-7xl px-4 mb-3 space-y-1.5 lg:px-6 lg:mb-4">
        <div className="h-7 w-36 animate-pulse rounded-lg bg-neutral-800" />
        <div className="h-3.5 w-44 animate-pulse rounded bg-neutral-800" />
      </div>

      <div className="w-full overflow-hidden pb-6 pt-1">
        <ul className="flex gap-2 lg:gap-3">
          {[...Array(6)].map((_, i) => (
            <li
              key={i}
              className="relative aspect-square w-[45vw] max-w-[300px] flex-none animate-pulse rounded-md bg-neutral-800 md:w-[30vw] lg:w-[22vw]"
            />
          ))}
        </ul>
      </div>
    </section>
  );
}