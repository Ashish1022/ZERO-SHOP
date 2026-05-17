import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";
import { ReturnsView } from "@/modules/returns/ui/views/returns-view";

const ReturnsPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.returns.getMany.infiniteQueryOptions({})
  );
  void queryClient.prefetchQuery(trpc.returns.getStats.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin h-4 w-4" />
          </div>
        }
      >
        <ReturnsView />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ReturnsPage;
