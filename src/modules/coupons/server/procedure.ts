import { z } from "zod";
import { and, asc, count, desc, eq, like, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { db } from "@/db";
import { coupons } from "@/db/schema/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { createCouponSchema, updateCouponSchema } from "../schema";

export const couponsRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(10),
                cursor: z.string().uuid().optional(),
                status: z.enum(['active', 'inactive', 'expired']).optional(),
                searchTerm: z.string().optional(),
                sortBy: z.enum(['createdAt', 'code', 'validUntil', 'usageCount']).default('createdAt'),
                sortOrder: z.enum(['asc', 'desc']).default('desc'),
            })
        )
        .query(async ({ input }) => {
            const { limit, cursor, status, searchTerm, sortBy, sortOrder } = input;

            const conditions = [];

            if (status) {
                conditions.push(eq(coupons.status, status));
            }

            if (searchTerm) {
                conditions.push(like(coupons.code, `%${searchTerm.toUpperCase()}%`));
            }

            if (cursor) {
                const cursorRow = await db
                    .select()
                    .from(coupons)
                    .where(eq(coupons.id, cursor))
                    .limit(1);
                if (cursorRow.length > 0) {
                    const cursorValue = cursorRow[0][sortBy];
                    if (sortOrder === 'desc') {
                        conditions.push(sql`${coupons[sortBy]} < ${cursorValue}`);
                    } else {
                        conditions.push(sql`${coupons[sortBy]} > ${cursorValue}`);
                    }
                }
            }

            const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

            const data = await db
                .select()
                .from(coupons)
                .where(whereClause)
                .orderBy(sortOrder === 'desc' ? desc(coupons[sortBy]) : asc(coupons[sortBy]))
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
                active: sql<number>`COUNT(CASE WHEN ${coupons.status} = 'active' THEN 1 END)::int`,
                expired: sql<number>`COUNT(CASE WHEN ${coupons.status} = 'expired' OR ${coupons.validUntil} < NOW() THEN 1 END)::int`,
                totalUsage: sql<number>`COALESCE(SUM(${coupons.usageCount}), 0)::int`,
            })
            .from(coupons);

        return stats[0];
    }),

    create: baseProcedure
        .input(createCouponSchema)
        .mutation(async ({ input }) => {
            const code = input.code.toUpperCase();
            const existing = await db
                .select({ id: coupons.id })
                .from(coupons)
                .where(eq(coupons.code, code))
                .limit(1);

            if (existing.length > 0) {
                throw new TRPCError({ code: "CONFLICT", message: "Coupon code already exists" });
            }

            if (new Date(input.validUntil) <= new Date(input.validFrom)) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "End date must be after start date" });
            }

            const result = await db
                .insert(coupons)
                .values({
                    code,
                    description: input.description,
                    type: input.type,
                    value: input.value.toString(),
                    minPurchaseAmount: input.minPurchaseAmount?.toString(),
                    maxDiscountAmount: input.maxDiscountAmount?.toString(),
                    usageLimit: input.usageLimit,
                    status: input.status,
                    validFrom: new Date(input.validFrom),
                    validUntil: new Date(input.validUntil),
                })
                .returning();

            return result[0];
        }),

    update: baseProcedure
        .input(updateCouponSchema)
        .mutation(async ({ input }) => {
            const { id, validFrom, validUntil, value, minPurchaseAmount, maxDiscountAmount, ...rest } = input;
            await db
                .update(coupons)
                .set({
                    ...rest,
                    ...(value !== undefined && { value: value.toString() }),
                    ...(minPurchaseAmount !== undefined && {
                        minPurchaseAmount: minPurchaseAmount?.toString() ?? null,
                    }),
                    ...(maxDiscountAmount !== undefined && {
                        maxDiscountAmount: maxDiscountAmount?.toString() ?? null,
                    }),
                    ...(validFrom && { validFrom: new Date(validFrom) }),
                    ...(validUntil && { validUntil: new Date(validUntil) }),
                    updatedAt: new Date(),
                })
                .where(eq(coupons.id, id));

            return { success: true };
        }),

    delete: baseProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ input }) => {
            await db.delete(coupons).where(eq(coupons.id, input.id));
            return { success: true };
        }),

    toggleStatus: baseProcedure
        .input(z.object({ id: z.string().uuid(), status: z.enum(['active', 'inactive', 'expired']) }))
        .mutation(async ({ input }) => {
            await db
                .update(coupons)
                .set({ status: input.status, updatedAt: new Date() })
                .where(eq(coupons.id, input.id));
            return { success: true };
        }),
});
