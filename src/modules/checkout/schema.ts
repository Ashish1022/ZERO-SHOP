import { z } from "zod";

export const contactSchema = z.object({
    firstName: z.string()
        .min(2, "First name must be at least 2 characters")
        .max(100, "First name too long")
        .trim(),
    lastName: z.string()
        .min(2, "Last name must be at least 2 characters")
        .max(100, "Last name too long")
        .trim(),
    email: z.string()
        .email("Please enter a valid email")
        .max(255)
        .toLowerCase()
        .trim(),
    phone: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .regex(/^[\d\s\-\+\(\)\.]+$/, "Please enter a valid phone number"),
    newsletter: z.boolean()
});

export const shippingSchema = z.object({
    street: z.string()
        .min(1, "Street address is required")
        .max(255)
        .trim(),
    apartment: z.string()
        .max(100),
    city: z.string()
        .min(1, "City is required")
        .max(100)
        .trim(),
    state: z.string()
        .min(1, "State is required")
        .max(100)
        .trim(),
    postalCode: z.string()
        .min(6, "PIN code must be 6 digits")
        .max(6, "PIN code must be 6 digits")
        .regex(/^\d{6}$/, "Please enter a valid 6-digit PIN code")
        .trim(),
    country: z.string()
});

export const checkoutFormSchema = contactSchema.merge(shippingSchema).extend({
    paymentMethod: z.enum(['razorpay', 'cod', 'upi', 'card', 'wallet']),
});

export const checkoutSchema = checkoutFormSchema.extend({
    items: z.array(z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive()
    })).min(1, "Cart must have at least one item"),
    couponCode: z.string().max(50).optional(),
    customerNotes: z.string().max(1000).optional()
});

export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;