import { AdminProductView } from "@/modules/products/ui/views/admin-create-product";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

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
      limit: 100,
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
