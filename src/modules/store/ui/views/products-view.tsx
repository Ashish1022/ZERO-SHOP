"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { SlidersHorizontal, ShoppingCart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { ProductFilters } from "../components/product/filters";

import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  useProductFilters,
  sortedValues,
} from "@/modules/products/hooks/use-product-filters";
import { Skeleton } from "@/components/ui/skeleton";
import useCart from "@/hooks/use-cart";
import toast from "react-hot-toast";

export const ProductsView = () => {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const cart = useCart();
  const [filters, setFilters] = useProductFilters();

  const trpc = useTRPC();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        {
          q: filters.search,
          categorySlugs: filters.category,
          sort: filters.sort,
        },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.nextCursor;
          },
        }
      )
    );

  const products = data.pages.flatMap((page) => page.data);

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      category: [],
      sort: "newest",
    });
  }, [setFilters]);

  const handleSortChange = useCallback(
    (value: string) => {
      setFilters((prev) => ({
        ...prev,
        sort: value as (typeof sortedValues)[number],
      }));
    },
    [setFilters]
  );

  const hasActiveFilters =
    filters.search || (filters.category && filters.category.length > 0);

  const getSortLabel = (value: string) => {
    const labels: Record<string, string> = {
      featured: "Featured",
      low_to_high: "Price: Low to High",
      high_to_low: "Price: High to Low",
      newest: "Newest First",
    };
    return labels[value] || "Sort by";
  };

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
    <div className="min-h-screen bg-background">
      <div className="pt-20 bg-linear-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">All Products</h1>
          <p className="text-lg text-muted-foreground">
            Discover our complete collection of premium vinyl stickers
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block lg:w-72 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="text-xl font-bold">Filters</h2>
              </div>
              <ProductFilters />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">
                  {products.length}{" "}
                  {products.length === 1 ? "product" : "products"} found
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-muted-foreground hover:text-foreground underline text-left"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="lg:hidden flex-1 sm:flex-none"
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {hasActiveFilters && (
                        <Badge variant="secondary" className="ml-2">
                          {(filters.category?.length || 0) +
                            (filters.search ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-90 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <ProductFilters />
                    </div>
                  </SheetContent>
                </Sheet>

                <Select value={filters.sort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full sm:w-50">
                    <SelectValue placeholder="Sort by">
                      {getSortLabel(filters.sort)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="low_to_high">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="high_to_low">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.search && (
                  <Badge variant="secondary" className="gap-2">
                    Search: {filters.search}
                    <button
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, search: "" }))
                      }
                      className="hover:text-foreground"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {filters.category?.map((slug) => (
                  <Badge key={slug} variant="secondary" className="gap-2">
                    {slug}
                    <button
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          category: prev.category.filter((s) => s !== slug),
                        }))
                      }
                      className="hover:text-foreground"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
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

                {hasNextPage && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      variant="outline"
                      size="lg"
                    >
                      {isFetchingNextPage ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More Products"
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-16">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-xl font-semibold text-muted-foreground mb-2">
                    No products found
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Try adjusting your filters or search query to find what
                    you're looking for
                  </p>
                  <Button onClick={clearFilters} variant="outline" size="lg">
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductsViewSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 bg-linear-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">All Products</h1>
          <p className="text-lg text-muted-foreground">
            Discover our complete collection of premium vinyl stickers
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block lg:w-72 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="text-xl font-bold">Filters</h2>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Search</label>
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">
                  Categories
                </label>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-5 w-32" />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="lg:hidden flex-1 sm:flex-none"
                  disabled
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                <Select disabled>
                  <SelectTrigger className="w-full sm:w-50">
                    <SelectValue placeholder="Sort by">Sort by</SelectValue>
                  </SelectTrigger>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="relative aspect-square bg-secondary">
                    <Skeleton className="w-full h-full" />
                  </div>

                  <CardContent className="p-4">
                    <Skeleton className="h-3 w-20 mb-1" />
                    <Skeleton className="h-5 w-full mb-1" />
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-5/6 mb-3" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <Button size="sm" className="gap-2" disabled>
                        <ShoppingCart className="h-4 w-4" />
                        Add to Bag
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline" size="lg" disabled>
                Load More Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
