import { Suspense } from "react";
import { SearchParams } from "nuqs";

import { loadProductFilters } from "@/modules/products/search-param";
import {
  ProductsView,
  ProductsViewSkeleton,
} from "@/modules/store/ui/views/products-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface Props {
  searchParams: Promise<SearchParams>;
}

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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductsViewSkeleton />}>
        <ProductsView />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ProductsPage;
