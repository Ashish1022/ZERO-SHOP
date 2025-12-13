import {
    pgTable,
    index,
    uniqueIndex,
    foreignKey,
    uuid,
    varchar,
    text,
    timestamp,
    numeric,
    decimal,
    boolean,
    integer,
    jsonb,
    serial,
    pgEnum
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum('user_role', ['customer', 'employee', 'admin', 'super-admin']);
export const categoryStatusEnum = pgEnum('category_status', ['draft', 'active', 'inactive']);
export const productBadgeEnum = pgEnum('product_badge', ['new', 'sale', 'bestseller', 'limited']);
export const productStatusEnum = pgEnum('product_status', ['draft', 'active', 'archived']);
export const refundPolicyEnum = pgEnum('refund_policy', ['no-refunds', '1-day', '3-day', '7-day', '14-day', '30-day']);
export const tagStatusEnum = pgEnum('tag_status', ['active', 'inactive']);
export const tagTypeEnum = pgEnum('tag_type', ['general', 'feature', 'collection', 'season', 'style', 'material', 'color', 'size', 'brand', 'occasion']);
export const subscriptionPlanPeriodEnum = pgEnum('subscription_plan_period', ['monthly', 'yearly']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['created', 'pending', 'authenticated', 'active', 'paused', 'halted', 'cancelled', 'completed', 'expired']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'processing', 'completed', 'failed', 'refunded']);
export const paymentMethodEnum = pgEnum('payment_method', ['razorpay', 'cod', 'upi', 'card', 'wallet']);
export const addressTypeEnum = pgEnum('address_type', ['billing', 'shipping']);
export const reviewStatusEnum = pgEnum('review_status', ['pending', 'approved', 'rejected']);
export const couponTypeEnum = pgEnum('coupon_type', ['percentage', 'fixed']);
export const couponStatusEnum = pgEnum('coupon_status', ['active', 'inactive', 'expired']);

export const users = pgTable("users", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    password: varchar("password", { length: 255 }).notNull(),
    role: userRoleEnum("role").default('customer').notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    phoneVerified: boolean("phone_verified").default(false).notNull(),
    resetPasswordToken: varchar("reset_password_token", { length: 255 }),
    resetPasswordExpiration: timestamp("reset_password_expiration", { withTimezone: true }),
    loginAttempts: integer("login_attempts").default(0).notNull(),
    lockUntil: timestamp("lock_until", { withTimezone: true }),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
    phoneIdx: index("users_phone_idx").on(t.phone),
    roleIdx: index("users_role_idx").on(t.role),
    resetTokenIdx: index("users_reset_token_idx").on(t.resetPasswordToken)
}));

export const addresses = pgTable("addresses", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    type: addressTypeEnum("type").notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    email: varchar("email", { length: 255 }),
    street: varchar("street", { length: 255 }).notNull(),
    apartment: varchar("apartment", { length: 100 }),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    postalCode: varchar("postal_code", { length: 20 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    specialInstructions: text("special_instructions"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    userIdIdx: index("addresses_user_id_idx").on(t.userId),
    userFk: foreignKey({
        columns: [t.userId],
        foreignColumns: [users.id],
        name: "addresses_user_id_fk"
    }).onDelete("cascade")
}));

export const media = pgTable("media", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    url: varchar("url", { length: 500 }).notNull(),
    thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
    filename: varchar("filename", { length: 255 }).notNull(),
    alt: varchar("alt", { length: 255 }).default('Image').notNull(),
    caption: text("caption"),
    mimeType: varchar("mime_type", { length: 100 }),
    filesize: integer("filesize"),
    width: integer("width"),
    height: integer("height"),
    focalX: decimal("focal_x", { precision: 5, scale: 2 }),
    focalY: decimal("focal_y", { precision: 5, scale: 2 }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    filenameIdx: uniqueIndex("media_filename_idx").on(t.filename)
}));

export const categories = pgTable("categories", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    status: categoryStatusEnum("status").default('active').notNull(),
    featured: boolean("featured").default(false).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    parentId: uuid("parent_id"),
    thumbnailId: uuid("thumbnail_id"),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    seoKeywords: varchar("seo_keywords", { length: 500 }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    slugIdx: uniqueIndex("categories_slug_idx").on(t.slug),
    statusIdx: index("categories_status_idx").on(t.status),
    parentFk: foreignKey({
        columns: [t.parentId],
        foreignColumns: [t.id],
        name: "categories_parent_id_fk"
    }).onDelete("set null")
}));

export const tags = pgTable("tags", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    description: text("description"),
    type: tagTypeEnum("type").default('general').notNull(),
    status: tagStatusEnum("status").default('active').notNull(),
    featured: boolean("featured").default(false).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    slugIdx: uniqueIndex("tags_slug_idx").on(t.slug)
}));

