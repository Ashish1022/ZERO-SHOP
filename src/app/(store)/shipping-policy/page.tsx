import type { Metadata } from "next";

import { PageHeader } from "@/modules/store/ui/components/page-header";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shipping Policy",
  description:
    "Find out about ZERO | STICK shipping times, delivery charges, packaging, and how we ship stickers across India.",
  path: "/shipping-policy",
});

export default function ShippingPolicyPage() {
  return (
    <>
      <PageHeader 
        title="Shipping Policy" 
        description="Everything you need to know about our shipping limits, timelines, and costs."
      />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary animate-fade-up" style={{ animationDelay: "0.2s" }}>
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Processing Time</h2>
            <p className="text-muted-foreground leading-relaxed">
              All orders are processed within 1-3 business days. Orders are not shipped or delivered on weekends or holidays.
              If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in shipment of your order, we will contact you via email or telephone.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Shipping Rates & Delivery Estimates</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Shipping charges for your order will be calculated and displayed at checkout.
            </p>
            <div className="bg-card rounded-lg border border-border p-6 my-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium">Standard Shipping (5-7 business days)</div>
                <div className="text-right">₹49</div>
                <div className="font-medium">Express Shipping (2-3 business days)</div>
                <div className="text-right">₹99</div>
                <div className="font-medium">Overnight Shipping (1 business day)</div>
                <div className="text-right">₹199</div>
                <div className="tfont-medium font-bold text-primary pt-2">Orders over ₹499</div>
                <div className="text-right font-bold text-primary pt-2">FREE</div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm italic">
              * Delivery delays can occasionally occur.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Shipment to P.O. boxes or APO/FPO addresses</h2>
            <p className="text-muted-foreground leading-relaxed">
              We ship to addresses within India. Currently we do not ship internationally.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Shipment Confirmation & Order Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Customs, Duties and Taxes</h2>
            <p className="text-muted-foreground leading-relaxed">
              We are not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Damages</h2>
            <p className="text-muted-foreground leading-relaxed">
              We are not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.
            </p>
          </section>

        </div>
      </div>
    </>
  );
}
