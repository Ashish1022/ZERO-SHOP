import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address")
        .max(254, "Email must be less than 254 characters")
        .toLowerCase()
        .trim(),
    password: z.string(),
});

export const registerSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address")
        .max(254, "Email must be less than 254 characters")
        .toLowerCase()
        .trim(),
    phone: z.string(),
    role: z.string(),
    password: z.string(),
    firstName: z
        .string()
        .min(1, "First name is required")
        .max(50, "First name must be less than 50 characters")
        .trim(),
    lastName: z
        .string()
        .min(1, "Last name is required")
        .max(50, "Last name must be less than 50 characters")
        .trim(),
});


export const otpSchema = z.object({
    otp: z.string()
});

export const verifySchema = registerSchema.merge(otpSchema)