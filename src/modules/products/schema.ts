import z from 'zod';

export const productBadgeEnum = z.enum(['new', 'sale', 'bestseller', 'limited']);
export const productStatusEnum = z.enum(['draft', 'active', 'archived']);
export const refundPolicyEnum = z.enum(['no-refunds', '1-day', '3-day', '7-day', '14-day', '30-day']);

export const productSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, "Product name is required").max(255),
    slug: z.string().min(1, "Slug is required").max(255),
    description: z.string().min(1, "Description is required"),
    shortDescription: z.string().optional().nullable(),
    content: z.any().optional().nullable(),
    price: z.string().or(z.number()).refine((val) => {
        const num = typeof val === 'string' ? parseFloat(val) : val;
        return !isNaN(num) && num >= 0;
    }, "Price must be a valid positive number"),
    compareAtPrice: z.string().or(z.number()).optional().nullable().refine((val) => {
        if (!val) return true;
        const num = typeof val === 'string' ? parseFloat(val) : val;
        return !isNaN(num) && num >= 0;
    }, "Compare at price must be a valid positive number"),
    costPrice: z.string().or(z.number()).optional().nullable().refine((val) => {
        if (!val) return true;
        const num = typeof val === 'string' ? parseFloat(val) : val;
        return !isNaN(num) && num >= 0;
    }, "Cost price must be a valid positive number"),
    taxable: z.boolean().default(true),
    trackQuantity: z.boolean().default(true),
    quantity: z.number().int().min(0).default(0),
    lowStockThreshold: z.number().int().min(0).default(5),
    allowBackorders: z.boolean().default(false),
    sku: z.string().max(100).optional().nullable(),
    requiresShipping: z.boolean().default(true),
    freeShipping: z.boolean().default(false),
    shippingCost: z.string().or(z.number()).optional().nullable().refine((val) => {
        if (!val) return true;
        const num = typeof val === 'string' ? parseFloat(val) : val;
        return !isNaN(num) && num >= 0;
    }, "Shipping cost must be a valid positive number"),
    weight: z.string().or(z.number()).optional().nullable().refine((val) => {
        if (!val) return true;
        const num = typeof val === 'string' ? parseFloat(val) : val;
        return !isNaN(num) && num >= 0;
    }, "Weight must be a valid positive number"),
    categoryId: z.string().uuid("Category is required"),
    seoTitle: z.string().max(255).optional().nullable(),
    seoDescription: z.string().optional().nullable(),
    status: productStatusEnum.default('draft'),
    featured: z.boolean().default(false),
    badge: productBadgeEnum.optional().nullable(),
    refundPolicy: refundPolicyEnum.default('30-day'),
    viewCount: z.number().int().min(0).default(0),
    salesCount: z.number().int().min(0).default(0),
    averageRating: z.string().or(z.number()).optional().nullable(),
    reviewCount: z.number().int().min(0).default(0),
    deletedAt: z.date().optional().nullable(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})


export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional().nullable(),
  content: z.any().optional().nullable(),
  price: z.string().or(z.number()).refine((val) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return !isNaN(num) && num >= 0;
  }, "Price must be a valid positive number"),
  compareAtPrice: z.string().or(z.number()).optional().nullable(),
  costPrice: z.string().or(z.number()).optional().nullable(),
  taxable: z.boolean().optional(),
  trackQuantity: z.boolean().optional(),
  quantity: z.number().int().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  allowBackorders: z.boolean().optional(),
  sku: z.string().max(100).optional().nullable(),
  requiresShipping: z.boolean().optional(),
  freeShipping: z.boolean().optional(),
  shippingCost: z.string().or(z.number()).optional().nullable(),
  weight: z.string().or(z.number()).optional().nullable(),
  categoryId: z.string().uuid("Category is required"),
  seoTitle: z.string().max(255).optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  status: productStatusEnum.optional(),
  featured: z.boolean().optional(),
  badge: productBadgeEnum.optional().nullable(),
  refundPolicy: refundPolicyEnum.optional(),
  images: z.array(z.object({
    imageId: z.string(),
    isPrimary: z.boolean(),
    sortOrder: z.number().int(),
  })).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type Product = z.infer<typeof productSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;