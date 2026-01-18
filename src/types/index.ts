export type StickerShape = "die-cut" | "circle" | "square" | "rectangle";
export type StickerMaterial = "matte" | "glossy" | "holographic";

export interface PricingTier {
    minWidth: number;
    basePrice: number;
    perInchPrice: number;
}

export interface GallerySticker {
    id: string;
    image: string;
    name: string;
    artist: string;
    shape: string;
    material: string;
    size: number;
    createdAt: string;
    likes: number;
    isUserCreation?: boolean;
}

export interface ShapeConfig {
    id: StickerShape;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
}

export interface MaterialConfig {
    id: StickerMaterial;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    description: string;
}