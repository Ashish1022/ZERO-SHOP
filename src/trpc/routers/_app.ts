import { createTRPCRouter } from "../init";

import { reviewsRouter } from "@/modules/reviews/server/procedure";
import { productsRouter } from "@/modules/products/server/procedure";
import { categoriesRouter } from "@/modules/categories/server/procedure";

export const appRouter = createTRPCRouter({
    reviews: reviewsRouter,
    products: productsRouter,
    categories: categoriesRouter
})

export type AppRouter = typeof appRouter;