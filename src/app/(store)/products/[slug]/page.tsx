import type { Metadata } from "next";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProductView } from "@/modules/store/ui/views/product-view";
import { Suspense } from "react";
import { ProductViewSkeleton } from "@/modules/store/ui/components/product/skeleton";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const queryClient = getQueryClient();

  const product = await queryClient.fetchQuery(
    trpc.products.getOne.queryOptions({ slug })
  );

  return {
    title: product.seoTitle || `${product.name} | Your Store`,
    description: product.seoDescription || product.description || undefined,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
      images: product.images[0]
        ? [
            {
              url: product.images[0].url,
              alt: product.images[0].alt || product.name,
            },
          ]
        : [],
    },
  };
}

const ProductPage = async ({ params }: Props) => {
  const { slug } = await params;
  const queryClient = getQueryClient();

  const product = await queryClient.fetchQuery(
    trpc.products.getOne.queryOptions({ slug })
  );

  void Promise.allSettled([
    queryClient.prefetchQuery(
      trpc.reviews.getProductStats.queryOptions({ productId: product.id })
    ),
    queryClient.prefetchQuery(
      trpc.reviews.getByProduct.queryOptions({
        productId: product.id,
        limit: 6,
        status: "approved",
      })
    ),
    queryClient.prefetchQuery(
      trpc.products.getRelated.queryOptions({
        productId: product.id,
        categoryId: product.categoryId,
        limit: 4,
      })
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView slug={slug} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ProductPage;

export const revalidate = 3600;
export const dynamicParams = true;
