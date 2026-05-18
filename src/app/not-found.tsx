import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: true,
      noimageindex: true,
    },
  },
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-muted px-4"
    >
      <div className="text-center max-w-md">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Error 404
        </p>
        <h1 className="mt-2 mb-4 text-4xl md:text-5xl font-bold tracking-tight">
          Page not found
        </h1>
        <p className="mb-8 text-muted-foreground">
          The page you are looking for may have been removed or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Return Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
          >
            Shop Stickers
          </Link>
        </div>
      </div>
    </main>
  );
}
