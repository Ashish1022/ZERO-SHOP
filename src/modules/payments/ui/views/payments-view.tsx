"use client";

import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock,
  RefreshCw,
  Wallet,
  XCircle,
  RotateCcw,
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
import { columns, PaymentColumn } from "../../lib/columns";

const methodLabel: Record<string, string> = {
  razorpay: "Razorpay",
  cod: "Cash on Delivery",
  upi: "UPI",
  card: "Card",
  wallet: "Wallet",
};

export const PaymentsView = () => {
  const trpc = useTRPC();

  const {
    data: payments,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useSuspenseInfiniteQuery(
    trpc.payments.getMany.infiniteQueryOptions(
      {},
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )
  );

  const { data: stats } = useSuspenseQuery(trpc.payments.getStats.queryOptions());
  const { data: methodBreakdown } = useSuspenseQuery(
    trpc.payments.getMethodBreakdown.queryOptions()
  );

  const rows: PaymentColumn[] = payments.pages.flatMap((page) =>
    page.data.map((p) => ({
      id: p.id,
      orderNumber: p.orderNumber,
      customerName: p.customer
        ? `${p.customer.firstName} ${p.customer.lastName}`
        : "Guest",
      customerEmail: p.customer?.email || "",
      total: parseFloat(p.total),
      paymentStatus: p.paymentStatus,
      paymentMethod: p.paymentMethod,
      razorpayOrderId: p.razorpayOrderId,
      razorpayPaymentId: p.razorpayPaymentId,
      createdAt: p.createdAt,
    }))
  );

  const maxMethodTotal = Math.max(...methodBreakdown.map((m) => m.total), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Payments
          </h2>
          <p className="text-sm text-muted-foreground">
            Track transactions and payment processing
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
        <Card className="border hover:border-chart-2/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
            <Wallet className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {stats.totalRevenue.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.completed} completed
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-chart-4/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {stats.pendingAmount.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.pending} awaiting payment
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-destructive/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Payment failures
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-chart-5/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunded</CardTitle>
            <RotateCcw className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {stats.refundedAmount.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.refunded} refunds issued
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Revenue breakdown by payment method
          </CardDescription>
        </CardHeader>
        <CardContent>
          {methodBreakdown.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No payment data yet
            </div>
          ) : (
            <div className="space-y-3">
              {methodBreakdown.map((m) => (
                <div key={m.method || "none"} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {m.method ? methodLabel[m.method] : "N/A"}
                    </span>
                    <span className="font-semibold">
                      ₹
                      {m.total.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                      <span className="text-muted-foreground text-xs ml-2">
                        ({m.count} txns)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${(m.total / maxMethodTotal) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            All payment transactions across orders
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
