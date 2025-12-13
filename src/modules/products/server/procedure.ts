import { db } from "@/db";
import { categories, media, productImages, products } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq, gt, inArray, isNull, or, sql } from "drizzle-orm";
import z from "zod";
import { createProductSchema } from "../schema";
import type { inferRouterOutputs } from '@trpc/server';

export const productsRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                cursor: z.object({
                    id: z.string(),
                    updatedAt: z.coerce.date(),
                }).optional().nullable(),
                limit: z.number().min(1).max(100).default(12),
                q: z.string().optional(),
                categoryId: z.string().optional(),
                categorySlug: z.string().optional(),
                status: z.enum(['draft', 'active', 'archived']).optional(),
                featured: z.boolean().optional(),
            }),
        )
        .query(async ({ input }) => {
            try {
                const { cursor, limit, q, categoryId, categorySlug, status, featured } = input;

                const whereConditions = [];

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

                whereConditions.push(isNull(products.deletedAt));

                if (q && q.trim() !== '') {
                    const searchTerm = `%${q.trim()}%`;
                    whereConditions.push(
                        or(
                            sql`LOWER(${products.name}) LIKE LOWER(${searchTerm})`,
                            sql`LOWER(${products.description}) LIKE LOWER(${searchTerm})`,
                            sql`LOWER(${products.shortDescription}) LIKE LOWER(${searchTerm})`,
                            sql`LOWER(${products.sku}) LIKE LOWER(${searchTerm})`
                        )
                    );
                }

                if (categorySlug) {
                    const category = await db
                        .select({ id: categories.id })
                        .from(categories)
                        .where(eq(categories.slug, categorySlug))
                        .limit(1);

                    if (category[0]) {
                        whereConditions.push(eq(products.categoryId, category[0].id));
                    }
                } else if (categoryId) {
                    whereConditions.push(eq(products.categoryId, categoryId));
                }

                if (status) {
                    whereConditions.push(eq(products.status, status));
                }

                if (featured !== undefined) {
                    whereConditions.push(eq(products.featured, featured));
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
                    .where(whereCondition)
                    .orderBy(products.updatedAt, products.id)
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

                const images = await db
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
                    .orderBy(productImages.sortOrder);

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
                        images: productImages,
                        primaryImage: primaryImage || null,
                        reviewRating: item.averageRating ? parseFloat(item.averageRating) : 0,
                    };
                });

                return {
                    data,
                    nextCursor,
                    hasNextPage,
                };
            } catch (error) {
                console.log(error)
                throw new Error('Failed to fetch products');
            }
        }),

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

            const whereConditions = [
                isNull(products.deletedAt)
            ];

            if (productId) {
                whereConditions.push(eq(products.id, productId));
            } else {
                whereConditions.push(eq(products.slug, slug!));
            }

            const product = await db
                .select({
                    id: products.id,
                    name: products.name,
                    slug: products.slug,
                    description: products.description,
                    shortDescription: products.shortDescription,
                    content: products.content,
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
                    createdAt: products.createdAt,
                    updatedAt: products.updatedAt,
                    deletedAt: products.deletedAt
                })
                .from(products)
                .where(and(...whereConditions))
                .limit(1);

            if (!product || product.length === 0) {
                throw new Error("Product not found");
            }

            const productData = product[0];

            const images = await db
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
                .where(eq(productImages.productId, productData.id))
                .orderBy(productImages.sortOrder);

            const primaryImage = images.find(img => img.isPrimary) || images[0];

            await db
                .update(products)
                .set({
                    viewCount: sql`${products.viewCount} + 1`,
                    updatedAt: products.updatedAt,
                })
                .where(eq(products.id, productData.id));

            return {
                ...productData,
                images,
                primaryImage: primaryImage || null,
                reviewRating: productData.averageRating ? parseFloat(productData.averageRating) : 0,
            };
        }),

    createOne: baseProcedure
        .input(createProductSchema)
        .mutation(async ({ input }) => {
            const { images: productImagesList, ...productData } = input;

            const cleanedProductData = {
                ...productData,
                price: typeof productData.price === 'number' ? productData.price.toString() : productData.price,
                compareAtPrice: productData.compareAtPrice
                    ? (typeof productData.compareAtPrice === 'number' ? productData.compareAtPrice.toString() : productData.compareAtPrice)
                    : null,
                costPrice: productData.costPrice
                    ? (typeof productData.costPrice === 'number' ? productData.costPrice.toString() : productData.costPrice)
                    : null,
                shippingCost: productData.shippingCost
                    ? (typeof productData.shippingCost === 'number' ? productData.shippingCost.toString() : productData.shippingCost)
                    : null,
                weight: productData.weight
                    ? (typeof productData.weight === 'number' ? productData.weight.toString() : productData.weight)
                    : null,
            };

            const processedImages = await Promise.all(
                (productImagesList || []).map(async (img, index) => {
                    let imageId = img.imageId;

                    if (imageId && imageId.startsWith('http')) {
                        const urlParts = imageId.split('/');
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
                                url: imageId,
                                mimeType: mimeType,
                                alt: productData.name || 'Product image',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            })
                            .returning();

                        imageId = mediaRecord.id;
                    }

                    return {
                        imageId,
                        isPrimary: img.isPrimary ?? (index === 0),
                        sortOrder: img.sortOrder ?? index,
                    };
                })
            );

            const [product] = await db
                .insert(products)
                .values({
                    ...cleanedProductData,
                    viewCount: 0,
                    salesCount: 0,
                    reviewCount: 0,
                    averageRating: '0',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning();

            if (processedImages.length > 0) {
                await db.insert(productImages).values(
                    processedImages.map(img => ({
                        productId: product.id,
                        imageId: img.imageId,
                        isPrimary: img.isPrimary,
                        sortOrder: img.sortOrder,
                        createdAt: new Date(),
                    }))
                );
            }

            return {
                success: true,
                product,
            };
        }),

    updateOne: protectedProcedure
        .input(
            z.object({
                productId: z.string(),
            }).merge(createProductSchema)
        )
        .mutation(async ({ input }) => {
            const { productId, images: productImagesList, ...productData } = input;

            const existingProduct = await db
                .select({
                    id: products.id,
                    deletedAt: products.deletedAt
                })
                .from(products)
                .where(eq(products.id, productId))
                .limit(1);

            if (!existingProduct || existingProduct.length === 0) {
                throw new Error("Product not found");
            }

            if (existingProduct[0].deletedAt) {
                throw new Error("Cannot update a deleted product");
            }

            const cleanedProductData = {
                ...productData,
                price: typeof productData.price === 'number' ? productData.price.toString() : productData.price,
                compareAtPrice: productData.compareAtPrice
                    ? (typeof productData.compareAtPrice === 'number' ? productData.compareAtPrice.toString() : productData.compareAtPrice)
                    : null,
                costPrice: productData.costPrice
                    ? (typeof productData.costPrice === 'number' ? productData.costPrice.toString() : productData.costPrice)
                    : null,
                shippingCost: productData.shippingCost
                    ? (typeof productData.shippingCost === 'number' ? productData.shippingCost.toString() : productData.shippingCost)
                    : null,
                weight: productData.weight
                    ? (typeof productData.weight === 'number' ? productData.weight.toString() : productData.weight)
                    : null,
            };

            const processedImages = await Promise.all(
                (productImagesList || []).map(async (img, index) => {
                    let imageId = img.imageId;

                    if (imageId && imageId.startsWith('http')) {
                        const urlParts = imageId.split('/');
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
                                url: imageId,
                                mimeType: mimeType,
                                alt: productData.name || 'Product image',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            })
                            .returning();

                        imageId = mediaRecord.id;
                    }

                    return {
                        imageId,
                        isPrimary: img.isPrimary ?? (index === 0),
                        sortOrder: img.sortOrder ?? index,
                    };
                })
            );

            const [product] = await db
                .update(products)
                .set({
                    ...cleanedProductData,
                    updatedAt: new Date(),
                })
                .where(eq(products.id, productId))
                .returning();

            await db
                .delete(productImages)
                .where(eq(productImages.productId, productId));

            if (processedImages.length > 0) {
                await db.insert(productImages).values(
                    processedImages.map(img => ({
                        productId: productId,
                        imageId: img.imageId,
                        isPrimary: img.isPrimary,
                        sortOrder: img.sortOrder,
                        createdAt: new Date(),
                    }))
                );
            }

            return {
                success: true,
                product,
            };
        }),

    deleteOne: protectedProcedure
        .input(
            z.object({
                productId: z.string()
            })
        )
        .mutation(async ({ input }) => {
            const { productId } = input;

            const product = await db
                .select({
                    id: products.id,
                    deletedAt: products.deletedAt
                })
                .from(products)
                .where(eq(products.id, productId))
                .limit(1);

            if (!product || product.length === 0) {
                throw new Error("Product not found");
            }

            if (product[0].deletedAt) {
                throw new Error("Product is already deleted");
            }

            await db
                .update(products)
                .set({
                    deletedAt: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(products.id, productId));

            return {
                success: true,
                productId,
            };
        }),

    getFeatured: baseProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(20).default(3),
            }).optional()
        )
        .query(async ({ input }) => {
            const limit = input?.limit || 3;

            const productsList = await db
                .select({
                    id: products.id,
                    name: products.name,
                    slug: products.slug,
                    description: products.description,
                    shortDescription: products.shortDescription,
                    price: products.price,
                    compareAtPrice: products.compareAtPrice,
                    badge: products.badge,
                    status: products.status,
                    featured: products.featured,
                    averageRating: products.averageRating,
                    reviewCount: products.reviewCount,
                    createdAt: products.createdAt,
                    updatedAt: products.updatedAt,
                })
                .from(products)
                .where(
                    and(
                        eq(products.featured, true),
                        eq(products.status, 'active'),
                        isNull(products.deletedAt)
                    )
                )
                .orderBy(products.updatedAt)
                .limit(limit);

            if (!productsList || productsList.length === 0) {
                return { data: [] };
            }

            const productIds = productsList.map(p => p.id);

            const images = await db
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
                .orderBy(productImages.sortOrder);

            const imagesByProductId = images.reduce((acc, image) => {
                if (!acc[image.productId]) {
                    acc[image.productId] = [];
                }
                acc[image.productId].push(image);
                return acc;
            }, {} as Record<string, typeof images>);

            const data = productsList.map(item => {
                const productImages = imagesByProductId[item.id] || [];
                const primaryImage = productImages.find(img => img.isPrimary) || productImages[0];

                return {
                    ...item,
                    images: productImages,
                    primaryImage: primaryImage || null,
                    reviewRating: item.averageRating ? parseFloat(item.averageRating) : 0,
                };
            });

            return { data };
        }),

    getCarousel: baseProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(50).default(12),
                excludeFeatured: z.boolean().default(true),
            }).optional()
        )
        .query(async ({ input }) => {
            const limit = input?.limit || 12;
            const excludeFeatured = input?.excludeFeatured ?? true;

            const whereConditions = [
                eq(products.status, 'active'),
                isNull(products.deletedAt)
            ];

            if (excludeFeatured) {
                whereConditions.push(eq(products.featured, false));
            }

            const productsList = await db
                .select({
                    id: products.id,
                    name: products.name,
                    slug: products.slug,
                    description: products.description,
                    shortDescription: products.shortDescription,
                    price: products.price,
                    compareAtPrice: products.compareAtPrice,
                    badge: products.badge,
                    status: products.status,
                    featured: products.featured,
                    averageRating: products.averageRating,
                    reviewCount: products.reviewCount,
                    createdAt: products.createdAt,
                    updatedAt: products.updatedAt,
                })
                .from(products)
                .where(and(...whereConditions))
                .orderBy(products.updatedAt)
                .limit(limit);

            if (!productsList || productsList.length === 0) {
                return { data: [] };
            }

            const productIds = productsList.map(p => p.id);

            const images = await db
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
                .orderBy(productImages.sortOrder);

            const imagesByProductId = images.reduce((acc, image) => {
                if (!acc[image.productId]) {
                    acc[image.productId] = [];
                }
                acc[image.productId].push(image);
                return acc;
            }, {} as Record<string, typeof images>);

            const data = productsList.map(item => {
                const productImages = imagesByProductId[item.id] || [];
                const primaryImage = productImages.find(img => img.isPrimary) || productImages[0];

                return {
                    ...item,
                    images: productImages,
                    primaryImage: primaryImage || null,
                    reviewRating: item.averageRating ? parseFloat(item.averageRating) : 0,
                };
            });

            return { data };
        }),

    getRelated: baseProcedure
        .input(
            z.object({
                categoryId: z.string(),
                excludeProductId: z.string().optional(),
                limit: z.number().min(1).max(20).default(8),
            })
        )
        .query(async ({ input }) => {
            const { categoryId, excludeProductId, limit } = input;

            const whereConditions = [
                eq(products.categoryId, categoryId),
                eq(products.status, 'active'),
                isNull(products.deletedAt)
            ];

            if (excludeProductId) {
                whereConditions.push(sql`${products.id} != ${excludeProductId}`);
            }

            const productsList = await db
                .select({
                    id: products.id,
                    name: products.name,
                    slug: products.slug,
                    description: products.description,
                    shortDescription: products.shortDescription,
                    price: products.price,
                    compareAtPrice: products.compareAtPrice,
                    badge: products.badge,
                    status: products.status,
                    featured: products.featured,
                    averageRating: products.averageRating,
                    reviewCount: products.reviewCount,
                    createdAt: products.createdAt,
                    updatedAt: products.updatedAt,
                })
                .from(products)
                .where(and(...whereConditions))
                .orderBy(products.salesCount, products.updatedAt)
                .limit(limit);

            if (!productsList || productsList.length === 0) {
                return { data: [] };
            }

            const productIds = productsList.map(p => p.id);

            const images = await db
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
                .orderBy(productImages.sortOrder);

            const imagesByProductId = images.reduce((acc, image) => {
                if (!acc[image.productId]) {
                    acc[image.productId] = [];
                }
                acc[image.productId].push(image);
                return acc;
            }, {} as Record<string, typeof images>);

            const data = productsList.map(item => {
                const productImages = imagesByProductId[item.id] || [];
                const primaryImage = productImages.find(img => img.isPrimary) || productImages[0];

                return {
                    ...item,
                    images: productImages,
                    primaryImage: primaryImage || null,
                    reviewRating: item.averageRating ? parseFloat(item.averageRating) : 0,
                };
            });

            return { data };
        }),
});


type RouterOutput = inferRouterOutputs<typeof productsRouter>;

export type Product = RouterOutput['getMany']['data'][0];
export type ProductDetail = RouterOutput['getOne'];
export type FeaturedProduct = RouterOutput['getFeatured']['data'][0];
export type ProductImage = Product['images'][0];