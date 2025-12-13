import { SearchView } from "@/modules/store/ui/views/search-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React, { Suspense } from "react";

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

interface Props {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const SearchPage = async ({ searchParams }: Props) => {
  const queryClient = getQueryClient();

  const params = await searchParams;
  const { q: searchValue } = params as { [key: string]: string };

  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({ q: searchValue })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <SearchView searchValue={searchValue} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default SearchPage;
