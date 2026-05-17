"use client";

import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Boxes,
  PackageX,
  RefreshCw,
  Wallet,
} from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { columns, InventoryColumn } from "../../lib/columns";

export const InventoryView = () => {
  const trpc = useTRPC();

  const {
    data: inventory,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useSuspenseInfiniteQuery(
    trpc.inventory.getMany.infiniteQueryOptions(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )
  );

  const { data: stats } = useSuspenseQuery(
    trpc.inventory.getStats.queryOptions()
  );

  const rows: InventoryColumn[] = inventory.pages.flatMap((page) =>
    page.data.map((item) => ({
      id: item.id,
      name: item.name,
      sku: item.sku,
      price: parseFloat(item.price),
      costPrice: item.costPrice ? parseFloat(item.costPrice) : null,
      quantity: item.quantity,
      lowStockThreshold: item.lowStockThreshold,
      trackQuantity: item.trackQuantity,
      allowBackorders: item.allowBackorders,
      salesCount: item.salesCount,
      status: item.status,
      categoryName: item.categoryName,
      imageUrl: item.imageUrl,
      stockValue: item.quantity * parseFloat(item.price),
    }))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Inventory
          </h2>
          <p className="text-sm text-muted-foreground">
            Monitor stock levels and product availability
          </p>
        </div>
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border hover:border-primary/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Boxes className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalStock?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {stats?.totalProducts || 0} products
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-destructive/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <PackageX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.outOfStock || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Need restocking
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-chart-4/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.lowStock || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Below threshold
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-chart-2/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Value
            </CardTitle>
            <Wallet className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {parseFloat(stats?.inventoryValue || "0").toLocaleString(
                "en-IN",
                { maximumFractionDigits: 0 }
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total worth</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Stock Overview</CardTitle>
          <CardDescription>
            Track and manage product inventory levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={rows}
            searchKey={["name", "sku"]}
          />
          {hasNextPage && (
            <div className="flex justify-center mt-6 pt-6 border-t border-border">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
                className="min-w-50 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              >
                {isFetchingNextPage ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
