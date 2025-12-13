"use client";

import { ProductForm } from "../components/product-form";
import { useTRPC } from "@/trpc/client";
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const AdminProductView = ({ productId }: { productId: string }) => {
  const trpc = useTRPC();

  const { data: product } =
    productId !== "new"
      ? useSuspenseQuery(
          trpc.products.getOne.queryOptions({ productId: productId })
        )
      : { data: null };

  const { data: categories } = useSuspenseInfiniteQuery(
    trpc.categories.getMany.infiniteQueryOptions(
      { limit: 10 },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      }
    )
  );

  const flattened = categories.pages.flatMap((page) => page.data);

  const allCategories: Array<{ id: string; name: string }> = [];

  flattened.forEach((category) => {
    allCategories.push({
      id: category.id,
      name: category.name,
    });

    category.subcategories?.forEach((subcat) => {
      allCategories.push({
        id: subcat.id,
        name: `  ${subcat.name}`,
      });
    });
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 pt-6">
        <ProductForm
          initialData={product}
          images={product?.images || []}
          categories={allCategories}
        />
      </div>
    </div>
  );
};