export const products = pgTable("products", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description").notNull(),
    shortDescription: text("short_description"),
    content: jsonb("content"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
    costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
    taxable: boolean("taxable").default(true).notNull(),
    trackQuantity: boolean("track_quantity").default(true).notNull(),
    quantity: integer("quantity").default(0).notNull(),
    lowStockThreshold: integer("low_stock_threshold").default(5).notNull(),
    allowBackorders: boolean("allow_backorders").default(false).notNull(),
    sku: varchar("sku", { length: 100 }),
    requiresShipping: boolean("requires_shipping").default(true).notNull(),
    freeShipping: boolean("free_shipping").default(false).notNull(),
    shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }),
    weight: decimal("weight", { precision: 10, scale: 2 }),
    categoryId: uuid("category_id").notNull(),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    status: productStatusEnum("status").default('draft').notNull(),
    featured: boolean("featured").default(false).notNull(),
    badge: productBadgeEnum("badge"),
    refundPolicy: refundPolicyEnum("refund_policy").default('30-day').notNull(),
    viewCount: integer("view_count").default(0).notNull(),
    salesCount: integer("sales_count").default(0).notNull(),
    averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default('0'),
    reviewCount: integer("review_count").default(0).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    slugIdx: uniqueIndex("products_slug_idx").on(t.slug),
    skuIdx: uniqueIndex("products_sku_idx").on(t.sku),
    statusIdx: index("products_status_idx").on(t.status),
    categoryFk: foreignKey({
        columns: [t.categoryId],
        foreignColumns: [categories.id],
        name: "products_category_id_fk"
    }).onDelete("restrict")
}));

export const productImages = pgTable("product_images", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    productId: uuid("product_id").notNull(),
    imageId: uuid("image_id").notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    productIdIdx: index("product_images_product_id_idx").on(t.productId),
    productFk: foreignKey({
        columns: [t.productId],
        foreignColumns: [products.id],
        name: "product_images_product_id_fk"
    }).onDelete("cascade")
}));

export const productTags = pgTable("product_tags", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    productId: uuid("product_id").notNull(),
    tagId: uuid("tag_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    uniqueIdx: uniqueIndex("product_tags_product_tag_idx").on(t.productId, t.tagId),
    productFk: foreignKey({
        columns: [t.productId],
        foreignColumns: [products.id],
        name: "product_tags_product_id_fk"
    }).onDelete("cascade")
}));

export const reviews = pgTable("reviews", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    productId: uuid("product_id").notNull(),
    userId: uuid("user_id"),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }),
    rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    status: reviewStatusEnum("status").default('pending').notNull(),
    isVerifiedPurchase: boolean("is_verified_purchase").default(false).notNull(),
    helpfulCount: integer("helpful_count").default(0).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    productIdIdx: index("reviews_product_id_idx").on(t.productId),
    statusIdx: index("reviews_status_idx").on(t.status)
}));

export const coupons = pgTable("coupons", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    code: varchar("code", { length: 50 }).notNull(),
    description: text("description"),
    type: couponTypeEnum("type").notNull(),
    value: decimal("value", { precision: 10, scale: 2 }).notNull(),
    minPurchaseAmount: decimal("min_purchase_amount", { precision: 10, scale: 2 }),
    maxDiscountAmount: decimal("max_discount_amount", { precision: 10, scale: 2 }),
    usageLimit: integer("usage_limit"),
    usageCount: integer("usage_count").default(0).notNull(),
    status: couponStatusEnum("status").default('active').notNull(),
    validFrom: timestamp("valid_from", { withTimezone: true }).notNull(),
    validUntil: timestamp("valid_until", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    codeIdx: uniqueIndex("coupons_code_idx").on(t.code),
    statusIdx: index("coupons_status_idx").on(t.status)
}));

export const shippingMethods = pgTable("shipping_methods", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
    freeShippingThreshold: decimal("free_shipping_threshold", { precision: 10, scale: 2 }),
    estimatedDaysMin: integer("estimated_days_min"),
    estimatedDaysMax: integer("estimated_days_max"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

export const carts = pgTable("carts", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id"),
    sessionId: varchar("session_id", { length: 255 }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    userIdIdx: index("carts_user_id_idx").on(t.userId),
    userFk: foreignKey({
        columns: [t.userId],
        foreignColumns: [users.id],
        name: "carts_user_id_fk"
    }).onDelete("cascade")
}));

export const cartItems = pgTable("cart_items", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    cartId: uuid("cart_id").notNull(),
    productId: uuid("product_id").notNull(),
    quantity: integer("quantity").default(1).notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    cartIdIdx: index("cart_items_cart_id_idx").on(t.cartId),
    cartFk: foreignKey({
        columns: [t.cartId],
        foreignColumns: [carts.id],
        name: "cart_items_cart_id_fk"
    }).onDelete("cascade")
}));

