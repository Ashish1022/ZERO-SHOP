import { Suspense } from "react";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { loadProductFilters } from "@/modules/products/search-param";
import {
  ProductsView,
  ProductsViewSkeleton,
} from "@/modules/store/ui/views/products-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { buildMetadata, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = buildMetadata({
  title: "Shop All Stickers – Anime, Custom & Aesthetic Designs",
  description:
    "Browse our entire collection of premium vinyl stickers. Anime, kawaii, gaming, and custom designs perfect for laptops, phones, water bottles, and more.",
  path: "/products",
  keywords: [
    "buy stickers online",
    "sticker shop India",
    "anime stickers",
    "vinyl stickers",
    "kawaii stickers",
    "gaming stickers",
    "laptop stickers",
  ],
});

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Shop", path: "/products" },
]);

const ProductsPage = async ({ searchParams }: Props) => {
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({ ...filters })
  );
  void queryClient.prefetchInfiniteQuery(
    trpc.categories.getMany.infiniteQueryOptions({})
  );

  return (
    <>
      <JsonLd id="products-breadcrumbs" data={breadcrumbs} />
      <JsonLd
        id="products-webpage"
        data={webPageJsonLd({
          name: "Shop All Stickers",
          description:
            "Browse our complete catalog of premium vinyl stickers at ZERO | STICK.",
          path: "/products",
          breadcrumb: breadcrumbs,
        })}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductsViewSkeleton />}>
          <ProductsView />
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default ProductsPage;
