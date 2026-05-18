import Link from "next/link";
import { Instagram } from "lucide-react";

import { SITE_CONFIG } from "@/constants/site";

const footerLinks: Record<
  string,
  Array<{ label: string; href: string; rel?: string }>
> = {
  Shop: [
    { label: "All Stickers", href: "/products" },
    { label: "Best Sellers", href: "/products?sort=best-selling" },
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Custom Orders", href: "/custom" },
    { label: "Collections", href: "/categories" },
  ],
  Support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Shipping Info", href: "/shipping-policy" },
    { label: "Returns & Refunds", href: "/cancellations-and-refunds" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-and-conditions" },
  ],
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-surface-dark text-surface-dark-foreground py-16 md:py-20"
      role="contentinfo"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-5">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tighter"
              aria-label={`${SITE_CONFIG.name} - Home`}
            >
              ZERO | STICK
              <span className="text-muted-foreground" aria-hidden="true">.</span>
            </Link>
            <p className="text-surface-dark-foreground/60 mt-4 text-sm leading-relaxed max-w-sm">
              Premium vinyl stickers for the bold and expressive. Express
              yourself, one sticker at a time.
            </p>
            <address className="not-italic mt-6 text-sm text-surface-dark-foreground/60 space-y-1">
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="block hover:text-surface-dark-foreground transition-colors"
              >
                {SITE_CONFIG.contact.email}
              </a>
              <a
                href={`tel:${SITE_CONFIG.contact.phone.replace(/\s+/g, "")}`}
                className="block hover:text-surface-dark-foreground transition-colors"
              >
                {SITE_CONFIG.contact.phone}
              </a>
            </address>
            <div className="flex gap-4 mt-6">
              <Link
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer me"
                className="w-10 h-10 rounded-full border border-surface-dark-foreground/20 flex items-center justify-center hover:bg-surface-dark-foreground hover:text-surface-dark transition-all"
                aria-label="Follow ZERO | STICK on Instagram"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <nav
            className="md:col-span-7 grid grid-cols-2 gap-8 md:gap-12"
            aria-label="Footer"
          >
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h2 className="font-semibold text-sm uppercase tracking-wider mb-4">
                  {title}
                </h2>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-surface-dark-foreground/60 hover:text-surface-dark-foreground transition-colors text-sm"
                        {...(link.rel ? { rel: link.rel } : {})}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="border-t border-surface-dark-foreground/10 mt-16 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-surface-dark-foreground/40">
              © {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy-policy"
                className="text-sm text-surface-dark-foreground/40 hover:text-surface-dark-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="text-sm text-surface-dark-foreground/40 hover:text-surface-dark-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
