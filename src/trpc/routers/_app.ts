import { createTRPCRouter } from "../init";

import { authRouter } from "@/modules/auth/server/procedure";
import { reviewsRouter } from "@/modules/reviews/server/procedure";
import { productsRouter } from "@/modules/products/server/procedure";
import { checkoutRouter } from "@/modules/checkout/server/procedure";
import { categoriesRouter } from "@/modules/categories/server/procedure";

export const appRouter = createTRPCRouter({
    auth: authRouter,
    reviews: reviewsRouter,
    products: productsRouter,
    checkout: checkoutRouter,
    categories: categoriesRouter,
})

export type AppRouter = typeof appRouter;