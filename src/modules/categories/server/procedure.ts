import { db } from "@/db";
import { categories, media, products } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq, gt, inArray, isNull, or, sql } from "drizzle-orm";
import z from "zod";
import { createCategorySchema, updateCategorySchema } from "../schema";

export const categoriesRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                cursor: z.object({
                    id: z.string(),
                    updatedAt: z.coerce.date()
                }).optional().nullable(),
                limit: z.number().min(1).max(100).default(10),
                slug: z.string().optional()
            })
        )
        .query(async ({ input }) => {
            const { slug, cursor, limit } = input;

            const whereConditions = [];

            if (cursor) {
                const cursorDate = new Date(cursor.updatedAt);
                whereConditions.push(
                    or(
                        gt(categories.updatedAt, cursorDate),
                        and(
                            eq(categories.updatedAt, cursorDate),
                            gt(categories.id, cursor.id)
                        )
                    )
                );
            }

            if (slug) {
                whereConditions.push(eq(categories.slug, slug));
            }

            whereConditions.push(isNull(categories.parentId));

            whereConditions.push(isNull(categories.deletedAt));

            const whereCondition = whereConditions.length > 0
                ? and(...whereConditions)
                : undefined;

            const categoriesData = await db
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
                .where(whereCondition)
                .orderBy(categories.sortOrder, categories.updatedAt, categories.id)
                .limit(limit + 1);

            const hasNextPage = categoriesData.length > limit;
            const actualCategories = hasNextPage
                ? categoriesData.slice(0, limit)
                : categoriesData;

            const categoryIds = actualCategories.map(c => c.id);

            const subcategoriesData = categoryIds.length > 0
                ? await db
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
                            inArray(categories.parentId, categoryIds),
                            isNull(categories.deletedAt)
                        )
                    )
                    .orderBy(categories.sortOrder, categories.name)
                : [];

            const subcategoriesByParent = subcategoriesData.reduce((acc, subcat) => {
                if (!acc[subcat.parentId!]) {
                    acc[subcat.parentId!] = [];
                }
                acc[subcat.parentId!].push(subcat);
                return acc;
            }, {} as Record<string, typeof subcategoriesData>);

            const transformedData = actualCategories.map((category) => ({
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
                subcategories: (subcategoriesByParent[category.id] || []).map((subcat) => ({
                    id: subcat.id,
                    name: subcat.name,
                    slug: subcat.slug,
                    description: subcat.description,
                    status: subcat.status,
                    featured: subcat.featured,
                    sortOrder: subcat.sortOrder,
                    parentId: subcat.parentId,
                    thumbnailId: subcat.thumbnailId,
                    seoTitle: subcat.seoTitle,
                    seoDescription: subcat.seoDescription,
                    seoKeywords: subcat.seoKeywords,
                    createdAt: subcat.createdAt,
                    updatedAt: subcat.updatedAt,
                    thumbnail: subcat.thumbnailUrl ? {
                        url: subcat.thumbnailUrl,
                        filename: subcat.thumbnailFilename,
                        alt: subcat.thumbnailAlt || subcat.name,
                    } : null,
                })),
            }));

            const nextCursor = hasNextPage && actualCategories.length > 0
                ? {
                    id: actualCategories[actualCategories.length - 1].id,
                    updatedAt: actualCategories[actualCategories.length - 1].updatedAt.toISOString()
                }
                : null;

            return {
                data: transformedData,
                hasNextPage,
                nextCursor,
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

    deleteOne: protectedProcedure
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

    updateOne: protectedProcedure
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
});