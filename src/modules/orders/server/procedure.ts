import z from "zod";
import { and, asc, count, desc, eq, gte, like, lte, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { addresses, orders } from "@/db/schema/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const ordersRouter = createTRPCRouter({
    getMany: baseProcedure
    .input(
        z.object({
            limit: z.number().min(1).max(100).default(10),
            cursor: z.string().uuid().optional(),
            status: z.enum([
                'pending',
                'processing',
                'confirmed',
                'shipped',
                'delivered',
                'cancelled',
                'refunded'
            ]).optional(),
            paymentStatus: z.enum([
                'pending',
                'processing',
                'completed',
                'failed',
                'refunded'
            ]).optional(),
            paymentMethod: z.enum([
                'razorpay',
                'cod',
                'upi',
                'card',
                'wallet'
            ]).optional(),
            searchTerm: z.string().optional(),
            startDate: z.string().datetime().optional(),
            endDate: z.string().datetime().optional(),
            minTotal: z.number().optional(),
            maxTotal: z.number().optional(),
            sortBy: z.enum(['createdAt', 'total', 'orderNumber']).default('createdAt'),
            sortOrder: z.enum(['asc', 'desc']).default('desc'),
        })
    )
    .query(async ({ input }) => {
        const {
            limit,
            cursor,
            status,
            paymentStatus,
            paymentMethod,
            searchTerm,
            startDate,
            endDate,
            minTotal,
            maxTotal,
            sortBy,
            sortOrder
        } = input;

        const conditions = [];
        
        if (status) {
            conditions.push(eq(orders.status, status));
        }
        
        if (paymentStatus) {
            conditions.push(eq(orders.paymentStatus, paymentStatus));
        }

        if (paymentMethod) {
            conditions.push(eq(orders.paymentMethod, paymentMethod));
        }
        
        if (searchTerm) {
            conditions.push(
                or(
                    like(orders.orderNumber, `%${searchTerm}%`),
                    like(orders.razorpayOrderId, `%${searchTerm}%`)
                )
            );
        }
        
        if (startDate) {
            conditions.push(gte(orders.createdAt, new Date(startDate)));
        }
        
        if (endDate) {
            conditions.push(lte(orders.createdAt, new Date(endDate)));
        }

        if (minTotal !== undefined) {
            conditions.push(gte(orders.total, minTotal.toString()));
        }

        if (maxTotal !== undefined) {
            conditions.push(lte(orders.total, maxTotal.toString()));
        }

        if (cursor) {
            const cursorOrder = await db
                .select()
                .from(orders)
                .where(eq(orders.id, cursor))
                .limit(1);

            if (cursorOrder.length > 0) {
                const cursorValue = cursorOrder[0][sortBy];
                if (sortOrder === 'desc') {
                    conditions.push(sql`${orders[sortBy]} < ${cursorValue}`);
                } else {
                    conditions.push(sql`${orders[sortBy]} > ${cursorValue}`);
                }
            }
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const ordersData = await db
            .select({
                id: orders.id,
                orderNumber: orders.orderNumber,
                status: orders.status,
                paymentStatus: orders.paymentStatus,
                paymentMethod: orders.paymentMethod,
                subtotal: orders.subtotal,
                discountAmount: orders.discountAmount,
                taxAmount: orders.taxAmount,
                shippingAmount: orders.shippingAmount,
                total: orders.total,
                trackingNumber: orders.trackingNumber,
                couponCode: orders.couponCode,
                razorpayOrderId: orders.razorpayOrderId,
                razorpayPaymentId: orders.razorpayPaymentId,
                customerNotes: orders.customerNotes,
                createdAt: orders.createdAt,
                updatedAt: orders.updatedAt,
                shippingAddress: {
                    firstName: addresses.firstName,
                    lastName: addresses.lastName,
                    email: addresses.email,
                    phone: addresses.phone,
                    city: addresses.city,
                    state: addresses.state,
                    country: addresses.country,
                }
            })
            .from(orders)
            .leftJoin(addresses, eq(orders.shippingAddressId, addresses.id))
            .where(whereClause)
            .orderBy(sortOrder === 'desc' ? desc(orders[sortBy]) : asc(orders[sortBy]))
            .limit(limit + 1); 

        if (!ordersData || ordersData.length === 0) {
            return {
                data: [],
                nextCursor: null,
                hasNextPage: false,
                total: 0,
            };
        }

        const totalResult = await db
            .select({ count: count() })
            .from(orders)
            .where(whereClause);
        
        const total = totalResult[0]?.count || 0;

        const hasNextPage = ordersData.length > limit;
        const data = hasNextPage ? ordersData.slice(0, -1) : ordersData;
        const nextCursor = hasNextPage ? data[data.length - 1].id : null;

        return {
            data,
            nextCursor,
            hasNextPage,
            total,
        };
    }),
})