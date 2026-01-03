"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const HeroSection = () => {
  const router = useRouter();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-dark text-surface-dark-foreground">
      <div className="absolute inset-0">
        <Image
          src="/hero-stickers.jpg"
          alt="Premium sticker collection"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-t from-surface-dark via-surface-dark/60 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-surface-dark-foreground/20 bg-surface-dark-foreground/5 mb-8 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-surface-dark-foreground opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-surface-dark-foreground" />
            </span>
            <span className="text-sm font-medium">
              New Collection Available
            </span>
          </div>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter mb-6 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Stick Your
            <br />
            <span className="text-muted-foreground">Personality</span>
          </h1>

          <p
            className="text-lg md:text-xl text-surface-dark-foreground/70 max-w-xl mx-auto mb-10 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            Premium vinyl stickers for the bold and expressive. Anime, pop
            culture, and custom designs that speak louder than words.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              variant="hero"
              size="xl"
              className="group bg-black"
              onClick={() => router.push("/categories")}
            >
              Shop Collection
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button variant="hero-outline" size="xl">
              Custom Orders
            </Button>
          </div>

          <div
            className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-surface-dark-foreground/10 animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div>
              <div className="text-3xl md:text-4xl font-bold">500+</div>
              <div className="text-sm text-surface-dark-foreground/60 mt-1">
                Unique Designs
              </div>
            </div>

            <div>
              <div className="text-3xl md:text-4xl font-bold">50+</div>
              <div className="text-sm text-surface-dark-foreground/60 mt-1">
                Happy Customers
              </div>
            </div>

            <div>
              <div className="text-3xl md:text-4xl font-bold">4.9</div>
              <div className="text-sm text-surface-dark-foreground/60 mt-1">
                Rating
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-surface-dark-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-surface-dark-foreground/50" />
        </div>
      </div>
    </section>
  );
};
