"use client";

import { useState } from "react";
import Image from "next/image";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Package,
  RefreshCw,
  ShoppingBag,
  Users,
  TrendingUp,
} from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Range = "7d" | "30d" | "90d" | "1y";

const revenueChartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  orders: { label: "Orders", color: "var(--chart-2)" },
} satisfies ChartConfig;

const statusChartConfig = {
  count: { label: "Orders" },
  pending: { label: "Pending", color: "var(--chart-4)" },
  processing: { label: "Processing", color: "var(--chart-2)" },
  confirmed: { label: "Confirmed", color: "var(--chart-3)" },
  shipped: { label: "Shipped", color: "var(--chart-5)" },
  delivered: { label: "Delivered", color: "var(--chart-1)" },
  cancelled: { label: "Cancelled", color: "var(--destructive)" },
  refunded: { label: "Refunded", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

const Growth = ({ value }: { value: number }) => {
  const positive = value >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={`inline-flex items-center text-xs font-medium ${
        positive ? "text-chart-2" : "text-destructive"
      }`}
    >
      <Icon className="h-3 w-3" />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
};

export const AnalyticsView = () => {
  const trpc = useTRPC();
  const [range, setRange] = useState<Range>("30d");

  const { data: overview, refetch, isRefetching } = useSuspenseQuery(
    trpc.analytics.getOverview.queryOptions({ range })
  );
  const { data: trend } = useSuspenseQuery(
    trpc.analytics.getRevenueTrend.queryOptions({ range })
  );
  const { data: topProducts } = useSuspenseQuery(
    trpc.analytics.getTopProducts.queryOptions({ limit: 5 })
  );
  const { data: statusBreakdown } = useSuspenseQuery(
    trpc.analytics.getOrderStatusBreakdown.queryOptions()
  );

  const statusData = statusBreakdown.map((s) => ({
    status: s.status,
    count: s.count,
    fill: `var(--color-${s.status})`,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            Track performance and growth metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={range} onValueChange={(v) => setRange(v as Range)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
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
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {overview.revenue.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <Growth value={overview.revenueGrowth} />
              <span className="ml-1">vs previous period</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-chart-3/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.orders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Growth value={overview.ordersGrowth} />
              <span className="ml-1">vs previous period</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-chart-4/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {overview.avgOrderValue.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:border-chart-5/50 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.newCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Growth value={overview.customersGrowth} />
              <span className="ml-1">vs previous period</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-md lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>
              Daily revenue and order volume over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={revenueChartConfig}
              className="aspect-auto h-72 w-full"
            >
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }
                    />
                  }
                />
                <Area
                  dataKey="revenue"
                  type="monotone"
                  fill="url(#fillRevenue)"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Breakdown of all orders</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={statusChartConfig}
              className="mx-auto aspect-square h-64"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="count" />} />
                <Pie data={statusData} dataKey="count" nameKey="status" innerRadius={50}>
                  {statusData.map((entry) => (
                    <Cell key={entry.status} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {statusData.map((s) => (
                <div key={s.status} className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ background: s.fill }}
                  />
                  <span className="capitalize text-muted-foreground">
                    {s.status}
                  </span>
                  <span className="ml-auto font-medium">{s.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
          <CardDescription>
            Highest revenue products across all time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No sales data yet
              </div>
            ) : (
              topProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted font-bold text-sm">
                    {idx + 1}
                  </div>
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center border border-border">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.unitsSold} units sold
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-chart-2">
                      ₹
                      {product.revenue.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Revenue
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
