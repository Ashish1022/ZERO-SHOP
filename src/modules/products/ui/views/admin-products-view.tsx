"use client";

import { useRouter } from "next/navigation";
import { Plus, RefreshCw, Eye, ShoppingCart, Star } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { columns, ProductColumn } from "../../lib/columns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const AdminProductsView = () => {
  const router = useRouter();
  const trpc = useTRPC();

  const {
    data: products,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useSuspenseInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions(
      {},
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      }
    )
  );

  const flattenedProducts: ProductColumn[] = products.pages.flatMap((page) =>
    page.data.map((product) => ({
      id: product.id,
      name: product.name,
      price: `$${parseFloat(product.price).toFixed(2)}`,
      status: product.status,
      badge: product.badge,
      viewCount: product.viewCount || 0,
      salesCount: product.salesCount || 0,
      rating: product.averageRating ? parseFloat(product.averageRating) : 0,
      primaryImageUrl:
        product.primaryImage?.url || product.primaryImage?.thumbnailUrl,
    }))
  );

  const totalCount = flattenedProducts.length;
  const activeCount = flattenedProducts.filter(
    (p) => p.status === "active"
  ).length;
  const featuredCount = flattenedProducts.filter((p) => p.badge).length;
  const totalViews = flattenedProducts.reduce((sum, p) => sum + p.viewCount, 0);
  const totalSales = flattenedProducts.reduce(
    (sum, p) => sum + p.salesCount,
    0
  );
  const avgRating =
    flattenedProducts.length > 0
      ? flattenedProducts.reduce((sum, p) => sum + p.rating, 0) /
        flattenedProducts.filter((p) => p.rating > 0).length
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Products
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => refetch()}
            variant="elevated"
            size="icon"
            disabled={isRefetching}
            className="shrink-0"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            onClick={() => router.push(`/admin/dashboard/products/new`)}
            variant={"elevated"}
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border hover:border-primary/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Badge variant="secondary" className="text-lg font-bold">
              {totalCount}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeCount} active
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-blue-500/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Product page views
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-green-500/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Units sold</p>
          </CardContent>
        </Card>

        <Card className="border hover:border-yellow-500/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avgRating > 0 ? avgRating.toFixed(1) : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Customer reviews
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>
            View and manage all products in your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={flattenedProducts}
            searchKey={["name"]}
          />

          {hasNextPage && (
            <div className="flex justify-center mt-6 pt-6 border-t">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
                className="min-w-[200px] hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              >
                {isFetchingNextPage ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Products"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
