import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";
import { AnalyticsView } from "@/modules/analytics/ui/views/analytics-view";

const AnalyticsPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.analytics.getOverview.queryOptions({ range: "30d" })
  );
  void queryClient.prefetchQuery(
    trpc.analytics.getRevenueTrend.queryOptions({ range: "30d" })
  );
  void queryClient.prefetchQuery(
    trpc.analytics.getTopProducts.queryOptions({ limit: 5 })
  );
  void queryClient.prefetchQuery(
    trpc.analytics.getOrderStatusBreakdown.queryOptions()
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
        <AnalyticsView />
      </Suspense>
    </HydrationBoundary>
  );
};

export default AnalyticsPage;
