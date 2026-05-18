import { Suspense } from "react";
import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { HeroSection } from "@/modules/store/ui/sections/hero";
import { Categories } from "@/modules/store/ui/sections/categories";
import { Newsletter } from "@/modules/store/ui/sections/news-letter";
import { FeatureStrip } from "@/modules/store/ui/sections/feature-strip";
import {
  FeaturedStickers,
  FeaturedStickersSkeleton,
} from "@/modules/store/ui/sections/featured-stickers";
import { getQueryClient, trpc } from "@/trpc/server";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";
import { SITE_CONFIG } from "@/constants/site";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = buildMetadata({
  title: `${SITE_CONFIG.name} – ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  path: "/",
  keywords: [...SITE_CONFIG.keywords],
});

const Page = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({ limit: 6 })
  );

  return (
    <>
      <JsonLd
        id="home-webpage"
        data={webPageJsonLd({
          name: `${SITE_CONFIG.name} – ${SITE_CONFIG.tagline}`,
          description: SITE_CONFIG.description,
          path: "/",
        })}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HeroSection />
        <FeatureStrip />
        <Suspense fallback={<FeaturedStickersSkeleton />}>
          <FeaturedStickers />
        </Suspense>
        <Categories />
        <Newsletter />
      </HydrationBoundary>
    </>
  );
};

export default Page;
