import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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