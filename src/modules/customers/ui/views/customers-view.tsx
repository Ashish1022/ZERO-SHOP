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
import { RefreshCw, Users, UserCheck, Phone, TrendingUp } from "lucide-react";
import { columns, CustomerColumn } from "../../lib/columns";

export const CustomersView = () => {
  const trpc = useTRPC();

  const {
    data: customers,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useSuspenseInfiniteQuery(
    trpc.customers.getMany.infiniteQueryOptions(
      {},
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      }
    )
  );

  const flattenedCustomers: CustomerColumn[] = customers.pages.flatMap((page) =>
    page.data.map((customer) => ({
      id: customer.id,
      name: `${customer.firstName} ${customer.lastName}`,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone || "",
      role: customer.role,
      emailVerified: customer.emailVerified,
      phoneVerified: customer.phoneVerified,
      orderCount: customer.orderCount || 0,
      totalSpent: parseFloat(customer.totalSpent || "0"),
      totalSpentFormatted: `₹${parseFloat(customer.totalSpent || "0").toFixed(
        2
      )}`,
      lastLoginAt: customer.lastLoginAt,
      createdAt: customer.createdAt,
    }))
  );

  const totalCount = flattenedCustomers.length;
  const verifiedEmailCount = flattenedCustomers.filter(
    (c) => c.emailVerified
  ).length;
  const verifiedPhoneCount = flattenedCustomers.filter(
    (c) => c.phoneVerified
  ).length;
  const totalRevenue = flattenedCustomers.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0
  );
  const avgCustomerValue = totalCount > 0 ? totalRevenue / totalCount : 0;
  const activeCustomers = flattenedCustomers.filter(
    (c) => c.orderCount > 0
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Customers
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your customer base and track engagement
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
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeCustomers} active
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-green-500/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Email Verified
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedEmailCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalCount > 0
                ? ((verifiedEmailCount / totalCount) * 100).toFixed(1)
                : 0}
              % verified
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-blue-500/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Phone Verified
            </CardTitle>
            <Phone className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedPhoneCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalCount > 0
                ? ((verifiedPhoneCount / totalCount) * 100).toFixed(1)
                : 0}
              % verified
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-orange-500/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg LTV</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {avgCustomerValue.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime value</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Customer Database</CardTitle>
          <CardDescription>
            View and manage all registered customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={flattenedCustomers}
            searchKey={["name", "email", "phone"]}
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
                  "Load More Customers"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
