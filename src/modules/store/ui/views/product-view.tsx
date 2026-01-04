"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Heart, Share2, ShoppingCart } from "lucide-react";

import { ProductGallery } from "../components/product/gallery";
import { ProductFeatures } from "../components/product/features";
import QuantitySelector from "../components/product/quantity-selector";
import { ShippingInfo } from "../components/product/shipping-info";
import { CustomerReviews } from "../components/product/customer-reviews";
import { RelatedProducts } from "../components/product/related-products";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import toast from "react-hot-toast";

export const ProductView = ({ slug }: { slug: string }) => {
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const trpc = useTRPC();
  const { data: product } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ slug: slug })
  );

  const handleAddToCart = () => {
    cart.addItem(
      {
        productId: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.images[0].url || "",
        category: product.category?.name || "Uncategorized",
        slug: product.slug,
      },
      quantity
    );
    toast.success(`${quantity}x ${product.name} added to your cart.`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    if (isWishlisted) {
      toast.success(`${product.name} removed from your wishlist.`);
    } else {
      toast.success(`${product.name} saved to your wishlist.`);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied to clipboard.");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share product.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>
        </div>

        <section className="container mx-auto px-4 pb-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <ProductGallery images={product.images} />
            <div className="space-y-6">
              <div>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {product.category?.name}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">
                  {product.name}
                </h1>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">
                ₹{Number(product.price).toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">
                  per sticker
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              <div className="flex gap-6 py-4 border-y border-border">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Size
                  </span>
                  <p className="font-semibold mt-1">3&quot; x 3&quot;</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Material
                  </span>
                  <p className="font-semibold mt-1">Premium Vinyl</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Status
                  </span>
                  <p className="font-semibold mt-1 text-brand">
                    {product.quantity ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
              </div>
              <ProductFeatures />
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <QuantitySelector
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="brand"
                    size="xl"
                    className="flex-1 group"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    Add to Cart — ₹
                    {(Number(product.price) * quantity).toFixed(2)}
                  </Button>
                  <Button
                    variant="outline"
                    size="xl"
                    className={`px-4 ${
                      isWishlisted ? "text-brand border-brand" : ""
                    }`}
                    onClick={handleWishlist}
                  >
                    <Heart
                      className={`h-5 w-5 ${isWishlisted ? "fill-brand" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="xl"
                    className="px-4"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ShippingInfo />

        <CustomerReviews productId={product.id} />

        <RelatedProducts
          productId={product.id}
          categoryId={product.categoryId}
        />
      </div>
    </div>
  );
};
