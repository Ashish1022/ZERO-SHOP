"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

import { CheckoutForm } from "../components/checkout-form";

import useCart from "@/hooks/use-cart";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { calculateCartTotals } from "@/lib/cart-config";

export const CheckoutView = () => {
  const cart = useCart();

  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);

  const { shipping, tax, total } = calculateCartTotals(subtotal);

  const handleSubmit = async (data: any) => {
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success(
      "Order placed successfully! Thank you for your purchase. You'll receive a confirmation email shortly."
    );

    cart.removeAll();
    setIsProcessing(false);
    redirect("/");
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground">
            Add some stickers before checking out!
          </p>
          <Button asChild variant="brand">
            <Link href="/">Browse Stickers</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20">
        <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Shop</span>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 lg:py-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-8">Checkout</h1>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <CheckoutForm onSubmit={handleSubmit} isProcessing={isProcessing} />

            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-surface-dark text-white rounded-2xl p-6 lg:p-8 space-y-6">
                <h2 className="text-xl font-semibold">Order Summary</h2>

                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="flex gap-4">
                      <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <p className="text-sm text-white/60">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ₹{(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="bg-white/20" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-400">Free</span>
                      ) : (
                        `₹${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Tax (8%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="bg-white/20" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <Button
                  type="submit"
                  form="checkout-form"
                  variant="brand"
                  size="xl"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
                </Button>

                <p className="text-xs text-white/50 text-center">
                  Your payment is secured with 256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