export const wishlists = pgTable("wishlists", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    productId: uuid("product_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    uniqueIdx: uniqueIndex("wishlists_user_product_idx").on(t.userId, t.productId),
    userFk: foreignKey({
        columns: [t.userId],
        foreignColumns: [users.id],
        name: "wishlists_user_id_fk"
    }).onDelete("cascade")
}));

export const orders = pgTable("orders", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    orderNumber: varchar("order_number", { length: 50 }).notNull(),
    status: orderStatusEnum("status").default('pending').notNull(),
    paymentStatus: paymentStatusEnum("payment_status").default('pending').notNull(),
    paymentMethod: paymentMethodEnum("payment_method"),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default('0').notNull(),
    taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default('0').notNull(),
    shippingAmount: decimal("shipping_amount", { precision: 10, scale: 2 }).default('0').notNull(),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    billingAddressId: uuid("billing_address_id").notNull(),
    shippingAddressId: uuid("shipping_address_id").notNull(),
    shippingMethodId: uuid("shipping_method_id"),
    trackingNumber: varchar("tracking_number", { length: 100 }),
    couponId: uuid("coupon_id"),
    couponCode: varchar("coupon_code", { length: 50 }),
    razorpayOrderId: varchar("razorpay_order_id", { length: 100 }),
    razorpayPaymentId: varchar("razorpay_payment_id", { length: 100 }),
    customerNotes: text("customer_notes"),
    adminNotes: text("admin_notes"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    orderNumberIdx: uniqueIndex("orders_order_number_idx").on(t.orderNumber),
    userIdIdx: index("orders_user_id_idx").on(t.userId),
    statusIdx: index("orders_status_idx").on(t.status),
    userFk: foreignKey({
        columns: [t.userId],
        foreignColumns: [users.id],
        name: "orders_user_id_fk"
    }).onDelete("restrict")
}));

export const orderItems = pgTable("order_items", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    orderId: uuid("order_id").notNull(),
    productId: uuid("product_id").notNull(),
    productName: varchar("product_name", { length: 255 }).notNull(),
    quantity: integer("quantity").notNull(),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    orderIdIdx: index("order_items_order_id_idx").on(t.orderId),
    orderFk: foreignKey({
        columns: [t.orderId],
        foreignColumns: [orders.id],
        name: "order_items_order_id_fk"
    }).onDelete("cascade")
}));

export const orderStatusHistory = pgTable("order_status_history", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    orderId: uuid("order_id").notNull(),
    status: orderStatusEnum("status").notNull(),
    notes: text("notes"),
    createdBy: uuid("created_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    orderIdIdx: index("order_status_history_order_id_idx").on(t.orderId),
    orderFk: foreignKey({
        columns: [t.orderId],
        foreignColumns: [orders.id],
        name: "order_status_history_order_id_fk"
    }).onDelete("cascade")
}));

export const subscriptionPlans = pgTable("subscription_plans", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).default('INR').notNull(),
    period: subscriptionPlanPeriodEnum("period").notNull(),
    interval: integer("interval").default(1).notNull(),
    razorpayPlanId: varchar("razorpay_plan_id", { length: 100 }),
    isActive: boolean("is_active").default(true).notNull(),
    popular: boolean("popular").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    nameIdx: uniqueIndex("subscription_plans_name_idx").on(t.name)
}));

export const subscriptions = pgTable("subscriptions", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    planId: uuid("plan_id").notNull(),
    razorpaySubscriptionId: varchar("razorpay_subscription_id", { length: 100 }).notNull(),
    status: subscriptionStatusEnum("status").notNull(),
    startAt: timestamp("start_at", { withTimezone: true }),
    endAt: timestamp("end_at", { withTimezone: true }),
    currentStart: timestamp("current_start", { withTimezone: true }),
    currentEnd: timestamp("current_end", { withTimezone: true }),
    totalCount: integer("total_count"),
    paidCount: integer("paid_count").default(0).notNull(),
    remainingCount: integer("remaining_count"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    userIdIdx: index("subscriptions_user_id_idx").on(t.userId),
    planIdIdx: index("subscriptions_plan_id_idx").on(t.planId),
    statusIdx: index("subscriptions_status_idx").on(t.status),
    razorpayIdx: uniqueIndex("subscriptions_razorpay_id_idx").on(t.razorpaySubscriptionId),
    userFk: foreignKey({
        columns: [t.userId],
        foreignColumns: [users.id],
        name: "subscriptions_user_id_fk"
    }).onDelete("restrict"),
    planFk: foreignKey({
        columns: [t.planId],
        foreignColumns: [subscriptionPlans.id],
        name: "subscriptions_plan_id_fk"
    }).onDelete("restrict")
}));