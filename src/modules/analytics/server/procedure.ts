import { z } from "zod";
import { and, count, desc, eq, gte, isNull, sql } from "drizzle-orm";

import { db } from "@/db";
import { orders, orderItems, products, users, productImages, media } from "@/db/schema/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const analyticsRouter = createTRPCRouter({
    getOverview: baseProcedure
        .input(
            z.object({
                range: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
            })
        )
        .query(async ({ input }) => {
            const days =
                input.range === '7d' ? 7 : input.range === '30d' ? 30 : input.range === '90d' ? 90 : 365;

            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const previousStart = new Date();
            previousStart.setDate(previousStart.getDate() - days * 2);

            const current = await db
                .select({
                    revenue: sql<string>`COALESCE(SUM(${orders.total}), 0)`,
                    orderCount: count(),
                    avgOrderValue: sql<string>`COALESCE(AVG(${orders.total}), 0)`,
                })
                .from(orders)
                .where(and(
                    gte(orders.createdAt, startDate),
                    eq(orders.paymentStatus, 'completed'),
                ));

            const previous = await db
                .select({
                    revenue: sql<string>`COALESCE(SUM(${orders.total}), 0)`,
                    orderCount: count(),
                })
                .from(orders)
                .where(and(
                    gte(orders.createdAt, previousStart),
                    sql`${orders.createdAt} < ${startDate}`,
                    eq(orders.paymentStatus, 'completed'),
                ));

            const newCustomers = await db
                .select({ count: count() })
                .from(users)
                .where(and(
                    gte(users.createdAt, startDate),
                    isNull(users.deletedAt),
                    eq(users.role, 'customer'),
                ));

            const previousCustomers = await db
                .select({ count: count() })
                .from(users)
                .where(and(
                    gte(users.createdAt, previousStart),
                    sql`${users.createdAt} < ${startDate}`,
                    isNull(users.deletedAt),
                    eq(users.role, 'customer'),
                ));

            const calcGrowth = (curr: number, prev: number) =>
                prev === 0 ? (curr > 0 ? 100 : 0) : ((curr - prev) / prev) * 100;

            const currentRevenue = parseFloat(current[0].revenue);
            const previousRevenue = parseFloat(previous[0].revenue);

            return {
                revenue: currentRevenue,
                revenueGrowth: calcGrowth(currentRevenue, previousRevenue),
                orders: current[0].orderCount,
                ordersGrowth: calcGrowth(current[0].orderCount, previous[0].orderCount),
                avgOrderValue: parseFloat(current[0].avgOrderValue),
                newCustomers: newCustomers[0].count,
                customersGrowth: calcGrowth(newCustomers[0].count, previousCustomers[0].count),
            };
        }),

    getRevenueTrend: baseProcedure
        .input(
            z.object({
                range: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
            })
        )
        .query(async ({ input }) => {
            const days =
                input.range === '7d' ? 7 : input.range === '30d' ? 30 : input.range === '90d' ? 90 : 365;

            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const result = await db
                .select({
                    date: sql<string>`DATE(${orders.createdAt})`,
                    revenue: sql<string>`COALESCE(SUM(${orders.total}), 0)`,
                    orderCount: count(),
                })
                .from(orders)
                .where(and(
                    gte(orders.createdAt, startDate),
                    eq(orders.paymentStatus, 'completed'),
                ))
                .groupBy(sql`DATE(${orders.createdAt})`)
                .orderBy(sql`DATE(${orders.createdAt})`);

            return result.map((r) => ({
                date: r.date,
                revenue: parseFloat(r.revenue),
                orders: r.orderCount,
            }));
        }),

    getTopProducts: baseProcedure
        .input(z.object({ limit: z.number().min(1).max(20).default(5) }))
        .query(async ({ input }) => {
            const result = await db
                .select({
                    id: products.id,
                    name: products.name,
                    price: products.price,
                    salesCount: products.salesCount,
                    averageRating: products.averageRating,
                    imageUrl: media.url,
                    revenue: sql<string>`COALESCE(SUM(${orderItems.totalPrice}), 0)`,
                    unitsSold: sql<number>`COALESCE(SUM(${orderItems.quantity}), 0)::int`,
                })
                .from(products)
                .leftJoin(orderItems, eq(orderItems.productId, products.id))
                .leftJoin(
                    productImages,
                    and(eq(productImages.productId, products.id), eq(productImages.isPrimary, true))
                )
                .leftJoin(media, eq(productImages.imageId, media.id))
                .where(isNull(products.deletedAt))
                .groupBy(products.id, media.url)
                .orderBy(desc(sql`COALESCE(SUM(${orderItems.totalPrice}), 0)`))
                .limit(input.limit);

            return result.map((r) => ({
                id: r.id,
                name: r.name,
                price: parseFloat(r.price),
                revenue: parseFloat(r.revenue),
                unitsSold: r.unitsSold,
                averageRating: r.averageRating ? parseFloat(r.averageRating) : 0,
                imageUrl: r.imageUrl,
            }));
        }),

    getOrderStatusBreakdown: baseProcedure.query(async () => {
        const result = await db
            .select({
                status: orders.status,
                count: count(),
            })
            .from(orders)
            .groupBy(orders.status);

        return result;
    }),
});
