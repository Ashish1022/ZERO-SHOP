import { Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  const footerLinks = {
    Shop: [
      { label: "All Stickers", href: "/products" },
      { label: "Best Sellers", href: "/products?sort=best-selling" },
      { label: "New Arrivals", href: "/products?sort=newest" },
      { label: "Custom Orders", href: "/custom" },
    ],
    Support: [
      { label: "FAQ", href: "/faq" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Contact Us", href: "/contact" },
    ],
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
    ],
  };

  return (
    <footer className="bg-surface-dark text-surface-dark-foreground py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold tracking-tighter">
              ZERO | STICK<span className="text-muted-foreground">.</span>
            </Link>
            <p className="text-surface-dark-foreground/60 mt-4 text-sm leading-relaxed">
              Premium vinyl stickers for the bold and expressive. Express yourself, one sticker at a time.
            </p>
            <div className="flex gap-4 mt-6">
              <Link
                href="#"
                className="w-10 h-10 rounded-full border border-surface-dark-foreground/20 flex items-center justify-center hover:bg-surface-dark-foreground hover:text-surface-dark transition-all"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full border border-surface-dark-foreground/20 flex items-center justify-center hover:bg-surface-dark-foreground hover:text-surface-dark transition-all"
              >
                <Twitter className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-surface-dark-foreground/60 hover:text-surface-dark-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-surface-dark-foreground/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-dark-foreground/40">
            © 2026 STCKR. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-surface-dark-foreground/40 hover:text-surface-dark-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-surface-dark-foreground/40 hover:text-surface-dark-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
