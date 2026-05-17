import { createTRPCRouter } from "../init";

import { authRouter } from "@/modules/auth/server/procedure";
import { ordersRouter } from "@/modules/orders/server/procedure";
import { reviewsRouter } from "@/modules/reviews/server/procedure";
import { productsRouter } from "@/modules/products/server/procedure";
import { checkoutRouter } from "@/modules/checkout/server/procedure";
import { categoriesRouter } from "@/modules/categories/server/procedure";
import { customersRouter } from "@/modules/customers/server/procedure";
import { inventoryRouter } from "@/modules/inventory/server/procedure";
import { couponsRouter } from "@/modules/coupons/server/procedure";
import { analyticsRouter } from "@/modules/analytics/server/procedure";
import { paymentsRouter } from "@/modules/payments/server/procedure";
import { returnsRouter } from "@/modules/returns/server/procedure";

export const appRouter = createTRPCRouter({
    auth: authRouter,
    orders: ordersRouter,
    reviews: reviewsRouter,
    products: productsRouter,
    checkout: checkoutRouter,
    categories: categoriesRouter,
    customers: customersRouter,
    inventory: inventoryRouter,
    coupons: couponsRouter,
    analytics: analyticsRouter,
    payments: paymentsRouter,
    returns: returnsRouter,
})

export type AppRouter = typeof appRouter;
