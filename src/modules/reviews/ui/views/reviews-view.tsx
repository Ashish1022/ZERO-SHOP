"use client";

import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { RefreshCw, Star, MessageSquare, CheckCircle2, Clock } from "lucide-react";

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
import { columns, ReviewColumn } from "../../lib/columns";

export const ReviewsView = () => {
  const trpc = useTRPC();

  const {
    data: reviews,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useSuspenseInfiniteQuery(
    trpc.reviews.getAll.infiniteQueryOptions(
      {},
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )
  );

  const { data: stats } = useSuspenseQuery(
    trpc.reviews.getAdminStats.queryOptions()
  );

  const rows: ReviewColumn[] = reviews.pages.flatMap((page) =>
    page.data.map((r) => ({
      id: r.id,
      productId: r.productId,
      productName: r.productName,
      productSlug: r.productSlug,
      name: r.name,
      email: r.email,
      rating: parseFloat(r.rating),
      title: r.title,
      description: r.description,
      status: r.status,
      isVerifiedPurchase: r.isVerifiedPurchase,
      helpfulCount: r.helpfulCount,
      createdAt: r.createdAt,
    }))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Reviews
          </h2>
          <p className="text-sm text-muted-foreground">
            Moderate customer reviews and product feedback
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
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All submissions</p>
          </CardContent>
        </Card>

        <Card className="border hover:border-chart-4/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Need moderation</p>
          </CardContent>
        </Card>

        <Card className="border hover:border-chart-2/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.approved || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Live on store</p>
          </CardContent>
        </Card>

        <Card className="border hover:border-chart-5/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 fill-chart-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.averageRating ? stats.averageRating.toFixed(1) : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all products</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Review Moderation</CardTitle>
          <CardDescription>
            Approve, reject, or remove customer reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={rows}
            searchKey={["title", "name"]}
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
                  "Load More Reviews"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
