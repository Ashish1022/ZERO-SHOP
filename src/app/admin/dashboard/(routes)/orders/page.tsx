import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { getQueryClient, trpc } from "@/trpc/server";
import { OrdersView } from "@/modules/orders/ui/views/orders-view";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const OrdersPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.orders.getMany.infiniteQueryOptions({})
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
        <OrdersView />
      </Suspense>
    </HydrationBoundary>
  );
};

export default OrdersPage;
