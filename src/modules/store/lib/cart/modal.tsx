"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import useCart from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { OpenCart } from "./open-cart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { Price } from "../../ui/components/price";
import { Separator } from "@/components/ui/separator";
import LoadingDots from "./loading-dots";
import { createUrl } from "@/lib/utils";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export const CartModal = () => {
  const cart = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart.totalQuantity);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const optimisticUpdate = (id: string, type: "plus" | "minus") => {
    const item = cart.items.find((i) => i.product.id === id);
    if (!item) return;
    const newQuantity = type === "plus" ? item.quantity + 1 : item.quantity - 1;
    if (newQuantity < 1) return;
    cart.updateQuantity(id, newQuantity);
  };

  const totalPrice = cart.items.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);
  const taxAmount = totalPrice * 0.05;
  const totalAmount = (taxAmount + totalPrice).toFixed(2);

  useEffect(() => {
    if (
      cart.totalQuantity &&
      cart.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  const processToCheckout = () => {
    setIsOpen(false);
    setLoading(true);
    router.push("/checkout");
    setLoading(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={openCart}
        aria-label="Open cart"
      >
        <OpenCart quantity={cart.totalQuantity} />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="right" 
          className="w-full border-neutral-700 bg-black/95 p-0 text-white backdrop-blur-xl sm:max-w-[390px]"
        >
          <SheetHeader className="border-b border-neutral-700 p-6 pb-4">
            <SheetTitle className="text-lg font-semibold text-white">
              My Cart
            </SheetTitle>
          </SheetHeader>

          {!cart || cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-6">
              <ShoppingCart className="h-16 w-16 text-neutral-400" />
              <p className="mt-6 text-center text-2xl font-bold">
                Your cart is empty.
              </p>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-between p-6">
              <ScrollArea className="grow pr-4">
                <ul className="space-y-4">
                  {cart.items
                    .sort((a, b) =>
                      a.product.name.localeCompare(b.product.name)
                    )
                    .map((item, i) => {
                      const merchandiseSearchParams =
                        {} as MerchandiseSearchParams;
                      const merchandiseUrl = createUrl(
                        `/product/${item.product.slug}`,
                        new URLSearchParams(merchandiseSearchParams)
                      );

                      return (
                        <li
                          key={i}
                          className="flex w-full flex-col border-b border-neutral-700 pb-4"
                        >
                          <div className="relative flex w-full flex-row justify-between">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute -left-2 -top-2 z-10 h-6 w-6 rounded-full bg-neutral-500 hover:bg-neutral-400"
                              onClick={() => cart.removeItem(item.product.id)}
                              aria-label="Remove cart item"
                            >
                              <X className="h-4 w-4 text-black" />
                            </Button>

                            <div className="flex flex-row items-center space-x-3">
                              <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-700 bg-neutral-900">
                                <Image
                                  className="h-full w-full object-cover"
                                  width={64}
                                  height={64}
                                  alt={item.product.name}
                                  src={
                                    item.product.images[0].isPrimary
                                      ? item.product.images[0].url
                                      : item.product.images[1].url
                                  }
                                />
                              </div>
                              <Link
                                href={merchandiseUrl}
                                onClick={closeCart}
                                className="flex flex-1"
                              >
                                <span className="font-semibold hover:underline">
                                  {item.product.name}
                                </span>
                              </Link>
                            </div>

                            <div className="flex flex-col items-end justify-between space-y-2">
                              <Price
                                className="text-sm font-medium"
                                amount={(
                                  item.quantity * parseFloat(item.product.price)
                                ).toString()}
                                currencyCode={"INR"}
                              />
                              <div className="flex items-center rounded-full border border-neutral-700">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 rounded-full hover:bg-neutral-800"
                                  onClick={() =>
                                    optimisticUpdate(item.product.id, "minus")
                                  }
                                >
                                  <Minus className="h-4 w-4 text-neutral-400" />
                                </Button>
                                <span className="w-8 text-center text-sm">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 rounded-full hover:bg-neutral-800"
                                  onClick={() =>
                                    optimisticUpdate(item.product.id, "plus")
                                  }
                                >
                                  <Plus className="h-4 w-4 text-neutral-400" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </ScrollArea>

              <div className="space-y-4 pt-4">
                <div className="space-y-3 text-sm text-neutral-400">
                  <div className="flex items-center justify-between">
                    <p>Taxes</p>
                    <Price
                      className="text-base text-white"
                      amount={taxAmount.toString()}
                      currencyCode={"INR"}
                    />
                  </div>
                  <Separator className="bg-neutral-700" />
                  <div className="flex items-center justify-between">
                    <p>Shipping</p>
                    <p className="text-right">Calculated at checkout</p>
                  </div>
                  <Separator className="bg-neutral-700" />
                  <div className="flex items-center justify-between font-semibold">
                    <p className="text-white">Total</p>
                    <Price
                      className="text-base text-white"
                      amount={totalAmount.toString()}
                      currencyCode={"INR"}
                    />
                  </div>
                </div>

                {cart.totalQuantity < 6 && (
                  <p className="text-sm text-blue-400">
                    You need at least 6 products to proceed to checkout.
                  </p>
                )}

                <Button
                  className="w-full rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  onClick={processToCheckout}
                  disabled={cart.totalQuantity < 6}
                >
                  {loading ? (
                    <LoadingDots className="bg-white" />
                  ) : (
                    "Proceed to Checkout"
                  )}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};