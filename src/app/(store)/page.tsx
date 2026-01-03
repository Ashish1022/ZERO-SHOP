import { HeroSection } from "@/modules/store/ui/sections/hero";
import { Categories } from "@/modules/store/ui/sections/categories";
import { Newsletter } from "@/modules/store/ui/sections/news-letter";
import { FeatureStrip } from "@/modules/store/ui/sections/feature-strip";
import { FeaturedStickers } from "@/modules/store/ui/sections/featured-stickers";

const page = () => {
  return (
    <>
      <HeroSection />
      <FeatureStrip />
      <FeaturedStickers />
      <Categories />
      <Newsletter />
    </>
  );
};

export default page;
