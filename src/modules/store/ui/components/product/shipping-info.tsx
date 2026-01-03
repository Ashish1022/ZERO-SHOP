import { Truck, Clock, Globe, RotateCcw } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ShippingItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const shippingInfo: ShippingItem[] = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $25",
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Ships within 1-2 business days",
  },
  {
    icon: Globe,
    title: "Worldwide Delivery",
    description: "We ship to 50+ countries",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day hassle-free returns",
  },
];

export const ShippingInfo = () => {
  return (
    <section className="py-20 md:py-28 bg-surface-dark text-surface-dark-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-surface-dark-foreground/60 uppercase tracking-wider">
            Shipping & Returns
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
            We&apos;ve Got You Covered
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shippingInfo.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-xl border border-surface-dark-foreground/10 bg-surface-dark-foreground/5 hover:bg-surface-dark-foreground/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-surface-dark-foreground/10 flex items-center justify-center mb-4">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-surface-dark-foreground/60">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};