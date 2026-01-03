import { Check, Droplets, Shield, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  text: string;
}

const features: Feature[] = [
  { icon: Droplets, text: "Waterproof" },
  { icon: Sun, text: "UV Resistant" },
  { icon: Shield, text: "Scratch-Proof" },
  { icon: Check, text: "Easy Apply" },
];

export const ProductFeatures = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {features.map((feature) => (
        <div
          key={feature.text}
          className="flex items-center gap-3 p-3 bg-secondary rounded-lg cursor-target"
        >
          <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center">
            <feature.icon className="h-4 w-4 text-foreground" />
          </div>
          <span className="text-sm font-medium">{feature.text}</span>
        </div>
      ))}
    </div>
  );
};