"use client";

import { useRouter } from "next/navigation";
import { Plus, RefreshCw, FolderTree, Tag, Eye, EyeOff } from "lucide-react";

import { columns, CategoryColumn } from "../../lib/columns";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const AdminCategoriesView = () => {
  const router = useRouter();
  const trpc = useTRPC();

  const {
    data: categories,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useSuspenseInfiniteQuery(
    trpc.categories.getMany.infiniteQueryOptions(
      {},
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      }
    )
  );

  const flattenedCategories: CategoryColumn[] = categories.pages.flatMap(
    (page) =>
      page.data.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        status: category.status,
        featured: category.featured || false,
        sortOrder: category.sortOrder,
        subcategoriesCount: category.subcategories?.length || 0,
        createdAt: new Date(category.createdAt).toLocaleDateString(),
      }))
  );

  const totalCount = flattenedCategories.length;
  const activeCount = flattenedCategories.filter(
    (c) => c.status === "active"
  ).length;
  const featuredCount = flattenedCategories.filter((c) => c.featured).length;
  const totalSubcategories = flattenedCategories.reduce(
    (sum, c) => sum + c.subcategoriesCount,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Categories
          </h2>
          <p className="text-sm text-muted-foreground">
            Organize your products with categories and subcategories
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
          <Button
            onClick={() => router.push(`/admin/dashboard/categories/new`)}
            className="gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border hover:border-primary/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All parent categories
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-green-500/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Visible to customers
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-yellow-500/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Highlighted categories
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-blue-500/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subcategories</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubcategories}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total nested categories
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border">
        <CardHeader>
          <CardTitle className="text-base">Quick Overview</CardTitle>
          <CardDescription>Category distribution by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="default"
                className="bg-green-500 hover:bg-green-600"
              >
                Active
              </Badge>
              <span className="text-sm font-medium">{activeCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Draft</Badge>
              <span className="text-sm font-medium">
                {flattenedCategories.filter((c) => c.status === "draft").length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Inactive</Badge>
              <span className="text-sm font-medium">
                {
                  flattenedCategories.filter((c) => c.status === "inactive")
                    .length
                }
              </span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Badge
                variant="default"
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                Featured
              </Badge>
              <span className="text-sm font-medium">{featuredCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>
            View, search, and manage all your product categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={flattenedCategories}
            searchKey={["name", "slug"]}
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
                  "Load More Categories"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
