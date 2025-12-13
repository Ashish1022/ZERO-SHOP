"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import Grid from "../components/grid";
import ProductGridItems from "../components/product-grid-items";

export const SearchView = ({ searchValue }: { searchValue: string }) => {
  const trpc = useTRPC();
  const observerTarget = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        { q: searchValue },
        {
          getNextPageParam: (lastpage) => {
            return lastpage.nextCursor;
          },
        }
      )
    );

  const products = data.pages.flatMap((page) => page.data || []);
  const resultsText = products.length === 1 ? "result" : "results";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="space-y-6">
      {searchValue ? (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4">
                <svg
                  className="w-8 h-8 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                No products found
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                No results for{" "}
                <span className="font-medium">"{searchValue}"</span>
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                Try adjusting your search terms
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Showing results for
                </p>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mt-0.5">
                  "{searchValue}"
                </h2>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {products.length} {resultsText}
                </p>
                {hasNextPage && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    More available
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {products.length > 0 ? (
        <>
          <Grid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            <ProductGridItems products={products} />
          </Grid>

          <div ref={observerTarget} className="flex justify-center py-8">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <div className="w-4 h-4 border-2 border-neutral-300 dark:border-neutral-600 border-t-neutral-900 dark:border-t-neutral-100 rounded-full animate-spin" />
                <span>Loading more...</span>
              </div>
            )}
            {!hasNextPage && products.length > 0 && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                End of results
              </p>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};
