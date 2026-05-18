import type { Metadata } from "next";

import { SITE_CONFIG, absoluteUrl } from "@/constants/site";

type Robots = NonNullable<Metadata["robots"]>;

const DEFAULT_ROBOTS: Robots = {
    index: true,
    follow: true,
    googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
    },
};

const NOINDEX_ROBOTS: Robots = {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
    },
};

export type BuildMetadataInput = {
    title?: string;
    description?: string;
    path?: string;
    images?: Array<string | { url: string; alt?: string; width?: number; height?: number }>;
    keywords?: string[];
    noIndex?: boolean;
    type?: "website" | "article" | "product";
    modifiedTime?: string | Date;
    publishedTime?: string | Date;
};

export const transformCloudinaryUrl = (url: string): string => {
    if (!url) return url;
    if (url.includes("cloudinary.com") && url.includes("/upload/")) {
        const parts = url.split("/upload/");
        if (parts.length === 2 && !parts[1].startsWith("f_")) {
            return `${parts[0]}/upload/f_auto,q_auto,fl_progressive/${parts[1]}`;
        }
    }
    return url;
};

export const toAbsoluteImageUrl = (url: string): string => {
    if (!url) return absoluteUrl(SITE_CONFIG.ogImage);
    const transformed = transformCloudinaryUrl(url);
    if (transformed.startsWith("http://") || transformed.startsWith("https://")) {
        return transformed;
    }
    return absoluteUrl(transformed);
};

export const buildMetadata = ({
    title,
    description,
    path = "/",
    images,
    keywords,
    noIndex = false,
    type = "website",
    modifiedTime,
    publishedTime,
}: BuildMetadataInput = {}): Metadata => {
    const resolvedTitle = title || `${SITE_CONFIG.name} – ${SITE_CONFIG.tagline}`;
    const resolvedDescription = description || SITE_CONFIG.description;
    const canonicalUrl = absoluteUrl(path);

    const normalizedImages = (
        images && images.length > 0
            ? images
            : [{ url: SITE_CONFIG.ogImage, alt: resolvedTitle, width: 1200, height: 630 }]
    ).map((img) => {
        if (typeof img === "string") {
            return {
                url: toAbsoluteImageUrl(img),
                alt: resolvedTitle,
                width: 1200,
                height: 630,
            };
        }
        return {
            url: toAbsoluteImageUrl(img.url),
            alt: img.alt || resolvedTitle,
            width: img.width ?? 1200,
            height: img.height ?? 630,
        };
    });

    return {
        title,
        description: resolvedDescription,
        keywords: keywords && keywords.length > 0 ? keywords : undefined,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            type: type === "product" ? "website" : type,
            url: canonicalUrl,
            title: resolvedTitle,
            description: resolvedDescription,
            siteName: SITE_CONFIG.name,
            locale: SITE_CONFIG.locale,
            images: normalizedImages,
            ...(modifiedTime
                ? { modifiedTime: new Date(modifiedTime).toISOString() }
                : {}),
            ...(publishedTime
                ? { publishedTime: new Date(publishedTime).toISOString() }
                : {}),
        },
        twitter: {
            card: "summary_large_image",
            title: resolvedTitle,
            description: resolvedDescription,
            images: normalizedImages.map((i) => i.url),
            ...(SITE_CONFIG.social.twitterHandle
                ? { creator: SITE_CONFIG.social.twitterHandle, site: SITE_CONFIG.social.twitterHandle }
                : {}),
        },
        robots: noIndex ? NOINDEX_ROBOTS : DEFAULT_ROBOTS,
    };
};

export const breadcrumbJsonLd = (
    items: Array<{ name: string; path: string }>
) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
    })),
});

export const organizationJsonLd = () => ({
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": `${SITE_CONFIG.url}#organization`,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: SITE_CONFIG.url,
    logo: absoluteUrl("/logo/logo.png"),
    image: absoluteUrl("/hero-stickers.jpg"),
    description: SITE_CONFIG.description,
    email: SITE_CONFIG.contact.email,
    telephone: SITE_CONFIG.contact.phone,
    address: {
        "@type": "PostalAddress",
        streetAddress: SITE_CONFIG.contact.streetAddress,
        addressLocality: SITE_CONFIG.contact.addressLocality,
        addressRegion: SITE_CONFIG.contact.addressRegion,
        postalCode: SITE_CONFIG.contact.postalCode,
        addressCountry: SITE_CONFIG.country,
    },
    sameAs: [SITE_CONFIG.social.instagram].filter(Boolean),
    areaServed: {
        "@type": "Country",
        name: "India",
    },
    currenciesAccepted: SITE_CONFIG.currency,
    paymentAccepted: "Credit Card, Debit Card, UPI, Net Banking, Razorpay",
});

export const websiteJsonLd = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.url}#website`,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    inLanguage: SITE_CONFIG.locale.replace("_", "-"),
    publisher: { "@id": `${SITE_CONFIG.url}#organization` },
    potentialAction: {
        "@type": "SearchAction",
        target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_CONFIG.url}/products?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
    },
});

export const webPageJsonLd = ({
    name,
    description,
    path,
    breadcrumb,
}: {
    name: string;
    description: string;
    path: string;
    breadcrumb?: ReturnType<typeof breadcrumbJsonLd>;
}) => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: SITE_CONFIG.locale.replace("_", "-"),
    isPartOf: { "@id": `${SITE_CONFIG.url}#website` },
    ...(breadcrumb ? { breadcrumb } : {}),
});
