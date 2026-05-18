import type { Metadata } from "next";

import { CheckoutView } from "@/modules/checkout/ui/views/checkout-view";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Checkout",
  description: "Complete your sticker purchase securely at ZERO | STICK.",
  path: "/checkout",
  noIndex: true,
});

const CheckoutPage = () => {
  return <CheckoutView />;
};

export default CheckoutPage;
