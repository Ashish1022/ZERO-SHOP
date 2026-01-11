"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import {
  RefreshCw,
  ShoppingBag,
  DollarSign,
  Package,
  TrendingUp,
} from "lucide-react";
import { columns, OrderColumn } from "../../lib/columns";

export const OrdersView = () => {
  const trpc = useTRPC();

  const {
    data: orders,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useSuspenseInfiniteQuery(
    trpc.orders.getMany.infiniteQueryOptions(
      {},
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      }
    )
  );

  const flattenedOrders: OrderColumn[] = orders.pages.flatMap((page) =>
    page.data.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.shippingAddress
        ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
        : "Guest Customer",
      email: order.shippingAddress?.email || "",
      phone: order.shippingAddress?.phone || "",
      total: `₹${parseFloat(order.total).toFixed(2)}`,
      totalNumeric: parseFloat(order.total),
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
    }))
  );

  const totalCount = flattenedOrders.length;
  const totalRevenue = flattenedOrders.reduce(
    (sum, order) => sum + order.totalNumeric,
    0
  );
  const pendingCount = flattenedOrders.filter(
    (o) => o.status === "pending"
  ).length;
  const deliveredCount = flattenedOrders.filter(
    (o) => o.status === "delivered"
  ).length;
  const processingCount = flattenedOrders.filter(
    (o) => o.status === "processing" || o.status === "confirmed"
  ).length;
  const avgOrderValue = totalCount > 0 ? totalRevenue / totalCount : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Orders
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage and track all customer orders
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
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border hover:border-primary/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingCount} pending
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-green-500/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {totalRevenue.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All time earnings
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-blue-500/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Being prepared</p>
          </CardContent>
        </Card>

        <Card className="border hover:border-orange-500/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {avgOrderValue.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {deliveredCount} completed
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            View and manage all customer orders and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={flattenedOrders}
            searchKey={["orderNumber", "customerName", "email"]}
          />

          {hasNextPage && (
            <div className="flex justify-center mt-6 pt-6 border-t">
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
                  "Load More Orders"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
