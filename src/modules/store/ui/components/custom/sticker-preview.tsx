import Image from "next/image";
import { motion } from "framer-motion";

import type { StickerShape, StickerMaterial } from "@/types";

interface StickerPreviewProps {
  image: string;
  shape: StickerShape;
  material: StickerMaterial;
}

export function StickerPreview({
  image,
  shape,
  material,
}: StickerPreviewProps) {
  const getShapeStyles = () => {
    switch (shape) {
      case "circle":
        return "rounded-full aspect-square";
      case "square":
        return "rounded-2xl aspect-square";
      case "rectangle":
        return "rounded-2xl aspect-video";
      case "die-cut":
      default:
        return "rounded-3xl aspect-square";
    }
  };

  const getMaterialOverlay = () => {
    switch (material) {
      case "glossy":
        return (
          <div className="absolute inset-0 bg-linear-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
        );
      case "holographic":
        return (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(45deg, rgba(255,0,0,0.1), rgba(255,165,0,0.1), rgba(255,255,0,0.1), rgba(0,128,0,0.1), rgba(0,0,255,0.1), rgba(75,0,130,0.1), rgba(238,130,238,0.1))",
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 bg-gray-50">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%)
          `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      />

      <motion.div
        className={`relative overflow-hidden ${getShapeStyles()} w-3/4 max-w-xs shadow-2xl border-4 border-white`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        key={shape + material}
      >
        <Image
          src={image}
          alt="Your sticker preview"
          fill
          className="object-cover"
        />
        {getMaterialOverlay()}
      </motion.div>

      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-muted-foreground">
        <span className="px-2 py-1 bg-white rounded-full shadow">
          {shape.toUpperCase()}
        </span>
        <span className="px-2 py-1 bg-white rounded-full shadow">
          {material.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
