import z from "zod";

export const categoryStatusEnum = z.enum(['draft', 'active', 'inactive']);

export const categoriesSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, "Category name is required").max(255),
    slug: z.string().min(1, "Slug is required").max(255),
    description: z.string().optional().nullable(),
    status: categoryStatusEnum.default('active'),
    featured: z.boolean().default(false),
    sortOrder: z.number().int().min(0).default(0),
    parentId: z.string().uuid().optional().nullable(),
    thumbnailId: z.string().optional().nullable(),
    seoTitle: z.string().max(255).optional().nullable(),
    seoDescription: z.string().optional().nullable(),
    seoKeywords: z.string().max(500).optional().nullable(),
    deletedAt: z.date().optional().nullable(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export const createCategorySchema = z.object({
    name: z.string().min(1, "Category name is required").max(255),
    slug: z.string().min(1, "Slug is required").max(255),
    description: z.string().optional().nullable(),
    status: categoryStatusEnum.optional(),
    featured: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
    parentId: z.string().uuid().optional().nullable(),
    thumbnailId: z.string().optional().nullable(),
    seoTitle: z.string().max(255).optional().nullable(),
    seoDescription: z.string().optional().nullable(),
    seoKeywords: z.string().max(500).optional().nullable(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type Category = z.infer<typeof categoriesSchema>;
export type CreateCategory = z.infer<typeof createCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;