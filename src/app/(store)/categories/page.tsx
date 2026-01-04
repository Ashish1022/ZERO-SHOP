"use client";
import FlowingMenu from "@/components/flow-menu";
import { ArrowUpRight, Sparkles, Grid3x3 } from "lucide-react";

const categories = [
  {
    name: "Anime",
    count: "150+",
    description: "From classic to modern anime characters",
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=600&fit=crop",
    color: "from-pink-500/20 to-purple-500/20",
  },
  {
    name: "Pop Culture",
    count: "200+",
    description: "Movies, music, and internet icons",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    name: "Custom",
    count: "∞",
    description: "Design your own unique stickers",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    name: "Gaming",
    count: "80+",
    description: "Level up your gear with gaming stickers",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    name: "Nature",
    count: "120+",
    description: "Plants, animals, and natural wonders",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    color: "from-teal-500/20 to-green-500/20",
  },
  {
    name: "Abstract",
    count: "95+",
    description: "Geometric patterns and artistic designs",
    image:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=600&fit=crop",
    color: "from-indigo-500/20 to-purple-500/20",
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 bg-linear-to-br from-zinc-900 via-black to-zinc-900" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 mb-8 animate-fade-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              <span className="text-sm font-medium">Explore Collections</span>
            </div>

            <h1
              className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-6 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              Discover Your
              <br />
              <span className="text-zinc-400">Style</span>
            </h1>

            <p
              className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              Browse through our curated collections of premium vinyl stickers.
              From anime to abstract, find the perfect design for your
              personality.
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-white/50" />
          </div>
        </div>
      </div>

      <section className="py-0">
        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <a
            href={`/products?category=${categories[0].name.toLowerCase()}`}
            className="group block relative rounded-2xl overflow-hidden aspect-21/9 hover:shadow-2xl transition-all duration-500"
          >
            <img
              src={categories[0].image}
              alt={categories[0].name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
              <div className="max-w-2xl transform transition-transform group-hover:-translate-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium mb-4">
                  <Sparkles className="h-3 w-3" />
                  Featured Collection
                </div>

                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  {categories[0].name}
                </h2>

                <p className="text-lg text-white/80 mb-6">
                  {categories[0].description}
                </p>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-white/60">
                    {categories[0].count} designs
                  </span>

                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>

      <section className="bg-surface-dark text-surface-dark-foreground my-2">
        <FlowingMenu />
      </section>

      <section className="py-24 md:py-32 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium mb-6">
              <Grid3x3 className="h-4 w-4" />
              Browse Visually
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Choose Your Vibe</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <a
                key={category.name}
                href={`/products?category=${category.name.toLowerCase()}`}
                className="group relative rounded-xl overflow-hidden aspect-square hover:shadow-2xl transition-all duration-500"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div
                  className={`absolute inset-0 bg-linear-to-br ${category.color} opacity-60 group-hover:opacity-40 transition-opacity`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="transform transition-transform group-hover:-translate-y-2">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl md:text-3xl font-bold text-white">
                        {category.name}
                      </h3>
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                        <ArrowUpRight className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="text-white/80 text-sm mb-2">
                      {category.description}
                    </p>
                    <span className="text-xs font-medium text-white/60">
                      {category.count} designs available
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Can't Find What
              <br />
              You're Looking For?
            </h2>
            <p className="text-lg md:text-xl text-white/60 mb-10">
              Create your own custom sticker design and bring your vision to
              life. Our design team is ready to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/custom"
                className="group px-8 py-4 bg-white text-black rounded-lg font-medium hover:bg-zinc-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                Create Custom Design
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
              <a
                href="/products"
                className="px-8 py-4 border-2 border-white/20 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                View All Products
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
