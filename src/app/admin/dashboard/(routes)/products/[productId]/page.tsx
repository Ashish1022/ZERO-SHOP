import { Suspense } from "react";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AdminProductView } from "@/modules/products/ui/views/admin-create-product";

interface Props {
  params: Promise<{ productId: string }>;
}

const AdminProductPage = async ({ params }: Props) => {
  const { productId } = await params;
  const queryClient = getQueryClient();

  if (productId !== "new") {
    void queryClient.prefetchQuery(
      trpc.products.getOne.queryOptions({ productId: productId })
    );
  }

  void queryClient.prefetchInfiniteQuery(
    trpc.categories.getMany.infiniteQueryOptions({
      limit: 10,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <AdminProductView productId={productId}/>
      </Suspense>
    </HydrationBoundary>
  );
};

export default AdminProductPage;
