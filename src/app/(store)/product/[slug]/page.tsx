import { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  ProductView,
  ProductViewSkeleton,
} from "@/modules/store/ui/views/product-view";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const queryClient = getQueryClient();
    const product = await queryClient.fetchQuery(
      trpc.products.getOne.queryOptions({ slug: slug })
    );

    const primaryImage =
      product.images?.find((img) => img.isPrimary)?.url ||
      product.images?.[0]?.url;

    return {
      title: `${product.name} | Your Store Name`,
      description:
        product.description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
        `Buy ${product.name} at the best price`,
      openGraph: {
        title: product.name,
        description: product.description?.replace(/<[^>]*>/g, "").slice(0, 160),
        images: primaryImage ? [{ url: primaryImage, alt: product.name }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description?.replace(/<[^>]*>/g, "").slice(0, 160),
        images: primaryImage ? [primaryImage] : [],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    return {
      title: "Product | Your Store Name",
      description: "Browse our collection of quality products",
    };
  }
}

const ProductPage = async ({ params }: Props) => {
  const { slug } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getOne.queryOptions({ slug: slug })
  );
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({ limit: 10 })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView slug={slug} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ProductPage;
