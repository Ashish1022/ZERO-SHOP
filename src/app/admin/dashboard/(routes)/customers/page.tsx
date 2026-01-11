import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";
import { CustomersView } from "@/modules/customers/ui/views/customers-view";

const CustomersPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.customers.getMany.infiniteQueryOptions({})
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
        <CustomersView />
      </Suspense>
    </HydrationBoundary>
  );
};

export default CustomersPage;
