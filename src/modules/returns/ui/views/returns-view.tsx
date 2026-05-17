"use client";

import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { RefreshCw, RotateCcw, XCircle, Wallet, PackageX } from "lucide-react";

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
import { columns, ReturnColumn } from "../../lib/columns";

export const ReturnsView = () => {
  const trpc = useTRPC();

  const {
    data: returns,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useSuspenseInfiniteQuery(
    trpc.returns.getMany.infiniteQueryOptions(
      {},
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )
  );

  const { data: stats } = useSuspenseQuery(trpc.returns.getStats.queryOptions());

  const rows: ReturnColumn[] = returns.pages.flatMap((page) =>
    page.data.map((r) => ({
      id: r.id,
      orderNumber: r.orderNumber,
      customerName: r.customer
        ? `${r.customer.firstName} ${r.customer.lastName}`
        : "Guest",
      customerEmail: r.customer?.email || "",
      customerPhone: r.customer?.phone || "",
      total: parseFloat(r.total),
      status: r.status as "cancelled" | "refunded",
      paymentStatus: r.paymentStatus,
      paymentMethod: r.paymentMethod,
      adminNotes: r.adminNotes,
      razorpayPaymentId: r.razorpayPaymentId,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }))
  );

  const totalLost = stats.cancelledAmount + stats.refundedAmount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Returns & Refunds
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage cancellations and refund processing
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
        <Card className="border hover:border-chart-4/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cancelled}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ₹
              {stats.cancelledAmount.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}{" "}
              in value
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-destructive/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunded</CardTitle>
            <RotateCcw className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.refunded}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ₹
              {stats.refundedAmount.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}{" "}
              refunded
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-chart-5/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Returns
            </CardTitle>
            <PackageX className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.cancelled + stats.refunded}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Combined volume
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-primary/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lost Revenue</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {totalLost.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total impact
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Return Requests</CardTitle>
          <CardDescription>
            Review cancelled orders and process refunds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={rows}
            searchKey={["orderNumber"]}
          />
          {hasNextPage && (
            <div className="flex justify-center mt-6 pt-6 border-t border-border">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
                className="min-w-50"
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
