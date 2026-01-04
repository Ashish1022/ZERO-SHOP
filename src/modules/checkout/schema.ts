import { z } from "zod";

export const contactSchema = z.object({
    firstname: z
        .string()
        .min(1, "First name is required")
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must be less than 50 characters")
        .regex(/^[a-zA-Z\s'-]+$/, "First name can only contain letters, spaces, hyphens, and apostrophes"),

    lastname: z
        .string()
        .min(1, "Last name is required")
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must be less than 50 characters")
        .regex(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters, spaces, hyphens, and apostrophes"),

    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address")
        .max(100, "Email must be less than 100 characters")
        .toLowerCase(),

    phone: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^[\d\s\-\+\(\)\.]+$/, "Please enter a valid phone number")
        .min(10, "Phone number must be at least 10 digits")
        .max(20, "Phone number must be less than 20 characters")
        .transform(str => str.replace(/\D/g, ''))
        .refine(phone => phone.length >= 10, "Phone number must contain at least 10 digits"),

    newsletter: z.boolean()
});

export const shippingSchema = z.object({
    street: z.string()
        .min(1, "Street address is required")
        .max(100, "Street address must be less than 100 characters")
        .trim(),
    apartment: z.string()
        .max(20, "Apartment number must be less than 20 characters")
        .trim()
        .or(z.literal("")),
    city: z.string()
        .min(1, "City is required")
        .max(50, "City name must be less than 50 characters")
        .regex(/^[a-zA-Z\s\-'\.]+$/, "City name contains invalid characters")
        .trim(),

    state: z.string()
        .min(2, "State is required")
        .max(50, "State name must be less than 50 characters")
        .trim(),

    zip: z.string()
        .min(1, "ZIP code is required")
        .trim(),
});

export const order = z.object({
    finalAmount: z.number(),
    products: z.array(z.object({
        productId: z.string(),
        name: z.string(),
        quantity: z.number(),
        price: z.number(),
        compareAtPrice: z.number(),
        category: z.string()
    })),
    tenant: z.string(),
    grossAmount: z.number(),
    discountAmount: z.number(),
    taxAmount: z.number(),
    shippingAmount: z.number(),
    saleAmount: z.number()
})

export const checkoutSchema = contactSchema.merge(shippingSchema).merge(order)

