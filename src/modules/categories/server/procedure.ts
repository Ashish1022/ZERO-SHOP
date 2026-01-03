import { db } from "@/db";
import { categories, media, products } from "@/db/schema/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { and, count, eq, gt, inArray, isNull, lt, or, sql } from "drizzle-orm";
import z from 'zod';

const constructMediaURL = (filename: string) => {
    if (!filename) return null;
    return `/api/media/file/${filename}`;
};

export const categoriesRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                cursor: z.object({
                    id: z.string(),
                    updatedAt: z.date()
                }).optional(),
                limit: z.number().min(1).max(50).default(10),
            })
        )
        .query(async ({ input }) => {
            const { cursor, limit } = input;

            const cursorCondition = cursor
                ? or(
                    lt(categories.updatedAt, cursor.updatedAt),
                    and(
                        eq(categories.updatedAt, cursor.updatedAt),
                        gt(categories.id, cursor.id)
                    )
                )
                : undefined;

            const categoriesData = await db
                .select({
                    id: categories.id,
                    name: categories.name,
                    slug: categories.slug,
                    description: categories.description,
                    featured: categories.featured,
                    sortOrder: categories.sortOrder,
                    thumbnailId: categories.thumbnailId,
                    parentId: categories.parentId,
                    updatedAt: categories.updatedAt,
                    thumbnailFilename: media.filename,
                    thumbnailUrl: media.url,
                })
                .from(categories)
                .leftJoin(media, eq(media.id, categories.thumbnailId))
                .where(
                    and(
                        isNull(categories.parentId),
                        isNull(categories.deletedAt),
                        cursorCondition
                    )
                )
                .orderBy(sql`${categories.updatedAt} DESC, ${categories.id} ASC`)
                .limit(limit + 1);

            const hasNextPage = categoriesData.length > limit;
            const actualCategories = hasNextPage 
                ? categoriesData.slice(0, limit) 
                : categoriesData;

            if (actualCategories.length === 0) {
                return {
                    data: [],
                    hasNextPage: false,
                    nextCursor: null,
                    totalDocs: 0,
                };
            }

            const categoryIds = actualCategories.map(c => c.id);

            const [subcategoriesData, productCounts] = await Promise.all([
                db
                    .select({
                        id: categories.id,
                        name: categories.name,
                        slug: categories.slug,
                        description: categories.description,
                        featured: categories.featured,
                        sortOrder: categories.sortOrder,
                        thumbnailId: categories.thumbnailId,
                        parentId: categories.parentId,
                        updatedAt: categories.updatedAt,
                        thumbnailFilename: media.filename,
                        thumbnailUrl: media.url,
                    })
                    .from(categories)
                    .leftJoin(media, eq(media.id, categories.thumbnailId))
                    .where(
                        and(
                            inArray(categories.parentId, categoryIds),
                            isNull(categories.deletedAt)
                        )
                    )
                    .orderBy(categories.sortOrder, categories.name),

                db
                    .select({
                        categoryId: products.categoryId,
                        count: count(products.id).as('count'),
                    })
                    .from(products)
                    .where(
                        and(
                            inArray(products.categoryId, categoryIds),
                            isNull(products.deletedAt)
                        )
                    )
                    .groupBy(products.categoryId)
            ]);

            const allCategoryIds = [
                ...categoryIds,
                ...subcategoriesData.map(s => s.id)
            ];

            const allProductCounts = await db
                .select({
                    categoryId: products.categoryId,
                    count: count(products.id).as('count'),
                })
                .from(products)
                .where(
                    and(
                        inArray(products.categoryId, allCategoryIds),
                        isNull(products.deletedAt)
                    )
                )
                .groupBy(products.categoryId);

            const productCountMap = new Map(
                allProductCounts.map(pc => [pc.categoryId, Number(pc.count)])
            );

            const subcategoriesByParent = subcategoriesData.reduce((acc, subcat) => {
                const parentId = subcat.parentId!;
                if (!acc[parentId]) {
                    acc[parentId] = [];
                }
                acc[parentId].push(subcat);
                return acc;
            }, {} as Record<string, typeof subcategoriesData>);

            const transformedData = actualCategories.map((category) => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                featured: category.featured,
                sortOrder: category.sortOrder,
                thumbnailId: category.thumbnailId,
                parentId: category.parentId,
                updatedAt: category.updatedAt,
                thumbnail: category.thumbnailFilename ? {
                    filename: category.thumbnailFilename,
                    url: constructMediaURL(category.thumbnailFilename),
                    fullUrl: category.thumbnailUrl,
                } : null,
                productCount: productCountMap.get(category.id) ?? 0,
                subcategories: (subcategoriesByParent[category.id] || []).map((subcat) => ({
                    id: subcat.id,
                    name: subcat.name,
                    slug: subcat.slug,
                    description: subcat.description,
                    featured: subcat.featured,
                    sortOrder: subcat.sortOrder,
                    thumbnailId: subcat.thumbnailId,
                    parentId: subcat.parentId,
                    updatedAt: subcat.updatedAt,
                    thumbnail: subcat.thumbnailFilename ? {
                        filename: subcat.thumbnailFilename,
                        url: constructMediaURL(subcat.thumbnailFilename),
                        fullUrl: subcat.thumbnailUrl,
                    } : null,
                    productCount: productCountMap.get(subcat.id) ?? 0,
                })),
            }));

            const nextCursor = hasNextPage && actualCategories.length > 0
                ? {
                    id: actualCategories[actualCategories.length - 1].id,
                    updatedAt: actualCategories[actualCategories.length - 1].updatedAt
                }
                : null;

            return {
                data: transformedData,
                hasNextPage,
                nextCursor,
                totalDocs: actualCategories.length,
            };
        })
});