import { db } from "@/db";
import { categories, media, productImages, products } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, isNull, ne, sql } from "drizzle-orm";
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
})