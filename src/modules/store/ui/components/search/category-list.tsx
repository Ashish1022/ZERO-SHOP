"use client";

import FilterList from "../category-filter";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { PathFilterItem } from "../category-filter";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: "active" | "draft" | "inactive";
  featured: boolean;
  sortOrder: number;
  parentId: string | null;
  thumbnailId: string | null;
  subcategories?: Category[];
  [key: string]: any;
};

const CategoryList = () => {
  const trpc = useTRPC();
  const { data: categories } = useSuspenseInfiniteQuery(
    trpc.categories.getMany.infiniteQueryOptions(
      {},
      {
        getNextPageParam: (lastpage) => {
          return lastpage.nextCursor;
        },
      }
    )
  );

  const rawCategories = categories.pages.flatMap(page => page.data || []);

  const transformCategory = (category: Category): PathFilterItem => ({
    label: category.name,
    title: category.name,
    path: `/search/${category.slug}`,
    subcategories: category.subcategories?.map(transformCategory) || []
  });

  const transformedCategories = rawCategories.map(transformCategory);

  return <FilterList list={transformedCategories} title="Categories" />;
};

export const Categories = () => {
  return <CategoryList />;
};