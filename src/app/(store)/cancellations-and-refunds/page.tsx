import type { Metadata } from "next";

import { PageHeader } from "@/modules/store/ui/components/page-header";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cancellations and Refunds",
  description:
    "Learn about ZERO | STICK's cancellation and refund policy, including timeframes, eligibility, and the steps for returning your stickers.",
  path: "/cancellations-and-refunds",
});

export default function CancellationsPage() {
  return (
    <>
      <PageHeader 
        title="Cancellations and Refunds" 
        description="Learn about our return policy, refund process, and how to cancel an order."
      />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary animate-fade-up" style={{ animationDelay: "0.2s" }}>
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Order Cancellation</h2>
            <p className="text-muted-foreground leading-relaxed">
              You can cancel your order at any time before it has been shipped. If your order has already been shipped, you will need to follow our return process.
              To cancel an order, please contact us immediately at support@stickerstore.com with your order number.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Returns</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.
              To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              To start a return, you can contact us at returns@stickerstore.com. If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Damages and issues</h2>
            <p className="text-muted-foreground leading-relaxed">
              Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Exceptions / non-returnable items</h2>
            <p className="text-muted-foreground leading-relaxed">
              Certain types of items cannot be returned, like custom products (such as special orders or personalized items). Please get in touch if you have questions or concerns about your specific item.
              Unfortunately, we cannot accept returns on sale items or gift cards.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Exchanges</h2>
            <p className="text-muted-foreground leading-relaxed">
              The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Refunds</h2>
            <p className="text-muted-foreground leading-relaxed">
              We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.
              If more than 15 business days have passed since we’ve approved your return, please contact us at support@stickerstore.com.
            </p>
          </section>

        </div>
      </div>
    </>
  );
}
