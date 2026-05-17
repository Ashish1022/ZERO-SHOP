"use client";

import { useMemo, useState } from "react";
import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Plus, RefreshCw, Tag, TrendingUp, CheckCircle2, Clock } from "lucide-react";

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
import { CouponColumn, createColumns } from "../../lib/columns";
import { CouponForm } from "../components/coupon-form";

export const CouponsView = () => {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CouponColumn | null>(null);

  const {
    data: coupons,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useSuspenseInfiniteQuery(
    trpc.coupons.getMany.infiniteQueryOptions(
      {},
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )
  );

  const { data: stats } = useSuspenseQuery(trpc.coupons.getStats.queryOptions());

  const rows: CouponColumn[] = coupons.pages.flatMap((page) =>
    page.data.map((c) => ({
      id: c.id,
      code: c.code,
      description: c.description,
      type: c.type,
      value: parseFloat(c.value),
      minPurchaseAmount: c.minPurchaseAmount ? parseFloat(c.minPurchaseAmount) : null,
      maxDiscountAmount: c.maxDiscountAmount ? parseFloat(c.maxDiscountAmount) : null,
      usageLimit: c.usageLimit,
      usageCount: c.usageCount,
      status: c.status,
      validFrom: c.validFrom,
      validUntil: c.validUntil,
      createdAt: c.createdAt,
    }))
  );

  const handleEdit = (coupon: CouponColumn) => {
    setEditing(coupon);
    setOpen(true);
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) setEditing(null);
  };

  const columns = useMemo(() => createColumns(handleEdit), []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Coupons & Discounts
          </h2>
          <p className="text-sm text-muted-foreground">
            Create and manage promotional discount codes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="icon"
            disabled={isRefetching}
            className="shrink-0"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
          </Button>
          <Button onClick={() => setOpen(true)} variant="elevated">
            <Plus className="h-4 w-4" />
            New Coupon
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border hover:border-primary/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Tag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All discounts</p>
          </CardContent>
        </Card>

        <Card className="border hover:border-chart-2/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently live</p>
          </CardContent>
        </Card>

        <Card className="border hover:border-destructive/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Clock className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.expired || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Past validity</p>
          </CardContent>
        </Card>

        <Card className="border hover:border-chart-4/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.totalUsage || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Times redeemed</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Coupon Management</CardTitle>
          <CardDescription>
            View, create, and manage all your promotional codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} searchKey={["code"]} />
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

      <CouponForm
        open={open}
        onOpenChange={handleOpenChange}
        initialData={editing}
      />
    </div>
  );
};
