import { z } from "zod";
import { and, asc, count, desc, eq, inArray, like, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { orders, addresses } from "@/db/schema/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const returnsRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(10),
                cursor: z.string().uuid().optional(),
                status: z.enum(['cancelled', 'refunded', 'all']).default('all'),
                searchTerm: z.string().optional(),
            })
        )
        .query(async ({ input }) => {
            const { limit, cursor, status, searchTerm } = input;

            const conditions = [];

            if (status === 'cancelled') {
                conditions.push(eq(orders.status, 'cancelled'));
            } else if (status === 'refunded') {
                conditions.push(eq(orders.status, 'refunded'));
            } else {
                conditions.push(inArray(orders.status, ['cancelled', 'refunded']));
            }

            if (searchTerm) {
                conditions.push(
                    or(
                        like(orders.orderNumber, `%${searchTerm}%`),
                        like(orders.razorpayPaymentId, `%${searchTerm}%`)
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
                    conditions.push(sql`${orders.createdAt} < ${cursorRow[0].createdAt}`);
                }
            }

            const whereClause = and(...conditions);

            const data = await db
                .select({
                    id: orders.id,
                    orderNumber: orders.orderNumber,
                    status: orders.status,
                    paymentStatus: orders.paymentStatus,
                    paymentMethod: orders.paymentMethod,
                    total: orders.total,
                    adminNotes: orders.adminNotes,
                    razorpayPaymentId: orders.razorpayPaymentId,
                    createdAt: orders.createdAt,
                    updatedAt: orders.updatedAt,
                    customer: {
                        firstName: addresses.firstName,
                        lastName: addresses.lastName,
                        email: addresses.email,
                        phone: addresses.phone,
                    },
                })
                .from(orders)
                .leftJoin(addresses, eq(orders.shippingAddressId, addresses.id))
                .where(whereClause)
                .orderBy(desc(orders.createdAt))
                .limit(limit + 1);

            const hasNextPage = data.length > limit;
            const rows = hasNextPage ? data.slice(0, -1) : data;
            const nextCursor = hasNextPage ? rows[rows.length - 1].id : null;

            return { data: rows, nextCursor, hasNextPage };
        }),

    getStats: baseProcedure.query(async () => {
        const stats = await db
            .select({
                cancelled: sql<number>`COUNT(CASE WHEN ${orders.status} = 'cancelled' THEN 1 END)::int`,
                refunded: sql<number>`COUNT(CASE WHEN ${orders.status} = 'refunded' THEN 1 END)::int`,
                refundedAmount: sql<string>`COALESCE(SUM(CASE WHEN ${orders.status} = 'refunded' THEN ${orders.total} END), 0)`,
                cancelledAmount: sql<string>`COALESCE(SUM(CASE WHEN ${orders.status} = 'cancelled' THEN ${orders.total} END), 0)`,
            })
            .from(orders);

        return {
            cancelled: stats[0].cancelled,
            refunded: stats[0].refunded,
            refundedAmount: parseFloat(stats[0].refundedAmount),
            cancelledAmount: parseFloat(stats[0].cancelledAmount),
        };
    }),

    approveRefund: baseProcedure
        .input(z.object({ orderId: z.string().uuid(), notes: z.string().optional() }))
        .mutation(async ({ input }) => {
            await db
                .update(orders)
                .set({
                    status: 'refunded',
                    paymentStatus: 'refunded',
                    adminNotes: input.notes,
                    updatedAt: new Date(),
                })
                .where(eq(orders.id, input.orderId));
            return { success: true };
        }),
});
