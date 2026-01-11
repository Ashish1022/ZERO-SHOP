import { Suspense } from "react";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AdminCategoryView } from "@/modules/categories/ui/views/admin-create-category";

interface Props {
  params: Promise<{ categoryId: string }>;
}

const AdminCategoryPage = async ({ params }: Props) => {
  const { categoryId } = await params;
  const queryClient = getQueryClient();

  if (categoryId !== "new") {
    void queryClient.prefetchQuery(
      trpc.categories.getOne.queryOptions({ categoryId: categoryId })
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <AdminCategoryView categoryId={categoryId}/>
      </Suspense>
    </HydrationBoundary>
  );
};

export default AdminCategoryPage;
