import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  HeroItemGridSkeleton,
  HeroItemGridView,
} from "@/modules/store/ui/views/hero-item-grid-view";
import { Suspense } from "react";
import { CarouselView, CarouselViewSkeleton } from "@/modules/store/ui/views/carousel-view";

export const metadata = {
  description:
    "Buy high-quality anime, aesthetic, gaming, and custom stickers. Perfect for laptops, phones, and more. Fast shipping & secure checkout!",
  openGraph: {
    type: "website",
  },
};

const page = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.products.getFeatured.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<HeroItemGridSkeleton />}>
        <HeroItemGridView />
      </Suspense>
      <Suspense fallback={<CarouselViewSkeleton />}>
        <CarouselView />
      </Suspense>
    </HydrationBoundary>
  );
};

export default page;
