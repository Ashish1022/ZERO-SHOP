import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    name: "Anime",
    count: "150+",
    description: "From classic to modern anime characters",
  },
  {
    name: "Pop Culture",
    count: "200+",
    description: "Movies, music, and internet icons",
  },
  {
    name: "Custom",
    count: "∞",
    description: "Design your own unique stickers",
  },
  {
    name: "Gaming",
    count: "80+",
    description: "Level up your gear with gaming stickers",
  },
];

export const Categories = () => {
  return (
    <section
      id="collections"
      className="py-24 md:py-32 bg-surface-dark text-surface-dark-foreground"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-surface-dark-foreground/60 uppercase tracking-wider">
            Collections
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">
            Explore Categories
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href="#"
              className="group relative p-8 md:p-12 border border-surface-dark-foreground/10 rounded-lg hover:border-surface-dark-foreground/30 hover:bg-surface-dark-foreground/5 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-5xl md:text-6xl font-bold text-surface-dark-foreground/10 group-hover:text-surface-dark-foreground/20 transition-colors">
                    0{index + 1}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold mt-4 group-hover:translate-x-2 transition-transform">
                    {category.name}
                  </h3>
                  <p className="text-surface-dark-foreground/60 mt-2">
                    {category.description}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-surface-dark-foreground/40">
                    {category.count} designs
                  </span>
                  <div className="mt-8 w-10 h-10 rounded-full border border-surface-dark-foreground/20 flex items-center justify-center group-hover:bg-surface-dark-foreground group-hover:text-surface-dark transition-all">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};