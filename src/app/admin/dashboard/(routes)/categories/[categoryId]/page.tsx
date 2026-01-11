import { Suspense } from "react";
import { Loader2 } from "lucide-react";

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
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin h-4 w-4" />
          </div>
        }
      >
        <AdminCategoryView categoryId={categoryId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default AdminCategoryPage;
