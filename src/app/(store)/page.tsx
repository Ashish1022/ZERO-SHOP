import { HeroSection } from "@/modules/store/ui/sections/hero";
import { Categories } from "@/modules/store/ui/sections/categories";
import { Newsletter } from "@/modules/store/ui/sections/news-letter";
import { FeatureStrip } from "@/modules/store/ui/sections/feature-strip";
import { FeaturedStickers, FeaturedStickersSkeleton } from "@/modules/store/ui/sections/featured-stickers";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

const page = () => {
  const queryClient = getQueryClient()
  void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({ limit: 6 }))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HeroSection />
      <FeatureStrip />
      <Suspense fallback={<FeaturedStickersSkeleton />}>
        <FeaturedStickers />
      </Suspense>
      <Categories />
      <Newsletter />
    </HydrationBoundary>
  );
};

export default page;
