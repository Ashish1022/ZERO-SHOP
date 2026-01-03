import { db } from "@/db";
import { categories, media, productImages, products } from "@/db/schema/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, gt, inArray, isNull, ne, or, sql } from "drizzle-orm";
import z from "zod";

export const productsRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(
            z.object({
                productId: z.string().optional(),
                slug: z.string().optional(),
            }).refine(
                (data) => data.productId || data.slug,
                {
                    message: "Either productId or slug must be provided",
                }
            )
        )
        .query(async ({ input }) => {
            const { productId, slug } = input;

            const result = await db
                .select({
                    id: products.id,
                    name: products.name,
                    slug: products.slug,
                    description: products.description,
                    price: products.price,
                    compareAtPrice: products.compareAtPrice,
                    costPrice: products.costPrice,
                    taxable: products.taxable,
                    quantity: products.quantity,
                    lowStockThreshold: products.lowStockThreshold,
                    allowBackorders: products.allowBackorders,
                    shippingCost: products.shippingCost,
                    categoryId: products.categoryId,
                    seoTitle: products.seoTitle,
                    seoDescription: products.seoDescription,
                    status: products.status,
                    featured: products.featured,
                    badge: products.badge,
                    refundPolicy: products.refundPolicy,
                    viewCount: products.viewCount,

                    categoryName: categories.name,
                    categorySlug: categories.slug,

                    imageId: productImages.imageId,
                    isPrimary: productImages.isPrimary,
                    sortOrder: productImages.sortOrder,
                    imageUrl: media.url,
                    imageAlt: media.alt,
                })
                .from(products)
                .leftJoin(
                    categories,
                    eq(products.categoryId, categories.id)
                )
                .leftJoin(
                    productImages,
                    eq(productImages.productId, products.id)
                )
                .leftJoin(
                    media,
                    eq(productImages.imageId, media.id)
                )
                .where(
                    and(
                        isNull(products.deletedAt),
                        productId
                            ? eq(products.id, productId)
                            : eq(products.slug, slug!)
                    )
                );

            if (!result || result.length === 0) {
                throw new TRPCError({
                    message: "Product not found",
                    code: "NOT_FOUND"
                });
            }

            const firstRow = result[0];
            const productData = {
                id: firstRow.id,
                name: firstRow.name,
                slug: firstRow.slug,
                description: firstRow.description,
                price: firstRow.price,
                compareAtPrice: firstRow.compareAtPrice,
                costPrice: firstRow.costPrice,
                taxable: firstRow.taxable,
                quantity: firstRow.quantity,
                lowStockThreshold: firstRow.lowStockThreshold,
                allowBackorders: firstRow.allowBackorders,
                shippingCost: firstRow.shippingCost,
                categoryId: firstRow.categoryId,
                seoTitle: firstRow.seoTitle,
                seoDescription: firstRow.seoDescription,
                status: firstRow.status,
                featured: firstRow.featured,
                badge: firstRow.badge,
                refundPolicy: firstRow.refundPolicy,
                viewCount: firstRow.viewCount,
            };

            const category = firstRow.categoryId ? {
                id: firstRow.categoryId,
                name: firstRow.categoryName,
                slug: firstRow.categorySlug,
            } : null;

            const images = result
                .filter(row => row.imageId !== null)
                .map(row => ({
                    imageId: row.imageId!,
                    isPrimary: row.isPrimary!,
                    sortOrder: row.sortOrder!,
                    productId: productData.id,
                    url: row.imageUrl!,
                    alt: row.imageAlt!,
                }))
                .sort((a, b) => a.sortOrder - b.sortOrder);

            db.update(products)
                .set({
                    viewCount: sql`${products.viewCount} + 1`,
                })
                .where(eq(products.id, productData.id))
                .catch(err => {
                    console.error('Failed to update view count:', err);
                });

            return {
                ...productData,
                category,
                images,
            };
        }),
    getRelated: baseProcedure
        .input(
            z.object({
                productId: z.string(),
                categoryId: z.string(),
                limit: z.number().min(1).max(12).default(4),
            })
        )
        .query(async ({ input }) => {
            const { productId, categoryId, limit } = input;

            const result = await db
                .select({
                    id: products.id,
                    name: products.name,
                    slug: products.slug,
                    price: products.price,
                    compareAtPrice: products.compareAtPrice,
                    badge: products.badge,
                    averageRating: products.averageRating,
                    reviewCount: products.reviewCount,
                    categoryId: products.categoryId,
                    categoryName: categories.name,

                    imageId: productImages.imageId,
                    imageUrl: media.url,
                    thumbnailUrl: media.thumbnailUrl,
                    imageAlt: media.alt,
                })
                .from(products)
                .leftJoin(categories, eq(products.categoryId, categories.id))
                .leftJoin(
                    productImages,
                    and(
                        eq(productImages.productId, products.id),
                        eq(productImages.isPrimary, true)
                    )
                )
                .leftJoin(media, eq(productImages.imageId, media.id))
                .where(
                    and(
                        eq(products.categoryId, categoryId),
                        ne(products.id, productId),
                        eq(products.status, 'active'),
                        isNull(products.deletedAt)
                    )
                )
                .orderBy(desc(products.featured), desc(products.salesCount))
                .limit(limit);

            if (result.length < limit) {
                const additionalProducts = await db
                    .select({
                        id: products.id,
                        name: products.name,
                        slug: products.slug,
                        price: products.price,
                        compareAtPrice: products.compareAtPrice,
                        badge: products.badge,
                        averageRating: products.averageRating,
                        reviewCount: products.reviewCount,
                        categoryId: products.categoryId,
                        categoryName: categories.name,

                        imageId: productImages.imageId,
                        imageUrl: media.url,
                        thumbnailUrl: media.thumbnailUrl,
                        imageAlt: media.alt,
                    })
                    .from(products)
                    .leftJoin(categories, eq(products.categoryId, categories.id))
                    .leftJoin(
                        productImages,
                        and(
                            eq(productImages.productId, products.id),
                            eq(productImages.isPrimary, true)
                        )
                    )
                    .leftJoin(media, eq(productImages.imageId, media.id))
                    .where(
                        and(
                            ne(products.categoryId, categoryId),
                            ne(products.id, productId),
                            eq(products.status, 'active'),
                            isNull(products.deletedAt)
                        )
                    )
                    .orderBy(desc(products.featured), desc(products.salesCount))
                    .limit(limit - result.length);

                result.push(...additionalProducts);
            }

            return result.map(product => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                badge: product.badge,
                averageRating: product.averageRating
                    ? parseFloat(product.averageRating)
                    : 0,
                reviewCount: product.reviewCount,
                category: {
                    id: product.categoryId,
                    name: product.categoryName,
                },
                image: product.imageUrl
                    ? {
                        id: product.imageId,
                        url: product.imageUrl,
                        thumbnailUrl: product.thumbnailUrl,
                        alt: product.imageAlt || product.name,
                    }
                    : null,
            }));
        }),
    getMany: baseProcedure
        .input(
            z.object({
                cursor: z.object({
                    id: z.string(),
                    updatedAt: z.coerce.date(),
                }).optional().nullable(),
                limit: z.number().min(1).max(100).default(12),
                q: z.string().optional(),
                categorySlug: z.string().optional(),
                categorySlugs: z.array(z.string()).optional(),  
                sort: z.enum(['featured', 'low_to_high', 'high_to_low', 'newest']).optional().default('newest'),
                status: z.enum(['draft', 'active', 'archived']).optional(),
                featured: z.boolean().optional(),
            }),
        )
        .query(async ({ input }) => {
            try {
                const { cursor, limit, q, categorySlug, categorySlugs, sort, status, featured } = input;

                const whereConditions = [];

                whereConditions.push(isNull(products.deletedAt));

                if (q && q.trim() !== '') {
                    const searchTerm = `%${q.trim().toLowerCase()}%`;
                    whereConditions.push(
                        or(
                            sql`LOWER(${products.name}) LIKE ${searchTerm}`,
                            sql`LOWER(${products.description}) LIKE ${searchTerm}`,
                            sql`LOWER(${products.shortDescription}) LIKE ${searchTerm}`,
                            sql`LOWER(${products.sku}) LIKE ${searchTerm}`
                        )
                    );
                }

                const slugsToFilter = categorySlugs && categorySlugs.length > 0
                    ? categorySlugs
                    : categorySlug
                        ? [categorySlug]
                        : [];

                if (slugsToFilter.length > 0) {
                    const categoryRecords = await db
                        .select({ id: categories.id })
                        .from(categories)
                        .where(
                            and(
                                inArray(categories.slug, slugsToFilter),
                                isNull(categories.deletedAt)
                            )
                        );

                    if (categoryRecords.length > 0) {
                        const categoryIds = categoryRecords.map(c => c.id);
                        whereConditions.push(inArray(products.categoryId, categoryIds));
                    }
                }

                if (status) {
                    whereConditions.push(eq(products.status, status));
                }

                if (featured !== undefined) {
                    whereConditions.push(eq(products.featured, featured));
                }

                let orderByClause;
                switch (sort) {
                    case 'featured':
                        orderByClause = [desc(products.featured), desc(products.createdAt), asc(products.id)];
                        break;
                    case 'low_to_high':
                        orderByClause = [asc(products.price), asc(products.id)];
                        break;
                    case 'high_to_low':
                        orderByClause = [desc(products.price), asc(products.id)];
                        break;
                    case 'newest':
                    default:
                        orderByClause = [desc(products.createdAt), asc(products.id)];
                        break;
                }

                if (cursor) {
                    const cursorDate = new Date(cursor.updatedAt);
                    whereConditions.push(
                        or(
                            gt(products.updatedAt, cursorDate),
                            and(
                                eq(products.updatedAt, cursorDate),
                                gt(products.id, cursor.id)
                            )
                        )
                    );
                }

                const whereCondition = whereConditions.length > 0
                    ? and(...whereConditions)
                    : undefined;

                const productsList = await db
                    .select({
                        id: products.id,
                        name: products.name,
                        slug: products.slug,
                        description: products.description,
                        shortDescription: products.shortDescription,
                        price: products.price,
                        compareAtPrice: products.compareAtPrice,
                        costPrice: products.costPrice,
                        taxable: products.taxable,
                        trackQuantity: products.trackQuantity,
                        quantity: products.quantity,
                        lowStockThreshold: products.lowStockThreshold,
                        allowBackorders: products.allowBackorders,
                        sku: products.sku,
                        requiresShipping: products.requiresShipping,
                        freeShipping: products.freeShipping,
                        shippingCost: products.shippingCost,
                        weight: products.weight,
                        categoryId: products.categoryId,
                        categoryName: categories.name,
                        categorySlug: categories.slug,
                        seoTitle: products.seoTitle,
                        seoDescription: products.seoDescription,
                        status: products.status,
                        featured: products.featured,
                        badge: products.badge,
                        refundPolicy: products.refundPolicy,
                        viewCount: products.viewCount,
                        salesCount: products.salesCount,
                        averageRating: products.averageRating,
                        reviewCount: products.reviewCount,
                        deletedAt: products.deletedAt,
                        createdAt: products.createdAt,
                        updatedAt: products.updatedAt,
                    })
                    .from(products)
                    .leftJoin(categories, eq(products.categoryId, categories.id))
                    .where(whereCondition)
                    .orderBy(...orderByClause)
                    .limit(limit + 1);

                if (!productsList || productsList.length === 0) {
                    return {
                        data: [],
                        nextCursor: null,
                        hasNextPage: false,
                    };
                }

                const hasNextPage = productsList.length > limit;
                const resultItems = hasNextPage
                    ? productsList.slice(0, limit)
                    : productsList;

                let nextCursor = null;
                if (hasNextPage && resultItems.length > 0) {
                    const lastItem = resultItems[resultItems.length - 1];
                    nextCursor = {
                        id: lastItem.id,
                        updatedAt: lastItem.updatedAt.toISOString()
                    };
                }

                const productIds = resultItems.map(p => p.id);

                const images = productIds.length > 0
                    ? await db
                        .select({
                            imageId: productImages.imageId,
                            isPrimary: productImages.isPrimary,
                            sortOrder: productImages.sortOrder,
                            productId: productImages.productId,
                            url: media.url,
                            thumbnailUrl: media.thumbnailUrl,
                            alt: media.alt,
                            filename: media.filename,
                        })
                        .from(productImages)
                        .innerJoin(media, eq(productImages.imageId, media.id))
                        .where(inArray(productImages.productId, productIds))
                        .orderBy(asc(productImages.sortOrder))
                    : [];

                const imagesByProductId = images.reduce((acc, image) => {
                    if (!acc[image.productId]) {
                        acc[image.productId] = [];
                    }
                    acc[image.productId].push(image);
                    return acc;
                }, {} as Record<string, typeof images>);

                const data = resultItems.map(item => {
                    const productImages = imagesByProductId[item.id] || [];
                    const primaryImage = productImages.find(img => img.isPrimary) || productImages[0];

                    return {
                        ...item,
                        category: item.categoryName ? {
                            id: item.categoryId,
                            name: item.categoryName,
                            slug: item.categorySlug,
                        } : null,
                        images: productImages,
                        primaryImage: primaryImage || null,
                        reviewRating: item.averageRating ? parseFloat(item.averageRating) : 0,
                        inStock: item.trackQuantity
                            ? (item.quantity || 0) > 0 || item.allowBackorders
                            : true,
                        isLowStock: item.trackQuantity && item.lowStockThreshold
                            ? (item.quantity || 0) <= item.lowStockThreshold
                            : false,
                        categoryName: undefined,
                        categorySlug: undefined,
                    };
                });

                return {
                    data,
                    nextCursor,
                    hasNextPage,
                };
            } catch (error) {
                console.error('Failed to fetch products:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to fetch products',
                    cause: error,
                });
            }
        }),
})