import Link from "next/link";
import { Suspense } from "react";

import { Instagram } from "lucide-react";

import { MobileMenu } from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

import { Button } from "@/components/ui/button";
import LogoSquare from "@/components/logo-square";
import { CartModal } from "@/modules/store/lib/cart/modal";

const { SITE_NAME } = process.env;

export async function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex md:hidden">
          <Suspense fallback={null}>
            <MobileMenu />
          </Suspense>
        </div>

        <div className="flex items-center">
          <Link
            href="/"
            prefetch={true}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <LogoSquare />
            <span className="hidden text-sm font-semibold uppercase tracking-tight sm:inline-block lg:inline-block">
              {SITE_NAME}
            </span>
          </Link>
        </div>

        <div className="hidden flex-1 justify-center px-4 md:flex lg:px-6">
          <div className="w-full max-w-md">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            asChild
          >
            <Link
              href="https://www.instagram.com/zerostickk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="h-5 w-5" />
            </Link>
          </Button>
          <CartModal />
        </div>
      </div>
    </nav>
  );
}
