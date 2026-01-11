"use client";

import { CategoryForm } from "../components/category-form";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const AdminCategoryView = ({ categoryId }: { categoryId: string }) => {
  const trpc = useTRPC();

  const { data: category } =
    categoryId !== "new"
      ? useSuspenseQuery(
          trpc.categories.getOne.queryOptions({ categoryId: categoryId })
        )
      : { data: null };

  const { data: allCategories } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions({
      limit: 10, 
    })
  );

  const categoriesList = allCategories?.data.flatMap((cat) => [
    { id: cat.id, name: cat.name },
    ...(cat.subcategories?.map((sub) => ({ 
      id: sub.id, 
      name: `${cat.name} > ${sub.name}` 
    })) || [])
  ]) || [];

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 pt-6">
        <CategoryForm
          initialData={category}
          categories={categoriesList}
        />
      </div>
    </div>
  );
};