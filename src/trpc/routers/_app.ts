import { createTRPCRouter } from "../init";

import { reviewsRouter } from "@/modules/reviews/server/procedure";
import { productsRouter } from "@/modules/products/server/procedure";
import { checkoutRouter } from "@/modules/checkout/server/procedure";
import { categoriesRouter } from "@/modules/categories/server/procedure";

export const appRouter = createTRPCRouter({
    reviews: reviewsRouter,
    products: productsRouter,
    checkout: checkoutRouter,
    categories: categoriesRouter,
})

export type AppRouter = typeof appRouter;