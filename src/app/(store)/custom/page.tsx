import type { Metadata } from "next";

import { CustomView } from "@/modules/store/ui/views/custom-view";
import { buildMetadata, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Custom Stickers – Design Your Own Vinyl Sticker",
  description:
    "Create custom vinyl stickers with any design, shape, size, or material. Premium die-cut, holographic, matte, and glossy options. Fast delivery across India.",
  path: "/custom",
  keywords: [
    "custom stickers",
    "design your own sticker",
    "die-cut stickers",
    "holographic stickers",
    "personalized stickers India",
    "custom vinyl sticker maker",
  ],
});

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Custom", path: "/custom" },
]);

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Custom Sticker Printing",
  serviceType: "Custom Vinyl Sticker Printing",
  provider: { "@id": "https://zerostick.shop#organization" },
  areaServed: { "@type": "Country", name: "India" },
  description:
    "Personalized vinyl sticker printing with options for shape, size, material, and finish.",
  offers: {
    "@type": "Offer",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
  },
};

const CustomPage = () => {
  return (
    <>
      <JsonLd id="custom-breadcrumbs" data={breadcrumbs} />
      <JsonLd
        id="custom-webpage"
        data={webPageJsonLd({
          name: "Custom Stickers",
          description:
            "Design your own vinyl sticker with premium materials and finishes.",
          path: "/custom",
          breadcrumb: breadcrumbs,
        })}
      />
      <JsonLd id="custom-service" data={serviceJsonLd} />
      <CustomView />
    </>
  );
};

export default CustomPage;
