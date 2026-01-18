import type { Metadata } from "next";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProductView } from "@/modules/store/ui/views/product-view";
import { Suspense } from "react";
import { ProductViewSkeleton } from "@/modules/store/ui/components/product/skeleton";

interface Props {
  params: Promise<{ slug: string }>;
}

function getAbsoluteUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (url.includes('cloudinary.com')) {
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        return `${parts[0]}/upload/f_jpg,q_75,fl_progressive/${parts[1]}`;
      }
    }
    return url;
  }
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  return `https://zerostick.shop/${cleanUrl}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const queryClient = getQueryClient();

  try {
    const product = await queryClient.fetchQuery(
      trpc.products.getOne.queryOptions({ slug })
    );

    const canonicalUrl = `https://zerostick.shop/products/${slug}`;

    const primaryImage = product.images[0];
    const imageUrl = primaryImage ? getAbsoluteUrl(primaryImage.url) : null;

    return {
      title: product.seoTitle || `${product.name} - Premium Quality Stickers | ZERO | STICK`,
      description: product.seoDescription || product.description || undefined,
      openGraph: {
        type: "website",
        url: canonicalUrl,
        title: product.seoTitle || `${product.name} - Shop Premium Stickers Online | ZERO | STICK`,
        description: product.description || undefined,
        siteName: "ZERO | STICK",
        images: imageUrl
          ? [
            {
              url: imageUrl,
              secureUrl: imageUrl,
              width: 1200,
              height: 630,
              alt: primaryImage.alt || product.name,
            },
          ]
          : [],
        locale: "en_IN",
      },
      twitter: {
        card: "summary_large_image",
        title: product.seoTitle || `${product.name} - Buy Premium Stickers | ZERO | STICK`,
        description: product.seoDescription || product.description || undefined,
        images: imageUrl ? [imageUrl] : [],
      },
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      ...(product.updatedAt && {
        other: {
          "article:modified_time": new Date(product.updatedAt).toISOString(),
        },
      }),
    };
  } catch (error) {
    return {
      title: "Product Not Found | Your Store Name",
      description: "The product you're looking for could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
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
  const absoluteImages = product.images.map(img => getAbsoluteUrl(img.url));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: absoluteImages,
    brand: {
      "@type": "Brand",
      name: "ZERO | STICK",
    },
    ...(product.price && {
      offers: {
        "@type": "Offer",
        price: Number(product.price).toFixed(2),
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: `https://zerostick.shop/products/${slug}`,
        priceValidUntil: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HydrationBoundary state={dehydrate(queryClient)} >
        <Suspense fallback={<ProductViewSkeleton />}>
          <ProductView slug={slug} />
        </Suspense>
      </HydrationBoundary >
    </>
  );
};

export default ProductPage;

export const revalidate = 3600;
export const dynamicParams = true;
