import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PricingBarProps {
  price: number;
  unitPrice: number;
  quantity: number;
  onAddToCart: () => void;
}

export function PricingBar({
  price,
  unitPrice,
  quantity,
  onAddToCart,
}: PricingBarProps) {
  return (
    <motion.div
      className="z-40 bg-white border-t border-gray-200"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-sm text-muted-foreground">Total Price</div>
              <div className="text-3xl font-bold">₹{price}</div>
            </div>
            <div className="hidden sm:block text-sm text-muted-foreground">
              <div>
                ₹{unitPrice} per sticker × {quantity} qty
              </div>
              <div className="text-foreground font-medium">
                {quantity >= 10
                  ? "10% bulk discount applied!"
                  : quantity >= 5
                  ? "5% discount applied!"
                  : "Order 5+ for discounts"}
              </div>
            </div>
          </div>
          <Button
            variant="default"
            size="xl"
            className="group"
            onClick={onAddToCart}
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
