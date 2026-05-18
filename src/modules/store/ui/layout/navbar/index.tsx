"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";

import { CartDrawer } from "../../components/cart-drawer";

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); 

  const cart = useCart();

  const navLinks = [
    { name: "Shop", href: "/products" },
    { name: "Collections", href: "/categories" },
    { name: "Custom", href: "/custom" },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
        role="banner"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link
              href="/"
              className="text-xl md:text-2xl font-bold tracking-tighter"
              aria-label="ZERO | STICK - Home"
            >
              ZERO | STICK<span className="text-muted-foreground" aria-hidden="true">.</span>
            </Link>

            <nav
              className="hidden md:flex items-center gap-8"
              aria-label="Primary"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
                aria-label={`Open shopping cart, ${cart.totalQuantity} item${cart.totalQuantity === 1 ? "" : "s"}`}
              >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                <span
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-foreground text-background text-xs flex items-center justify-center"
                  aria-hidden="true"
                >
                  {cart.totalQuantity > 9 ? "9+" : cart.totalQuantity}
                </span>
              </Button>
              <Button
                variant="default"
                size="sm"
                className="hidden md:inline-flex"
              >
                Get Started
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-nav"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>

          {isMenuOpen && (
            <div
              id="mobile-nav"
              className="md:hidden py-4 border-t border-border animate-fade-up"
            >
              <nav className="flex flex-col gap-4" aria-label="Mobile">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Button variant="default" className="mt-2">
                  Get Started
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
    </>
  );
};
