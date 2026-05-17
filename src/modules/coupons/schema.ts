import { z } from "zod";

export const couponTypeEnum = z.enum(["percentage", "fixed"]);
export const couponStatusEnum = z.enum(["active", "inactive", "expired"]);

export const createCouponSchema = z.object({
    code: z.string().min(3, "Code must be at least 3 characters").max(50),
    description: z.string().optional().nullable(),
    type: couponTypeEnum,
    value: z.number().positive("Value must be positive"),
    minPurchaseAmount: z.number().nonnegative().optional().nullable(),
    maxDiscountAmount: z.number().nonnegative().optional().nullable(),
    usageLimit: z.number().int().positive().optional().nullable(),
    status: couponStatusEnum,
    validFrom: z.string().datetime(),
    validUntil: z.string().datetime(),
});

export const updateCouponSchema = z.object({
    id: z.string().uuid(),
    description: z.string().optional().nullable(),
    type: couponTypeEnum.optional(),
    value: z.number().positive().optional(),
    minPurchaseAmount: z.number().nonnegative().optional().nullable(),
    maxDiscountAmount: z.number().nonnegative().optional().nullable(),
    usageLimit: z.number().int().positive().optional().nullable(),
    status: couponStatusEnum.optional(),
    validFrom: z.string().datetime().optional(),
    validUntil: z.string().datetime().optional(),
});

export type CreateCoupon = z.infer<typeof createCouponSchema>;
export type UpdateCoupon = z.infer<typeof updateCouponSchema>;
