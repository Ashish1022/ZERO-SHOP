import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";
import { CouponsView } from "@/modules/coupons/ui/views/coupons-view";

const CouponsPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.coupons.getMany.infiniteQueryOptions({})
  );
  void queryClient.prefetchQuery(trpc.coupons.getStats.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin h-4 w-4" />
          </div>
        }
      >
        <CouponsView />
      </Suspense>
    </HydrationBoundary>
  );
};

export default CouponsPage;
