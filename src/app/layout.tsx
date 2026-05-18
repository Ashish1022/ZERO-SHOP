import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import { Space_Grotesk } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

import { TRPCReactProvider } from "@/trpc/client";
import { SITE_CONFIG } from "@/constants/site";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} – ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  category: "shopping",
  keywords: [...SITE_CONFIG.keywords],
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} – Premium Stickers for Everything You Love`,
    description:
      "Discover high-quality anime and custom stickers designed to stick anywhere. Express yourself with ZERO | STICK.",
    locale: SITE_CONFIG.locale,
    images: [
      {
        url: "/hero-stickers.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} – Stickers for Everything You Love`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} – Anime & Custom Stickers`,
    description:
      "Premium anime and custom stickers for laptops, mobiles, bottles & more. Shop now at ZERO | STICK.",
    images: ["/hero-stickers.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/favicon.ico" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={SITE_CONFIG.language} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <JsonLd id="organization" data={organizationJsonLd()} />
        <JsonLd id="website" data={websiteJsonLd()} />
      </head>
      <body className={`${spaceGrotesk.className} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-md"
        >
          Skip to main content
        </a>
        <NuqsAdapter>
          <TRPCReactProvider>
            {children}
            <Toaster />
            <Analytics />
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
