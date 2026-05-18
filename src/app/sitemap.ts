import type { MetadataRoute } from "next";

import { getQueryClient, trpc } from "@/trpc/server";
import { SITE_CONFIG, absoluteUrl } from "@/constants/site";

type SitemapEntry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: SitemapEntry[] = [
    {
        url: SITE_CONFIG.url,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
    },
    {
        url: absoluteUrl("/products"),
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
    },
    {
        url: absoluteUrl("/categories"),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
    },
    {
        url: absoluteUrl("/custom"),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
    },
    {
        url: absoluteUrl("/contact"),
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.5,
    },
    {
        url: absoluteUrl("/shipping-policy"),
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.3,
    },
    {
        url: absoluteUrl("/cancellations-and-refunds"),
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.3,
    },
    {
        url: absoluteUrl("/privacy-policy"),
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.3,
    },
    {
        url: absoluteUrl("/terms-and-conditions"),
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.3,
    },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const queryClient = getQueryClient();

    let productEntries: SitemapEntry[] = [];

    try {
        const products = await queryClient.fetchInfiniteQuery(
            trpc.products.getMany.infiniteQueryOptions({})
        );

        productEntries = products.pages.flatMap((page) =>
            page.data.map<SitemapEntry>((product) => ({
                url: absoluteUrl(`/products/${product.slug}`),
                lastModified: product.updatedAt
                    ? new Date(product.updatedAt)
                    : new Date(),
                changeFrequency: "weekly",
                priority: 0.8,
                images: product.primaryImage?.url
                    ? [product.primaryImage.url]
                    : undefined,
            }))
        );
    } catch (error) {
        console.error("[sitemap] Failed to fetch products:", error);
    }

    return [...STATIC_ROUTES, ...productEntries];
}
