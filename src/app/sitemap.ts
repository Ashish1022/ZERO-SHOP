import { MetadataRoute } from 'next'
import { getQueryClient, trpc } from "@/trpc/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const queryClient = getQueryClient();

    const products = await queryClient.fetchInfiniteQuery(
        trpc.products.getMany.infiniteQueryOptions({})
    );

    const productUrls = products.pages.flatMap((page) => 
        page.data.map((product) => ({
            url: `https://zerostick.shop/products/${product.slug}`,
            lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))
    );

    return [
        {
            url: 'https://zerostick.shop',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://zerostick.shop/products',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...productUrls,
    ];
}