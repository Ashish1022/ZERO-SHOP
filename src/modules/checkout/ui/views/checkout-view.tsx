"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";

import { type CheckoutFormInput, checkoutFormSchema } from "../../schema";

import { useTRPC } from "@/trpc/client";
import useCart from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { calculateCartTotals } from "@/lib/cart-config";
import { loadRazorpayScript } from "@/lib/razorpay-script";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

export const CheckoutView = () => {
  const cart = useCart();

  const form = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      newsletter: false,
      street: "",
      apartment: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      paymentMethod: "razorpay",
    },
  });

  const trpc = useTRPC();
  const verifyOrderMutation = useMutation(
    trpc.checkout.verifyPayment.mutationOptions({
      onSuccess: () => {
        toast.success("Payment completed.");
        cart.removeAll();
      },
      onError: () => {
        toast.error("Payment failed.");
      },
    })
  );

  const createOrderMutation = useMutation(
    trpc.checkout.createOrder.mutationOptions({
      onSuccess: async (createOrderData) => {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          toast.error(
            "Razorpay SDK failed to load. Please check your internet connection."
          );
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: createOrderData?.razorpay_amount,
          currency: createOrderData?.currency,
          name: "ZERO | STICK",
          image: "/logo/logo.svg",
          order_id: createOrderData?.razorpay_order_id,
          handler: async function (response: any) {
            verifyOrderMutation.mutate({
              orderId: createOrderData.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          prefill: {
            name: createOrderData?.customerName,
            email: createOrderData?.customerEmail,
            contact: createOrderData?.customerPhone,
          },
          theme: {
            color: "#000000",
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();

        razorpay.on("payment.failed", function (_response: any) {
          toast.error("Payment failed. Please try again.");
        });
      },
      onError: (error) => {
        toast.error("Failed to create order. Please try again.");
      },
    })
  );

  const subtotal = cart.items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);

  const { shipping, tax, total } = calculateCartTotals(subtotal);

  const onSubmit = (data: CheckoutFormInput) => {
    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const items = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    createOrderMutation.mutate({
      ...data,
      items,
    });
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} id="checkout-form">
                <div className="space-y-8">
                  <section className="space-y-4">
                    <h2 className="text-xl font-semibold">
                      Contact Information
                    </h2>
                    <div className="space-y-4">
                      <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="your@email.com"
                                className="mt-1.5"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="phone"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="tel"
                                placeholder="+91 98765 43210"
                                className="mt-1.5"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="newsletter"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Subscribe to newsletter</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Shipping Address</h2>
                    <div className="grid gap-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          name="firstName"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="John"
                                  className="mt-1.5"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="lastName"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Doe"
                                  className="mt-1.5"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        name="street"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="123 Main Street"
                                className="mt-1.5"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="apartment"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Apartment, suite, etc. (optional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Apt 4B"
                                className="mt-1.5"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid sm:grid-cols-3 gap-4">
                        <FormField
                          name="city"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Mumbai"
                                  className="mt-1.5"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="state"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Maharashtra"
                                  className="mt-1.5"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="postalCode"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>PIN Code</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="400001"
                                  className="mt-1.5"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </section>
                </div>
              </form>
            </Form>
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
                    <span className="text-white/70">Tax (18%)</span>
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
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending
                    ? "Processing..."
                    : `Pay ₹${total.toFixed(2)}`}
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
