import z from 'zod';
import { and, count, eq, gt, inArray, isNull, lt, or, sql } from "drizzle-orm";

import { createCategorySchema } from "../schema";

import { db } from "@/db";
import { categories, media, products } from "@/db/schema/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

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
                    status: categories.status,
                    createdAt: categories.createdAt,
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
                        status: categories.status,
                        createdAt: categories.createdAt,
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
                status: category.status,
                createdAt: category.createdAt,
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
                    status: subcat.status,
                    createdAt: subcat.createdAt,
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
        }),
    getOne: baseProcedure
        .input(
            z.object({
                categoryId: z.string(),
            })
        )
        .query(async ({ input }) => {
            const { categoryId } = input;

            const categoryResult = await db
                .select({
                    id: categories.id,
                    name: categories.name,
                    slug: categories.slug,
                    description: categories.description,
                    status: categories.status,
                    featured: categories.featured,
                    sortOrder: categories.sortOrder,
                    parentId: categories.parentId,
                    thumbnailId: categories.thumbnailId,
                    seoTitle: categories.seoTitle,
                    seoDescription: categories.seoDescription,
                    seoKeywords: categories.seoKeywords,
                    deletedAt: categories.deletedAt,
                    createdAt: categories.createdAt,
                    updatedAt: categories.updatedAt,
                    thumbnailUrl: media.url,
                    thumbnailFilename: media.filename,
                    thumbnailAlt: media.alt,
                })
                .from(categories)
                .leftJoin(media, eq(media.id, categories.thumbnailId))
                .where(
                    and(
                        eq(categories.id, categoryId),
                        isNull(categories.deletedAt)
                    )
                )
                .limit(1);

            if (!categoryResult || categoryResult.length === 0) {
                throw new Error("Category not found");
            }

            const category = categoryResult[0];

            return {
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                status: category.status,
                featured: category.featured,
                sortOrder: category.sortOrder,
                parentId: category.parentId,
                thumbnailId: category.thumbnailId,
                seoTitle: category.seoTitle,
                seoDescription: category.seoDescription,
                seoKeywords: category.seoKeywords,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt,
                thumbnail: category.thumbnailUrl ? {
                    url: category.thumbnailUrl,
                    filename: category.thumbnailFilename,
                    alt: category.thumbnailAlt || category.name,
                } : null,
            };
        }),
    createOne: baseProcedure
        .input(createCategorySchema)
        .mutation(async ({ input }) => {
            let thumbnailId = input.thumbnailId;

            if (thumbnailId && thumbnailId.startsWith('http')) {
                const urlParts = thumbnailId.split('/');
                const filenameWithExt = urlParts[urlParts.length - 1];
                const filename = filenameWithExt.split('.')[0];

                const ext = filenameWithExt.split('.').pop()?.toLowerCase();
                const mimeTypeMap: Record<string, string> = {
                    'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg',
                    'png': 'image/png',
                    'gif': 'image/gif',
                    'webp': 'image/webp',
                    'svg': 'image/svg+xml'
                };
                const mimeType = ext ? mimeTypeMap[ext] || 'image/jpeg' : 'image/jpeg';

                const [mediaRecord] = await db
                    .insert(media)
                    .values({
                        filename: filename,
                        url: thumbnailId,
                        mimeType: mimeType,
                        alt: input.name || 'Category image',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .returning();

                thumbnailId = mediaRecord.id;
            }

            const [category] = await db
                .insert(categories)
                .values({
                    name: input.name,
                    slug: input.slug,
                    description: input.description || null,
                    status: input.status || 'active',
                    featured: input.featured || false,
                    sortOrder: input.sortOrder || 0,
                    parentId: input.parentId || null,
                    thumbnailId: thumbnailId || null,
                    seoTitle: input.seoTitle || null,
                    seoDescription: input.seoDescription || null,
                    seoKeywords: input.seoKeywords || null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning();

            return {
                success: true,
                category,
            };
        }),
    updateOne: baseProcedure
        .input(
            z.object({
                categoryId: z.string(),
            }).merge(createCategorySchema)
        )
        .mutation(async ({ input }) => {
            const { categoryId, ...data } = input;

            const existingCategory = await db
                .select({
                    id: categories.id,
                    deletedAt: categories.deletedAt
                })
                .from(categories)
                .where(eq(categories.id, categoryId))
                .limit(1);

            if (!existingCategory || existingCategory.length === 0) {
                throw new Error("Category not found");
            }

            if (existingCategory[0].deletedAt) {
                throw new Error("Cannot update a deleted category");
            }

            let thumbnailId = data.thumbnailId;

            if (thumbnailId && thumbnailId.startsWith('http')) {
                const urlParts = thumbnailId.split('/');
                const filenameWithExt = urlParts[urlParts.length - 1];
                const filename = filenameWithExt.split('.')[0];

                const ext = filenameWithExt.split('.').pop()?.toLowerCase();
                const mimeTypeMap: Record<string, string> = {
                    'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg',
                    'png': 'image/png',
                    'gif': 'image/gif',
                    'webp': 'image/webp',
                    'svg': 'image/svg+xml'
                };
                const mimeType = ext ? mimeTypeMap[ext] || 'image/jpeg' : 'image/jpeg';

                const [mediaRecord] = await db
                    .insert(media)
                    .values({
                        filename: filename,
                        url: thumbnailId,
                        mimeType: mimeType,
                        alt: data.name || 'Category image',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .returning();

                thumbnailId = mediaRecord.id;
            }

            const [category] = await db
                .update(categories)
                .set({
                    name: data.name,
                    slug: data.slug,
                    description: data.description || null,
                    status: data.status || 'active',
                    featured: data.featured || false,
                    sortOrder: data.sortOrder || 0,
                    parentId: data.parentId || null,
                    thumbnailId: thumbnailId || null,
                    seoTitle: data.seoTitle || null,
                    seoDescription: data.seoDescription || null,
                    seoKeywords: data.seoKeywords || null,
                    updatedAt: new Date(),
                })
                .where(eq(categories.id, categoryId))
                .returning();

            return {
                success: true,
                category,
            };
        }),
    deleteOne: baseProcedure
        .input(
            z.object({
                categoryId: z.string()
            })
        )
        .mutation(async ({ input }) => {
            const { categoryId } = input;

            const categoryResult = await db
                .select({
                    id: categories.id,
                    deletedAt: categories.deletedAt
                })
                .from(categories)
                .where(eq(categories.id, categoryId))
                .limit(1);

            if (!categoryResult || categoryResult.length === 0) {
                throw new Error("Category not found");
            }

            if (categoryResult[0].deletedAt) {
                throw new Error("Category is already deleted");
            }

            const productsCount = await db
                .select({ count: sql<number>`count(*)::int` })
                .from(products)
                .where(
                    and(
                        eq(products.categoryId, categoryId),
                        isNull(products.deletedAt)
                    )
                );

            if (productsCount[0]?.count > 0) {
                throw new Error(
                    `Cannot delete category with ${productsCount[0].count} active products. Please move or delete products first.`
                );
            }

            const subcategoriesCount = await db
                .select({ count: sql<number>`count(*)::int` })
                .from(categories)
                .where(
                    and(
                        eq(categories.parentId, categoryId),
                        isNull(categories.deletedAt)
                    )
                );

            if (subcategoriesCount[0]?.count > 0) {
                throw new Error(
                    `Cannot delete category with ${subcategoriesCount[0].count} subcategories. Please delete subcategories first.`
                );
            }

            await db
                .update(categories)
                .set({
                    deletedAt: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(categories.id, categoryId));

            return {
                success: true,
                categoryId,
            };
        }),
});