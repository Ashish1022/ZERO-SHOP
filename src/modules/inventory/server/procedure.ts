import { z } from "zod";
import { and, asc, count, desc, eq, gte, lte, like, or, sql, isNull } from "drizzle-orm";

import { db } from "@/db";
import { products, categories, media, productImages } from "@/db/schema/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const inventoryRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(10),
                cursor: z.string().uuid().optional(),
                stockStatus: z.enum(['in-stock', 'low-stock', 'out-of-stock', 'all']).default('all'),
                searchTerm: z.string().optional(),
                sortBy: z.enum(['quantity', 'name', 'salesCount', 'createdAt']).default('quantity'),
                sortOrder: z.enum(['asc', 'desc']).default('asc'),
            })
        )
        .query(async ({ input }) => {
            const { limit, cursor, stockStatus, searchTerm, sortBy, sortOrder } = input;

            const conditions = [isNull(products.deletedAt)];

            if (stockStatus === 'out-of-stock') {
                conditions.push(eq(products.quantity, 0));
            } else if (stockStatus === 'low-stock') {
                conditions.push(sql`${products.quantity} > 0 AND ${products.quantity} <= ${products.lowStockThreshold}`);
            } else if (stockStatus === 'in-stock') {
                conditions.push(sql`${products.quantity} > ${products.lowStockThreshold}`);
            }

            if (searchTerm) {
                conditions.push(
                    or(
                        like(products.name, `%${searchTerm}%`),
                        like(products.sku, `%${searchTerm}%`)
                    )!
                );
            }

            if (cursor) {
                const cursorRow = await db
                    .select()
                    .from(products)
                    .where(eq(products.id, cursor))
                    .limit(1);

                if (cursorRow.length > 0) {
                    const cursorValue = cursorRow[0][sortBy];
                    if (sortOrder === 'desc') {
                        conditions.push(sql`${products[sortBy]} < ${cursorValue}`);
                    } else {
                        conditions.push(sql`${products[sortBy]} > ${cursorValue}`);
                    }
                }
            }

            const whereClause = and(...conditions);

            const data = await db
                .select({
                    id: products.id,
                    name: products.name,
                    sku: products.sku,
                    price: products.price,
                    costPrice: products.costPrice,
                    quantity: products.quantity,
                    lowStockThreshold: products.lowStockThreshold,
                    trackQuantity: products.trackQuantity,
                    allowBackorders: products.allowBackorders,
                    salesCount: products.salesCount,
                    status: products.status,
                    createdAt: products.createdAt,
                    categoryName: categories.name,
                    imageUrl: media.url,
                })
                .from(products)
                .leftJoin(categories, eq(products.categoryId, categories.id))
                .leftJoin(
                    productImages,
                    and(eq(productImages.productId, products.id), eq(productImages.isPrimary, true))
                )
                .leftJoin(media, eq(productImages.imageId, media.id))
                .where(whereClause)
                .orderBy(sortOrder === 'desc' ? desc(products[sortBy]) : asc(products[sortBy]))
                .limit(limit + 1);

            const hasNextPage = data.length > limit;
            const rows = hasNextPage ? data.slice(0, -1) : data;
            const nextCursor = hasNextPage ? rows[rows.length - 1].id : null;

            return {
                data: rows,
                nextCursor,
                hasNextPage,
            };
        }),

    getStats: baseProcedure.query(async () => {
        const stats = await db
            .select({
                totalProducts: count(),
                totalStock: sql<number>`COALESCE(SUM(${products.quantity}), 0)::int`,
                outOfStock: sql<number>`COUNT(CASE WHEN ${products.quantity} = 0 THEN 1 END)::int`,
                lowStock: sql<number>`COUNT(CASE WHEN ${products.quantity} > 0 AND ${products.quantity} <= ${products.lowStockThreshold} THEN 1 END)::int`,
                inventoryValue: sql<string>`COALESCE(SUM(${products.quantity} * ${products.price}), 0)`,
            })
            .from(products)
            .where(isNull(products.deletedAt));

        return stats[0];
    }),

    updateStock: baseProcedure
        .input(
            z.object({
                productId: z.string().uuid(),
                quantity: z.number().int().min(0),
            })
        )
        .mutation(async ({ input }) => {
            await db
                .update(products)
                .set({ quantity: input.quantity, updatedAt: new Date() })
                .where(eq(products.id, input.productId));

            return { success: true };
        }),
});
