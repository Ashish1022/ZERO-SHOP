import { db } from "@/db";
import { reviews, users, products } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import z from "zod";

export const reviewsRouter = createTRPCRouter({
    getByProduct: baseProcedure
        .input(
            z.object({
                productId: z.string(),
                limit: z.number().min(1).max(100).default(10),
                offset: z.number().min(0).default(0),
                status: z.enum(['pending', 'approved', 'rejected']).optional().default('approved'),
            })
        )
        .query(async ({ input }) => {
            const { productId, limit, offset, status } = input;

            const result = await db
                .select({
                    id: reviews.id,
                    productId: reviews.productId,
                    userId: reviews.userId,
                    name: reviews.name,
                    email: reviews.email,
                    rating: reviews.rating,
                    title: reviews.title,
                    description: reviews.description,
                    status: reviews.status,
                    isVerifiedPurchase: reviews.isVerifiedPurchase,
                    helpfulCount: reviews.helpfulCount,
                    createdAt: reviews.createdAt,
                    updatedAt: reviews.updatedAt,
                })
                .from(reviews)
                .where(
                    and(
                        eq(reviews.productId, productId),
                        eq(reviews.status, status),
                        isNull(reviews.deletedAt)
                    )
                )
                .orderBy(desc(reviews.createdAt))
                .limit(limit)
                .offset(offset);

            return result.map(review => ({
                id: review.id,
                productId: review.productId,
                userId: review.userId,
                userName: review.name,
                email: review.email,
                rating: parseFloat(review.rating),
                title: review.title,
                comment: review.description,
                status: review.status,
                verifiedPurchase: review.isVerifiedPurchase,
                helpfulCount: review.helpfulCount,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
            }));
        }),

    getProductStats: baseProcedure
        .input(z.object({ productId: z.string() }))
        .query(async ({ input }) => {
            const stats = await db
                .select({
                    totalReviews: sql<number>`COUNT(*)::int`,
                    averageRating: sql<string>`ROUND(AVG(${reviews.rating}), 2)`,
                    fiveStarCount: sql<number>`COUNT(CASE WHEN ${reviews.rating} = 5 THEN 1 END)::int`,
                    fourStarCount: sql<number>`COUNT(CASE WHEN ${reviews.rating} = 4 THEN 1 END)::int`,
                    threeStarCount: sql<number>`COUNT(CASE WHEN ${reviews.rating} = 3 THEN 1 END)::int`,
                    twoStarCount: sql<number>`COUNT(CASE WHEN ${reviews.rating} = 2 THEN 1 END)::int`,
                    oneStarCount: sql<number>`COUNT(CASE WHEN ${reviews.rating} = 1 THEN 1 END)::int`,
                })
                .from(reviews)
                .where(
                    and(
                        eq(reviews.productId, input.productId),
                        eq(reviews.status, 'approved'),
                        isNull(reviews.deletedAt)
                    )
                );

            const result = stats[0];

            return {
                totalReviews: result.totalReviews,
                averageRating: result.averageRating ? parseFloat(result.averageRating) : 0,
                ratingDistribution: {
                    5: result.fiveStarCount,
                    4: result.fourStarCount,
                    3: result.threeStarCount,
                    2: result.twoStarCount,
                    1: result.oneStarCount,
                },
            };
        }),

    create: baseProcedure
        .input(
            z.object({
                productId: z.string(),
                userId: z.string().optional(),
                name: z.string().min(1).max(100),
                email: z.string().email().optional(),
                rating: z.number().min(1).max(5),
                title: z.string().min(1).max(255),
                description: z.string().min(10).max(5000),
            })
        )
        .mutation(async ({ input }) => {
            const product = await db
                .select({ id: products.id })
                .from(products)
                .where(
                    and(
                        eq(products.id, input.productId),
                        isNull(products.deletedAt)
                    )
                )
                .limit(1);

            if (!product || product.length === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Product not found",
                });
            }

            if (input.userId) {
                const existingReview = await db
                    .select({ id: reviews.id })
                    .from(reviews)
                    .where(
                        and(
                            eq(reviews.productId, input.productId),
                            eq(reviews.userId, input.userId),
                            isNull(reviews.deletedAt)
                        )
                    )
                    .limit(1);

                if (existingReview && existingReview.length > 0) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "You have already reviewed this product",
                    });
                }
            }

            const newReview = await db
                .insert(reviews)
                .values({
                    productId: input.productId,
                    userId: input.userId,
                    name: input.name,
                    email: input.email,
                    rating: input.rating.toString(),
                    title: input.title,
                    description: input.description,
                    status: 'pending',
                    isVerifiedPurchase: false, 
                })
                .returning();

            return newReview[0];
        }),

    markHelpful: baseProcedure
        .input(z.object({ reviewId: z.string() }))
        .mutation(async ({ input }) => {
            const review = await db
                .select({ id: reviews.id })
                .from(reviews)
                .where(
                    and(
                        eq(reviews.id, input.reviewId),
                        isNull(reviews.deletedAt)
                    )
                )
                .limit(1);

            if (!review || review.length === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Review not found",
                });
            }

            await db
                .update(reviews)
                .set({
                    helpfulCount: sql`${reviews.helpfulCount} + 1`,
                })
                .where(eq(reviews.id, input.reviewId));

            return { success: true };
        }),

    getByUser: baseProcedure
        .input(
            z.object({
                userId: z.string(),
                limit: z.number().min(1).max(100).default(10),
                offset: z.number().min(0).default(0),
            })
        )
        .query(async ({ input }) => {
            const { userId, limit, offset } = input;

            const result = await db
                .select({
                    id: reviews.id,
                    productId: reviews.productId,
                    productName: products.name,
                    productSlug: products.slug,
                    rating: reviews.rating,
                    title: reviews.title,
                    description: reviews.description,
                    status: reviews.status,
                    isVerifiedPurchase: reviews.isVerifiedPurchase,
                    helpfulCount: reviews.helpfulCount,
                    createdAt: reviews.createdAt,
                })
                .from(reviews)
                .innerJoin(products, eq(reviews.productId, products.id))
                .where(
                    and(
                        eq(reviews.userId, userId),
                        isNull(reviews.deletedAt)
                    )
                )
                .orderBy(desc(reviews.createdAt))
                .limit(limit)
                .offset(offset);

            return result.map(review => ({
                id: review.id,
                productId: review.productId,
                productName: review.productName,
                productSlug: review.productSlug,
                rating: parseFloat(review.rating),
                title: review.title,
                comment: review.description,
                status: review.status,
                verifiedPurchase: review.isVerifiedPurchase,
                helpfulCount: review.helpfulCount,
                createdAt: review.createdAt,
            }));
        }),

    delete: baseProcedure
        .input(z.object({ reviewId: z.string() }))
        .mutation(async ({ input }) => {
            const review = await db
                .select({ id: reviews.id })
                .from(reviews)
                .where(
                    and(
                        eq(reviews.id, input.reviewId),
                        isNull(reviews.deletedAt)
                    )
                )
                .limit(1);

            if (!review || review.length === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Review not found",
                });
            }

            await db
                .update(reviews)
                .set({
                    deletedAt: new Date(),
                })
                .where(eq(reviews.id, input.reviewId));

            return { success: true };
        }),
});