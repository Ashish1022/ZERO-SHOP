import { X, Check, ShoppingCart, ArrowRight } from "lucide-react";

import { StickerPreview } from "./sticker-preview";

import type { StickerShape, StickerMaterial } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadedImage: string;
  selectedShape: StickerShape;
  selectedMaterial: StickerMaterial;
  stickerWidth: number;
  quantity: number;
  unitPrice: number;
  price: number;
  stickerName: string;
  setStickerName: (name: string) => void;
  artistName: string;
  setArtistName: (name: string) => void;
  shareToGallery: boolean;
  setShareToGallery: (share: boolean) => void;
  onConfirm: () => void;
}

export function PreviewModal({
  isOpen,
  onClose,
  uploadedImage,
  selectedShape,
  selectedMaterial,
  stickerWidth,
  quantity,
  unitPrice,
  price,
  stickerName,
  setStickerName,
  artistName,
  setArtistName,
  shareToGallery,
  setShareToGallery,
  onConfirm,
}: PreviewModalProps) {
  return (
    <Dialog open={isOpen && !!uploadedImage} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-xl overflow-hidden max-w-7xl w-full max-h-[90vh] overflow-y-auto p-0 gap-0 border-0 scrollbar-hide">
        <DialogClose className="absolute top-4 right-4 z-10 p-3 bg-black/10 rounded-md hover:bg-black/20 transition-colors">
          <X className="h-4 w-4 text-white" />
        </DialogClose>

        <div className="bg-black text-white px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-white/10">
              <Check className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-bold">Review Your Sticker</h3>
          </div>
          <p className="text-white/70">
            Make sure everything looks perfect before adding to cart
          </p>
        </div>

        <div className="p-8">
          <div className="relative aspect-square max-w-xs mx-auto mb-8 rounded-2xl overflow-hidden border-4 border-gray-100 shadow-xl">
            <StickerPreview
              image={uploadedImage}
              shape={selectedShape}
              material={selectedMaterial}
            />
          </div>

          <div className="space-y-4 mb-8">
            <h4 className="font-semibold text-lg text-center mb-4">
              Your Customization
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-sm text-muted-foreground mb-1">Shape</div>
                <div className="font-semibold capitalize">{selectedShape}</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-sm text-muted-foreground mb-1">
                  Material
                </div>
                <div className="font-semibold capitalize">
                  {selectedMaterial}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-sm text-muted-foreground mb-1">Size</div>
                <div className="font-semibold">{stickerWidth}" width</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-sm text-muted-foreground mb-1">
                  Quantity
                </div>
                <div className="font-semibold">{quantity} stickers</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black text-white mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70">Unit Price</span>
                <span>₹{unitPrice}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70">Quantity</span>
                <span>× {quantity}</span>
              </div>
              {quantity >= 5 && (
                <div className="flex items-center justify-between mb-2 text-green-400">
                  <span>Bulk Discount</span>
                  <span>-{quantity >= 10 ? "10%" : "5%"}</span>
                </div>
              )}
              <div className="border-t border-white/20 pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-3xl font-bold">₹{price}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <DialogClose asChild>
              <Button variant="outline" size="lg" className="flex-1">
                Edit Design
              </Button>
            </DialogClose>
            <Button
              variant="default"
              size="lg"
              className="flex-1 group"
              onClick={onConfirm}
            >
              <ShoppingCart className="h-5 w-5" />
              Confirm & Add to Cart
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}