import { createTRPCRouter } from "../init";

import { reviewsRouter } from "@/modules/reviews/server/procedure";
import { productsRouter } from "@/modules/products/server/procedure";

export const appRouter = createTRPCRouter({
    reviews: reviewsRouter,
    products: productsRouter,
})

export type AppRouter = typeof appRouter;