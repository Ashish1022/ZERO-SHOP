"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import Grid from "../components/grid";
import ProductGridItems from "../components/product-grid-items";

export const CategoryView = ({ categorySlug }: { categorySlug: string }) => {
  const trpc = useTRPC();
  const observerTarget = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        { categorySlug: categorySlug },
        {
          getNextPageParam: (lastpage) => {
            return lastpage.nextCursor;
          },
        }
      )
    );

  const products = data.pages.flatMap((page) => page.data || []);

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
    <section className="space-y-6">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white capitalize">
          {categorySlug.replace(/-/g, " ")}
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
            No products found
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            This category doesn't have any products yet
          </p>
        </div>
      ) : (
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
      )}
    </section>
  );
};
