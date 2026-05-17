import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";
import { ReviewsView } from "@/modules/reviews/ui/views/reviews-view";

const ReviewsPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.reviews.getAll.infiniteQueryOptions({})
  );
  void queryClient.prefetchQuery(trpc.reviews.getAdminStats.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin h-4 w-4" />
          </div>
        }
      >
        <ReviewsView />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ReviewsPage;
