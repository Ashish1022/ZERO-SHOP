import { Plus } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

const stickers = [
  {
    id: 1,
    name: "Shadow Knight",
    price: "$4.99",
    category: "Anime",
    image: "/sticker-anime-1.png",
  },
  {
    id: 2,
    name: "Geometric Skull",
    price: "$3.99",
    category: "Pop Culture",
    image: "/sticker-skull.png",
  },
  {
    id: 3,
    name: "Great Wave",
    price: "$4.49",
    category: "Japanese Art",
    image: "/sticker-wave.png",
  },
  {
    id: 4,
    name: "Kawaii Kitty",
    price: "$3.49",
    category: "Cute",
    image: "/sticker-cat.png",
  },
  {
    id: 5,
    name: "Retro Controller",
    price: "$3.99",
    category: "Gaming",
    image: "/sticker-gaming.png",
  },
  {
    id: 6,
    name: "Dragon Spirit",
    price: "$4.99",
    category: "Fantasy",
    image: "/sticker-dragon.png",
  },
];

export const FeaturedStickers = () => {
  return (
    <section id="shop" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Featured
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">
              Best Sellers
            </h2>
          </div>
          <Button variant="outline" size="lg">
            View All Stickers
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {stickers.map((sticker) => (
            <div key={sticker.id} className="sticker-card group">
              <div className="aspect-square bg-secondary p-6 md:p-8 flex items-center justify-center overflow-hidden">
                <Image
                  src={sticker.image}
                  alt={sticker.name}
                  width={400}
                  height={400}
                  className="sticker-image w-full h-full object-contain"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {sticker.category}
                </span>
                <div className="flex items-center justify-between mt-1">
                  <h3 className="font-semibold text-foreground">
                    {sticker.name}
                  </h3>
                  <span className="font-bold text-foreground">
                    {sticker.price}
                  </span>
                </div>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="default"
                  className="h-8 w-8 rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
