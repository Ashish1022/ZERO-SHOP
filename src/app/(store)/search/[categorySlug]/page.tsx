import { CategoryView } from "@/modules/store/ui/views/category-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const queryClient = getQueryClient();

  try {
    const categoryData = await queryClient.fetchInfiniteQuery(
      trpc.categories.getMany.infiniteQueryOptions({
        slug: params.categorySlug,
      })
    );

    const category = categoryData.pages
      .flatMap((page) => page.data || [])
      .find((cat) => cat.slug === params.categorySlug);

    return {
      title: category?.name || params.categorySlug.replace(/-/g, " "),
      description:
        category?.description ||
        `Browse ${
          category?.name || params.categorySlug.replace(/-/g, " ")
        } products`,
    };
  } catch (error) {
    return {
      title: params.categorySlug?.replace(/-/g, " ") || "Category",
      description: `Browse ${
        params.categorySlug?.replace(/-/g, " ") || "category"
      } products`,
    };
  }
}

interface Props {
  params: Promise<{ categorySlug: string }>;
}

const CategoryPage = async ({ params }: Props) => {
  const queryClient = getQueryClient();
  const { categorySlug } = await params;

  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      categorySlug: categorySlug,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<CategoryViewSkeleton />}>
        <CategoryView categorySlug={categorySlug} />
      </Suspense>
    </HydrationBoundary>
  );
};

function CategoryViewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-2" />
        <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
