import type { StickerMaterial } from "./types";
import { PRICING_TIERS, MATERIAL_MULTIPLIERS } from "./constants";

/**
 * Calculate price based on size, material, and quantity
 */
export const calculatePrice = (
    width: number,
    material: StickerMaterial,
    quantity: number
): number => {
    let tier = PRICING_TIERS[0];
    for (const t of PRICING_TIERS) {
        if (width >= t.minWidth) tier = t;
    }
    const basePrice = tier.basePrice + (width - tier.minWidth) * tier.perInchPrice;
    const materialPrice = basePrice * MATERIAL_MULTIPLIERS[material];
    const quantityDiscount = quantity >= 10 ? 0.9 : quantity >= 5 ? 0.95 : 1;
    return Math.round(materialPrice * quantity * quantityDiscount);
};

/**
 * Get discount percentage based on quantity
 */
export const getDiscountPercentage = (quantity: number): number => {
    if (quantity >= 10) return 10;
    if (quantity >= 5) return 5;
    return 0;
};

/**
 * Get discount message for display
 */
export const getDiscountMessage = (quantity: number): string => {
    if (quantity >= 10) return "10% bulk discount applied!";
    if (quantity >= 5) return "5% discount applied!";
    return "Order 5+ for discounts";
};
