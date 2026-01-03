"use client"

import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: {
    imageId: string;
    isPrimary: boolean;
    sortOrder: number;
    productId: string;
    url: string;
    alt: string | null;
  }[];
}

export const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-secondary rounded-2xl flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-secondary rounded-2xl overflow-hidden">
        <Image
          src={images[selectedImage].url}
          alt={images[selectedImage].alt || "Product image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-contain p-8 transition-transform duration-500`}
          priority={selectedImage === 0}
        />

        <div className="absolute bottom-4 right-4 bg-foreground/80 text-background text-xs font-medium px-2 py-1 rounded-full">
          {selectedImage + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image.imageId}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square bg-secondary rounded-lg overflow-hidden border-2 transition-all duration-300 hover:border-foreground ${
                selectedImage === index
                  ? "border-foreground ring-2 ring-foreground ring-offset-2"
                  : "border-transparent"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || `Product image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 25vw, (max-width: 1200px) 15vw, 10vw"
                className="object-contain p-2 hover:scale-110 transition-transform duration-300"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProductGallerySkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-secondary rounded-2xl overflow-hidden">
        <Skeleton className="w-full h-full" />
        <div className="absolute bottom-4 right-4">
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
};