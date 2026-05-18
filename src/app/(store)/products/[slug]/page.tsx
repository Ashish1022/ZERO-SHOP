import type { Metadata } from "next";
import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";
import { ProductView } from "@/modules/store/ui/views/product-view";
import { ProductViewSkeleton } from "@/modules/store/ui/components/product/skeleton";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_CONFIG, absoluteUrl } from "@/constants/site";
import { buildMetadata, breadcrumbJsonLd, toAbsoluteImageUrl } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const queryClient = getQueryClient();

  try {
    const product = await queryClient.fetchQuery(
      trpc.products.getOne.queryOptions({ slug })
    );

    const primaryImage = product.images[0];
    const imageUrl = primaryImage ? toAbsoluteImageUrl(primaryImage.url) : undefined;
    const title =
      product.seoTitle ||
      `${product.name} – Premium ${product.category?.name || "Sticker"} | ${SITE_CONFIG.name}`;
    const description =
      product.seoDescription ||
      product.seoDescription ||
      product.description ||
      `Buy ${product.name} – premium vinyl sticker from ${SITE_CONFIG.name}. Fast delivery across India.`;

    return buildMetadata({
      title,
      description,
      path: `/products/${slug}`,
      type: "product",
      modifiedTime: product.updatedAt || undefined,
      images: imageUrl
        ? [{ url: imageUrl, alt: primaryImage?.alt || product.name }]
        : undefined,
    });
  } catch {
    return buildMetadata({
      title: "Product Not Found",
      description: "The product you're looking for could not be found.",
      path: `/products/${slug}`,
      noIndex: true,
    });
  }
}

const ProductPage = async ({ params }: Props) => {
  const { slug } = await params;
  const queryClient = getQueryClient();

  const product = await queryClient.fetchQuery(
    trpc.products.getOne.queryOptions({ slug })
  );

  void Promise.allSettled([
    queryClient.prefetchQuery(
      trpc.reviews.getProductStats.queryOptions({ productId: product.id })
    ),
    queryClient.prefetchQuery(
      trpc.reviews.getByProduct.queryOptions({
        productId: product.id,
        limit: 6,
        status: "approved",
      })
    ),
    queryClient.prefetchQuery(
      trpc.products.getRelated.queryOptions({
        productId: product.id,
        categoryId: product.categoryId,
        limit: 4,
      })
    ),
  ]);

  const canonicalUrl = absoluteUrl(`/products/${slug}`);
  const absoluteImages = product.images.map((img) => toAbsoluteImageUrl(img.url));
  const priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonicalUrl}#product`,
    name: product.name,
    description: product.description || product.seoDescription || undefined,
    image: absoluteImages,
    sku: product.id?.toString(),
    url: canonicalUrl,
    brand: {
      "@type": "Brand",
      name: SITE_CONFIG.name,
    },
    category: product.category?.name,
    ...(product.price && {
      offers: {
        "@type": "Offer",
        price: Number(product.price).toFixed(2),
        priceCurrency: SITE_CONFIG.currency,
        availability: product.quantity
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        url: canonicalUrl,
        priceValidUntil,
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@id": `${SITE_CONFIG.url}#organization` },
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: SITE_CONFIG.country,
          returnPolicyCategory:
            "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: 7,
          returnMethod: "https://schema.org/ReturnByMail",
          returnFees: "https://schema.org/FreeReturn",
        },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: 0,
            currency: SITE_CONFIG.currency,
          },
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: SITE_CONFIG.country,
          },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: 0,
              maxValue: 2,
              unitCode: "DAY",
            },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: 2,
              maxValue: 7,
              unitCode: "DAY",
            },
          },
        },
      },
    }),
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.averageRating,
        reviewCount: product.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    ...(product.category && product.category.name
      ? [
          {
            name: product.category.name,
            path: `/products?category=${product.category.slug ?? product.category.name}`,
          },
        ]
      : []),
    { name: product.name ?? "Product", path: `/products/${slug}` },
  ]);

  return (
    <>
      <JsonLd id={`product-${slug}`} data={productJsonLd} />
      <JsonLd id={`product-breadcrumbs-${slug}`} data={breadcrumbs} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductViewSkeleton />}>
          <ProductView slug={slug} />
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default ProductPage;
