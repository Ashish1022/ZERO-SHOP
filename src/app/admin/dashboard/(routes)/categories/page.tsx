import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";
import { AdminCategoriesView } from "@/modules/categories/ui/views/admin-categories-view";

const AdminCategoriesPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.categories.getMany.infiniteQueryOptions({})
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <AdminCategoriesView />
      </Suspense>
    </HydrationBoundary>
  );
};

export default AdminCategoriesPage;
