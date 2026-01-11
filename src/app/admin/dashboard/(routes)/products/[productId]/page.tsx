import { Suspense } from "react";
import { Loader2 } from "lucide-react";

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
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin h-4 w-4" />
          </div>
        }
      >
        <AdminProductView productId={productId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default AdminProductPage;
