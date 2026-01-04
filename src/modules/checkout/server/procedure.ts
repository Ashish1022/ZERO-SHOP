import { z } from "zod";
import crypto from "crypto";
import { eq, inArray } from "drizzle-orm";

import { checkoutSchema } from "../schema";

import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { orders, orderItems, products, users, addresses, coupons } from "@/db/schema/schema";
import { razorpay } from "@/lib/razorpay";

function generateOrderNumber() {
    return `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
}

export const checkoutRouter = createTRPCRouter({
    createOrder: baseProcedure
        .input(checkoutSchema)
        .mutation(async ({ input }) => {
            try {
                const productList = await db.select().from(products).where(inArray(products.id, input.items.map(i => i.productId)));
                const productMap = new Map(productList.map(p => [p.id, p]));

                let subtotal = 0;
                for (const item of input.items) {
                    const product = productMap.get(item.productId);
                    if (!product || product.status !== 'active') {
                        throw new TRPCError({ code: "BAD_REQUEST", message: "Product not available" });
                    }
                    subtotal += parseFloat(product.price) * item.quantity;
                }

                let discountAmount = 0;
                let couponId = null;
                if (input.couponCode) {
                    const [coupon] = await db.select().from(coupons).where(eq(coupons.code, input.couponCode));
                    if (coupon && coupon.status === 'active') {
                        const now = new Date();
                        if (now < new Date(coupon.validFrom) || now > new Date(coupon.validUntil)) {
                            throw new TRPCError({ code: "BAD_REQUEST", message: "Coupon expired" });
                        }
                        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
                            throw new TRPCError({ code: "BAD_REQUEST", message: "Coupon limit reached" });
                        }
                        discountAmount = coupon.type === 'percentage'
                            ? (subtotal * parseFloat(coupon.value)) / 100
                            : parseFloat(coupon.value);
                        if (coupon.maxDiscountAmount) {
                            discountAmount = Math.min(discountAmount, parseFloat(coupon.maxDiscountAmount));
                        }
                        couponId = coupon.id;
                        await db.update(coupons).set({ usageCount: coupon.usageCount + 1 }).where(eq(coupons.id, coupon.id));
                    }
                }

                const FREE_SHIPPING_THRESHOLD = 150;
                const SHIPPING_COST = 5.99;
                const shippingAmount = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

                const TAX_RATE = 0.18;
                const taxAmount = subtotal * TAX_RATE;
                const total = subtotal - discountAmount + taxAmount + shippingAmount;

                const existingUsers = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, input.email))
                    .limit(1);

                let user;
                if (existingUsers.length > 0) {
                    const [updatedUser] = await db
                        .update(users)
                        .set({
                            firstName: input.firstName,
                            lastName: input.lastName,
                            phone: input.phone,
                            updatedAt: new Date()
                        })
                        .where(eq(users.id, existingUsers[0].id))
                        .returning();
                    user = updatedUser;
                } else {
                    const [newUser] = await db.insert(users).values({
                        firstName: input.firstName,
                        lastName: input.lastName,
                        email: input.email,
                        phone: input.phone,
                        password: "" 
                    }).returning();
                    user = newUser;
                }

                const [address] = await db.insert(addresses).values({
                    userId: user.id,
                    type: 'shipping',
                    firstName: input.firstName,
                    lastName: input.lastName,
                    phone: input.phone,
                    street: input.street,
                    city: input.city,
                    state: input.state,
                    postalCode: input.postalCode,
                    country: input.country
                }).returning();

                const orderNumber = generateOrderNumber();

                const [order] = await db.insert(orders).values({
                    userId: user.id,
                    orderNumber,
                    paymentMethod: input.paymentMethod,
                    paymentStatus: 'pending',
                    subtotal: subtotal.toFixed(2),
                    discountAmount: discountAmount.toFixed(2),
                    taxAmount: taxAmount.toFixed(2),
                    shippingAmount: shippingAmount.toFixed(2),
                    total: total.toFixed(2),
                    billingAddressId: address.id,
                    shippingAddressId: address.id,
                    couponId
                }).returning();

                await db.insert(orderItems).values(
                    input.items.map(item => {
                        const product = productMap.get(item.productId)!;
                        return {
                            orderId: order.id,
                            productId: product.id,
                            productName: product.name,
                            quantity: item.quantity,
                            unitPrice: product.price,
                            totalPrice: (parseFloat(product.price) * item.quantity).toFixed(2)
                        };
                    })
                );

                let razorpayOrder = null;
                if (input.paymentMethod === 'razorpay') {
                    const razorpayAmount = parseInt((total * 100).toFixed(0));
                    razorpayOrder = await razorpay.orders.create({
                        amount: razorpayAmount,
                        currency: 'INR',
                        receipt: orderNumber
                    });

                    await db.update(orders)
                        .set({ razorpayOrderId: razorpayOrder.id })
                        .where(eq(orders.id, order.id));
                }

                return {
                    success: true,
                    orderId: order.id,
                    orderNumber: order.orderNumber,
                    total: order.total,
                    razorpay_order_id: razorpayOrder?.id,
                    razorpay_amount: razorpayOrder?.amount,
                    currency: razorpayOrder?.currency || 'INR',
                    customerEmail: input.email,
                    customerPhone: input.phone,
                    customerName: `${input.firstName} ${input.lastName}`
                };
            } catch (error) {
                console.error(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: error instanceof TRPCError ? error.message : "Failed to create order"
                });
            }
        }),

    verifyPayment: baseProcedure
        .input(z.object({
            orderId: z.string().uuid(),
            razorpay_order_id: z.string(),
            razorpay_payment_id: z.string(),
            razorpay_signature: z.string()
        }))
        .mutation(async ({ input }) => {
            try {
                const body = `${input.razorpay_order_id}|${input.razorpay_payment_id}`;
                const expectedSignature = crypto
                    .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY!)
                    .update(body)
                    .digest('hex');

                if (expectedSignature !== input.razorpay_signature) {
                    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid payment signature" });
                }

                await db.update(orders)
                    .set({
                        paymentStatus: 'completed',
                        razorpayPaymentId: input.razorpay_payment_id
                    })
                    .where(eq(orders.id, input.orderId));

                const orderItemsList = await db.select().from(orderItems).where(eq(orderItems.orderId, input.orderId));

                for (const item of orderItemsList) {
                    const [product] = await db.select().from(products).where(eq(products.id, item.productId));
                    if (product) {
                        await db.update(products)
                            .set({
                                quantity: product.quantity - item.quantity,
                                salesCount: product.salesCount + item.quantity
                            })
                            .where(eq(products.id, product.id));
                    }
                }

                return { success: true, message: "Payment verified successfully" };
            } catch (error) {
                console.error(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: error instanceof TRPCError ? error.message : "Failed to verify payment"
                });
            }
        })
});