import { Truck, Shield, Sparkles, RotateCcw } from "lucide-react";

const features = [
  { icon: Truck, text: "Free Shipping Over ₹150" },
  { icon: Shield, text: "Premium Quality Vinyl" },
  { icon: Sparkles, text: "Weatherproof & Durable" },
  { icon: RotateCcw, text: "Easy Returns" },
];

export const FeatureStrip = () => {
  return (
    <section className="py-6 bg-muted border-y border-border overflow-hidden">
      <div className="flex animate-marquee">
        {[...features, ...features, ...features].map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-8 whitespace-nowrap"
          >
            <feature.icon className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{feature.text}</span>
            <span className="text-muted-foreground/30">•</span>
          </div>
        ))}
      </div>
    </section>
  );
};