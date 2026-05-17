import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";
import { PaymentsView } from "@/modules/payments/ui/views/payments-view";

const PaymentsPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.payments.getMany.infiniteQueryOptions({})
  );
  void queryClient.prefetchQuery(trpc.payments.getStats.queryOptions());
  void queryClient.prefetchQuery(trpc.payments.getMethodBreakdown.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin h-4 w-4" />
          </div>
        }
      >
        <PaymentsView />
      </Suspense>
    </HydrationBoundary>
  );
};

export default PaymentsPage;
