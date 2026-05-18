export const SITE_CONFIG = {
    name: "ZERO | STICK",
    shortName: "ZeroStick",
    legalName: "ZERO | STICK",
    url: "https://zerostick.shop",
    locale: "en_IN",
    language: "en",
    country: "IN",
    currency: "INR",
    description:
        "Shop premium anime, custom, and aesthetic stickers at ZERO | STICK. Vinyl stickers for laptops, mobiles, bottles, and notebooks. Fast delivery across India.",
    tagline: "Anime, Custom & Aesthetic Stickers",
    ogImage: "/opengraph-image",
    keywords: [
        "anime stickers",
        "custom stickers",
        "vinyl stickers",
        "laptop stickers",
        "mobile stickers",
        "kawaii stickers",
        "gaming stickers",
        "holographic stickers",
        "aesthetic stickers",
        "sticker store India",
        "ZERO STICK",
    ],
    social: {
        instagram: "https://www.instagram.com/zerostickk/",
        instagramHandle: "@zerostickk",
        twitter: "",
        twitterHandle: "",
    },
    contact: {
        email: "support@zerostick.shop",
        phone: "+91 98765 43210",
        addressLocality: "Bangalore",
        addressRegion: "KA",
        postalCode: "560034",
        streetAddress: "123 Sticker Street, Koramangala, 4th Block",
    },
} as const;

export const absoluteUrl = (path: string = "/"): string => {
    if (!path) return SITE_CONFIG.url;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${SITE_CONFIG.url}${path.startsWith("/") ? path : `/${path}`}`;
};
