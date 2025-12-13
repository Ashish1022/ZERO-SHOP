export type CategoryThumbnail = {
    filename: string;
    url: string;
} | null;

export type Subcategory = {
    id: string;
    name: string;
    slug: string;
    stats: string;
    featured: boolean;
    thumbnailId: string | null;
    parentId: string | null;
    description: string | null;
    updatedAt: string;
    productCount: number;
    thumbnail: CategoryThumbnail;
};

export type Category = {
    id: string;
    name: string;
    slug: string;
    stats: string;
    featured: boolean;
    thumbnailId: string | null;
    parentId: string | null;
    description: string | null;
    updatedAt: string;
    productCount: number;
    thumbnail: CategoryThumbnail;
    subcategories: Subcategory[];
};

export type CategoryResult = {
    data: Category[];
    hasNextPage: boolean;
    nextCursor: {
        id: string;
        updatedAt: string;
    } | null;
    totalDocs: number;
};