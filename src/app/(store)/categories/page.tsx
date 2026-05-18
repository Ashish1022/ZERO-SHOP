import type { Metadata } from "next";

import { buildMetadata, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import CategoriesClient from "./categories-client";

export const metadata: Metadata = buildMetadata({
  title: "Sticker Collections – Anime, Kawaii, Gaming, Travel & More",
  description:
    "Explore curated sticker collections at ZERO | STICK. From anime and kawaii to gaming, travel, nature, and abstract designs, find the perfect category for your style.",
  path: "/categories",
  keywords: [
    "sticker collections",
    "anime sticker collection",
    "kawaii sticker pack",
    "gaming stickers",
    "travel stickers",
    "nature stickers",
    "abstract stickers",
  ],
});

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Collections", path: "/categories" },
]);

const CategoriesPage = () => {
  return (
    <>
      <JsonLd id="categories-breadcrumbs" data={breadcrumbs} />
      <JsonLd
        id="categories-webpage"
        data={webPageJsonLd({
          name: "Sticker Collections",
          description:
            "Explore curated sticker collections – anime, kawaii, gaming, travel, nature, and abstract designs.",
          path: "/categories",
          breadcrumb: breadcrumbs,
        })}
      />
      <CategoriesClient />
    </>
  );
};

export default CategoriesPage;
