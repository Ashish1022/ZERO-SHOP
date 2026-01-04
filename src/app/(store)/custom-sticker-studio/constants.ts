import {
    Circle,
    Square,
    Hexagon,
    RectangleHorizontal,
    Sparkles,
    Droplets,
    Layers,
} from "lucide-react";
import type { StickerShape, StickerMaterial, PricingTier, ShapeConfig, MaterialConfig } from "./types";

// Pricing configuration
export const PRICING_TIERS: PricingTier[] = [
    { minWidth: 2, basePrice: 29, perInchPrice: 15 },
    { minWidth: 4, basePrice: 59, perInchPrice: 12 },
    { minWidth: 6, basePrice: 89, perInchPrice: 10 },
    { minWidth: 8, basePrice: 119, perInchPrice: 8 },
];

export const MATERIAL_MULTIPLIERS: Record<StickerMaterial, number> = {
    matte: 1,
    glossy: 1.15,
    holographic: 1.4,
};

// Shape configuration
export const SHAPES: ShapeConfig[] = [
    { id: "die-cut", icon: Hexagon, label: "Die-Cut" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "square", icon: Square, label: "Square" },
    { id: "rectangle", icon: RectangleHorizontal, label: "Rectangle" },
];

// Material configuration
export const MATERIALS: MaterialConfig[] = [
    { id: "matte", icon: Layers, label: "Matte", description: "Smooth, non-reflective finish" },
    { id: "glossy", icon: Droplets, label: "Glossy", description: "Shiny, vibrant colors" },
    { id: "holographic", icon: Sparkles, label: "Holographic", description: "Rainbow shimmer effect" },
];
