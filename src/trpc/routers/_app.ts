import { createTRPCRouter } from "../init";

import { authRouter } from "@/modules/auth/server/procedure";
import { productsRouter } from "@/modules/products/server/procedure";
import { categoriesRouter } from "@/modules/categories/server/procedure";

export const appRouter = createTRPCRouter({
    auth: authRouter,
    products: productsRouter,
    categories: categoriesRouter,
})

export type AppRouter = typeof appRouter;