"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, Tag, Package } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useCart from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { calculateCartTotals } from "@/lib/cart-config";

interface CartDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const CartDrawer = ({ isOpen, setIsOpen }: CartDrawerProps) => {
  const cart = useCart();
  const router = useRouter();
  const quantityRef = useRef(cart.totalQuantity);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (cart.totalQuantity > quantityRef.current && cart.totalQuantity > 0) {
      if (!isOpen) {
        setIsOpen(true);
      }
    }

    quantityRef.current = cart.totalQuantity;
  }, [cart.totalQuantity, isOpen, setIsOpen]);

  const subtotal = cart.items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);

  const { shipping, tax, total, remainingForFreeShipping } =
    calculateCartTotals(subtotal);

  const handleCheckout = () => {
    router.push("/checkout");
    setIsOpen(false);
  };

  const handleRemoveItem = (productId: string) => {
    setRemovingItems((prev) => new Set(prev).add(productId));
    setTimeout(() => {
      cart.removeItem(productId);
      setRemovingItems((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }, 300);
  };

  const handleItemClick = (slug: string) => {
    router.push(`/products/${slug}`);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <div className="relative">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <span>Shopping Cart</span>
          </SheetTitle>

          {cart.totalQuantity > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}{" "}
              in your cart
            </p>
          )}
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-6 py-12">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-primary/60" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-background border-2 border-border flex items-center justify-center">
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-xl mb-2">Your cart is empty</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Discover our amazing collection of premium stickers and add your
                favorites!
              </p>
            </div>
            <Button
              variant="default"
              size="lg"
              onClick={() => {
                setIsOpen(false)
                router.push('/products')
              }}
              className="mt-4"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            {remainingForFreeShipping > 0 && (
              <div className="px-6 py-4 bg-primary/5 border-b border-border">
                <div className="flex items-start gap-3">
                  <Tag className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary mb-2">
                      You're ₹{remainingForFreeShipping.toFixed(2)} away from
                      FREE shipping!
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className={`flex gap-4 p-4 bg-card border border-border rounded-xl group hover:shadow-md transition-all duration-300 ${removingItems.has(item.productId)
                      ? "opacity-0 scale-95"
                      : "opacity-100 scale-100"
                      }`}
                  >
                    <div
                      className="relative h-20 w-20 bg-secondary rounded-lg p-2 shrink-0 overflow-hidden cursor-pointer"
                      onClick={() => handleItemClick(item.slug)}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className="font-medium text-sm leading-tight cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleItemClick(item.slug)}
                        >
                          {item.name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 hover:bg-destructive/10 hover:text-destructive -mt-1"
                          onClick={() => handleRemoveItem(item.productId)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-0.5 bg-secondary/50 rounded-lg border border-border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-background"
                            onClick={() =>
                              cart.updateQuantity(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-background"
                            onClick={() =>
                              cart.updateQuantity(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-base tabular-nums">
                            ₹{(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground">
                              ₹{Number(item.price).toFixed(2)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border bg-background">
              <div className="px-6 py-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium tabular-nums">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium tabular-nums">
                      {shipping === 0 ? (
                        <span className="text-green-600 font-semibold">
                          FREE
                        </span>
                      ) : (
                        `₹${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tax (18%)</span>
                    <span className="font-medium tabular-nums">
                      ₹{tax.toFixed(2)}
                    </span>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-base">Total</span>
                    <span className="font-bold text-2xl tabular-nums">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full text-base font-semibold"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
