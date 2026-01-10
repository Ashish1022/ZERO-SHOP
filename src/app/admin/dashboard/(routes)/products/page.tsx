import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";
import { AdminProductsView } from "@/modules/products/ui/views/admin-products-view";

const AdminProductsPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({})
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <AdminProductsView />
      </Suspense>
    </HydrationBoundary>
  );
};

export default AdminProductsPage;
