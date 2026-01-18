import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

import { StickerMaterial } from "@/types"
import { MATERIAL_MULTIPLIERS, PRICING_TIERS } from "@/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price?: number | null) {
  if (!price) return null
  return (
    new Intl.NumberFormat("en-IN", {
      currency: "INR",
      style: "currency",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price)
  )
}

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