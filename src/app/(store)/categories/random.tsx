"use client";
import { ArrowUpRight, Sparkles } from "lucide-react";

const categories = [
  {
    name: "Anime",
    count: "150+",
    description: "From classic to modern anime characters",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=600&fit=crop",
    color: "from-pink-500/20 to-purple-500/20",
  },
  {
    name: "Pop Culture",
    count: "200+",
    description: "Movies, music, and internet icons",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    name: "Custom",
    count: "∞",
    description: "Design your own unique stickers",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    name: "Gaming",
    count: "80+",
    description: "Level up your gear with gaming stickers",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    name: "Nature",
    count: "120+",
    description: "Plants, animals, and natural wonders",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    color: "from-teal-500/20 to-green-500/20",
  },
  {
    name: "Abstract",
    count: "95+",
    description: "Geometric patterns and artistic designs",
    image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=600&fit=crop",
    color: "from-indigo-500/20 to-purple-500/20",
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Explore Collections
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Discover Your Style
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Browse through our curated collections of premium vinyl stickers. From anime to abstract, find the perfect design for your personality.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid - Minimal Design */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <a
                key={category.name}
                href={`/products?category=${category.name.toLowerCase()}`}
                className="group relative p-8 md:p-12 border rounded-lg hover:border-foreground/30 hover:bg-foreground/5 transition-all duration-300 overflow-hidden"
              >
                {/* Background Number */}
                <span className="absolute top-4 right-4 text-6xl md:text-8xl font-bold text-foreground/5 group-hover:text-foreground/10 transition-colors">
                  0{index + 1}
                </span>

                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:translate-x-2 transition-transform">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    <span className="text-sm font-medium text-muted-foreground">
                      {category.count} designs
                    </span>
                  </div>
                  
                  <div className="ml-4 w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid - Visual Design */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Browse by Collection
            </h2>
            <p className="text-muted-foreground">
              Click on any category to explore our full range
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <a
                key={category.name}
                href={`/products?category=${category.name.toLowerCase()}`}
                className="group relative rounded-xl overflow-hidden aspect-[4/3] hover:shadow-2xl transition-all duration-500"
              >
                {/* Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60 group-hover:opacity-40 transition-opacity`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="transform transition-transform group-hover:translate-y-[-8px]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-white">
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
                      {category.count} designs
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-muted-foreground mb-8">
              Create your own custom sticker design and bring your vision to life. Our design team is ready to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/custom"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Create Custom Design
              </a>
              <a
                href="/products"
                className="px-8 py-4 border rounded-lg font-medium hover:bg-secondary transition-colors"
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