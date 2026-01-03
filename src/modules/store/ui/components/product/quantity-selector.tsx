import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

const QuantitySelector = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) => {
  const decrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const increase = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={decrease}
        disabled={quantity <= min}
        className="h-10 w-10 rounded-lg"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <div className="w-14 h-10 flex items-center justify-center border-2 border-foreground rounded-lg font-semibold text-lg">
        {quantity}
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={increase}
        disabled={quantity >= max}
        className="h-10 w-10 rounded-lg"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuantitySelector;
