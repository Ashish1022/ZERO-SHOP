import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ZERO | STICK – Anime, Custom & Aesthetic Stickers",
    template: "%s | ZERO | STICK",
  },
  description:
    "Shop premium anime, custom, and aesthetic stickers at ZERO | STICK. Perfect for laptops, mobiles, bottles, and notebooks. Fast delivery across India.",

  keywords: [
    "anime stickers",
    "custom stickers",
    "vinyl stickers",
    "laptop stickers",
    "mobile stickers",
    "sticker store India",
    "ZERO STICK",
  ],

  metadataBase: new URL("https://zerostick.shop"),

  openGraph: {
    title: "ZERO | STICK – Premium Stickers for Everything You Love",
    description:
      "Discover high-quality anime and custom stickers designed to stick anywhere. Express yourself with ZERO | STICK.",
    url: "https://zerostick.shop",
    siteName: "ZERO | STICK",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://zerostick.shop/hero-stickers.jpg",
        width: 1200,
        height: 630,
        alt: "ZERO | STICK – Stickers for Everything You Love",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ZERO | STICK – Anime & Custom Stickers",
    description:
      "Premium anime and custom stickers for laptops, mobiles, bottles & more. Shop now at ZERO | STICK.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          <TRPCReactProvider>
            {children}
            <Toaster />
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
