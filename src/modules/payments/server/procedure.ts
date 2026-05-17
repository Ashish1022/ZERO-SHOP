import { z } from "zod";
import { and, asc, count, desc, eq, gte, like, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { orders, addresses } from "@/db/schema/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const paymentsRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(10),
                cursor: z.string().uuid().optional(),
                paymentStatus: z.enum([
                    'pending',
                    'processing',
                    'completed',
                    'failed',
                    'refunded',
                ]).optional(),
                paymentMethod: z.enum(['razorpay', 'cod', 'upi', 'card', 'wallet']).optional(),
                searchTerm: z.string().optional(),
                sortBy: z.enum(['createdAt', 'total']).default('createdAt'),
                sortOrder: z.enum(['asc', 'desc']).default('desc'),
            })
        )
        .query(async ({ input }) => {
            const { limit, cursor, paymentStatus, paymentMethod, searchTerm, sortBy, sortOrder } = input;

            const conditions = [];

            if (paymentStatus) conditions.push(eq(orders.paymentStatus, paymentStatus));
            if (paymentMethod) conditions.push(eq(orders.paymentMethod, paymentMethod));
            if (searchTerm) {
                conditions.push(
                    or(
                        like(orders.orderNumber, `%${searchTerm}%`),
                        like(orders.razorpayPaymentId, `%${searchTerm}%`),
                        like(orders.razorpayOrderId, `%${searchTerm}%`)
                    )!
                );
            }

            if (cursor) {
                const cursorRow = await db
                    .select()
                    .from(orders)
                    .where(eq(orders.id, cursor))
                    .limit(1);
                if (cursorRow.length > 0) {
                    const cursorValue = cursorRow[0][sortBy];
                    if (sortOrder === 'desc') {
                        conditions.push(sql`${orders[sortBy]} < ${cursorValue}`);
                    } else {
                        conditions.push(sql`${orders[sortBy]} > ${cursorValue}`);
                    }
                }
            }

            const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

            const data = await db
                .select({
                    id: orders.id,
                    orderNumber: orders.orderNumber,
                    total: orders.total,
                    paymentStatus: orders.paymentStatus,
                    paymentMethod: orders.paymentMethod,
                    razorpayOrderId: orders.razorpayOrderId,
                    razorpayPaymentId: orders.razorpayPaymentId,
                    createdAt: orders.createdAt,
                    customer: {
                        firstName: addresses.firstName,
                        lastName: addresses.lastName,
                        email: addresses.email,
                    },
                })
                .from(orders)
                .leftJoin(addresses, eq(orders.billingAddressId, addresses.id))
                .where(whereClause)
                .orderBy(sortOrder === 'desc' ? desc(orders[sortBy]) : asc(orders[sortBy]))
                .limit(limit + 1);

            const hasNextPage = data.length > limit;
            const rows = hasNextPage ? data.slice(0, -1) : data;
            const nextCursor = hasNextPage ? rows[rows.length - 1].id : null;

            return { data: rows, nextCursor, hasNextPage };
        }),

    getStats: baseProcedure.query(async () => {
        const stats = await db
            .select({
                total: count(),
                completed: sql<number>`COUNT(CASE WHEN ${orders.paymentStatus} = 'completed' THEN 1 END)::int`,
                pending: sql<number>`COUNT(CASE WHEN ${orders.paymentStatus} IN ('pending', 'processing') THEN 1 END)::int`,
                failed: sql<number>`COUNT(CASE WHEN ${orders.paymentStatus} = 'failed' THEN 1 END)::int`,
                refunded: sql<number>`COUNT(CASE WHEN ${orders.paymentStatus} = 'refunded' THEN 1 END)::int`,
                totalRevenue: sql<string>`COALESCE(SUM(CASE WHEN ${orders.paymentStatus} = 'completed' THEN ${orders.total} END), 0)`,
                pendingAmount: sql<string>`COALESCE(SUM(CASE WHEN ${orders.paymentStatus} IN ('pending', 'processing') THEN ${orders.total} END), 0)`,
                refundedAmount: sql<string>`COALESCE(SUM(CASE WHEN ${orders.paymentStatus} = 'refunded' THEN ${orders.total} END), 0)`,
            })
            .from(orders);

        return {
            total: stats[0].total,
            completed: stats[0].completed,
            pending: stats[0].pending,
            failed: stats[0].failed,
            refunded: stats[0].refunded,
            totalRevenue: parseFloat(stats[0].totalRevenue),
            pendingAmount: parseFloat(stats[0].pendingAmount),
            refundedAmount: parseFloat(stats[0].refundedAmount),
        };
    }),

    getMethodBreakdown: baseProcedure.query(async () => {
        const result = await db
            .select({
                method: orders.paymentMethod,
                count: count(),
                total: sql<string>`COALESCE(SUM(${orders.total}), 0)`,
            })
            .from(orders)
            .where(eq(orders.paymentStatus, 'completed'))
            .groupBy(orders.paymentMethod);

        return result.map((r) => ({
            method: r.method,
            count: r.count,
            total: parseFloat(r.total),
        }));
    }),
});
