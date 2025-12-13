"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";

import { GridTileImage } from "../components/tile";
import { Badge } from "@/components/ui/badge";
import { FeaturedProduct } from "@/modules/products/server/procedure";

const ItemGridItem = ({
  item,
  priority,
}: {
  item: FeaturedProduct;
  priority?: boolean;
}) => {
  const imageUrl = item.primaryImage?.url || item.primaryImage?.thumbnailUrl;

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="group relative aspect-square overflow-hidden rounded-md border border-neutral-800 bg-neutral-900/50 transition-all hover:border-neutral-700 hover:shadow-lg hover:shadow-neutral-900/50">
      <Link
        className="relative block h-full w-full"
        href={`/product/${item.slug}`}
        prefetch={true}
      >
        <GridTileImage
          src={imageUrl}
          width={600}
          height={600}
          priority={priority}
          alt={item.name}
          label={{
            position: "bottom",
            title: item.name,
            amount: item.price,
            currencyCode: "INR",
          }}
        />

        {item.badge && (
          <>
            {(item.badge === "new" ||
              item.badge.toLowerCase().includes("new")) && (
              <Badge className="absolute left-2 top-2 z-10 bg-primary text-primary-foreground shadow-lg text-xs">
                New
              </Badge>
            )}

            {(item.badge === "sale" ||
              item.badge.toLowerCase().includes("sale")) && (
              <Badge
                variant="destructive"
                className="absolute right-2 top-2 z-10 shadow-lg text-xs"
              >
                Sale
              </Badge>
            )}
          </>
        )}

        {item.reviewRating > 0 &&
          item.badge &&
          !item.badge.toLowerCase().includes("sale") && (
            <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 backdrop-blur-sm">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-white">
                {item.reviewRating.toFixed(1)}
              </span>
            </div>
          )}
      </Link>
    </div>
  );
};

export const HeroItemGridView = () => {
  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery(
    trpc.products.getFeatured.queryOptions({ limit: 6 })
  );

  if (!products?.data || products.data.length < 6) {
    return null;
  }

  const [first, second, third, fourth, fifth, sixth] = products.data;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 pt-3 lg:px-6 lg:pb-6 lg:pt-4">
      <div className="mb-3 flex items-end justify-between lg:mb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight lg:text-2xl">
            Featured Products
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground lg:text-sm">
            Discover our hand-picked selection
          </p>
        </div>
        <Link
          href="/products"
          className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline md:inline-flex"
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-3">
        <div className="col-span-1">
          <ItemGridItem item={fourth} priority={true} />
        </div>

        <div className="col-span-1">
          <ItemGridItem item={first} priority={true} />
        </div>
        <div className="col-span-1">
          <ItemGridItem item={third} />
        </div>

        <div className="col-span-1 lg:col-span-1">
          <ItemGridItem item={second} />
        </div>
        <div className="col-span-1 lg:col-span-1">
          <ItemGridItem item={fifth} />
        </div>

        <div className="col-span-1 lg:col-span-1">
          <ItemGridItem item={sixth} />
        </div>
      </div>

      <div className="mt-3 lg:hidden">
        <Link
          href="/products"
          className="flex w-full items-center justify-center gap-1 rounded-md border border-neutral-800 bg-neutral-900/50 py-2.5 text-sm font-medium text-primary transition-colors hover:border-neutral-700"
        >
          View All Products
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export function HeroItemGridSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 pt-3 lg:px-6 lg:pb-6 lg:pt-4">
      <div className="mb-3 flex items-end justify-between lg:mb-4">
        <div className="space-y-1.5">
          <div className="h-7 w-44 animate-pulse rounded-lg bg-neutral-800" />
          <div className="h-3.5 w-32 animate-pulse rounded bg-neutral-800" />
        </div>
        <div className="hidden h-5 w-20 animate-pulse rounded bg-neutral-800 md:block" />
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-3">
        <div className="col-span-2 row-span-2 aspect-square animate-pulse rounded-md bg-neutral-800" />

        <div className="col-span-1 aspect-square animate-pulse rounded-md bg-neutral-800" />
        <div className="col-span-1 aspect-square animate-pulse rounded-md bg-neutral-800" />
        <div className="col-span-1 aspect-square animate-pulse rounded-md bg-neutral-800" />
        <div className="col-span-1 aspect-square animate-pulse rounded-md bg-neutral-800" />
        <div className="col-span-1 aspect-square animate-pulse rounded-md bg-neutral-800" />
      </div>
    </section>
  );
}
