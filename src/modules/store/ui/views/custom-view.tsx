"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";

import { HeroSection } from "../components/custom/hero";
import { StickerStudioForm } from "../components/custom/studio-form";
import { PricingBar } from "../components/custom/pricing";
import { HowItWorksSection } from "../components/custom/work";
import { CommunityGallery } from "../components/custom/gallery";
import { PreviewModal } from "../components/custom/preview-modal";

import useCart from "@/hooks/use-cart";
import useGalleryStore from "@/hooks/use-gallery";
import { calculatePrice } from "@/lib/utils";
import type { StickerShape, StickerMaterial } from "@/types";

export const CustomView = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedShape, setSelectedShape] = useState<StickerShape>("die-cut");
  const [selectedMaterial, setSelectedMaterial] =
    useState<StickerMaterial>("matte");
  const [stickerWidth, setStickerWidth] = useState(3);
  const [quantity, setQuantity] = useState(1);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [stickerName, setStickerName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [shareToGallery, setShareToGallery] = useState(false);
  const [galleryTab, setGalleryTab] = useState<"all" | "mine">("all");

  const cart = useCart();
  const galleryStore = useGalleryStore();

  const price = calculatePrice(stickerWidth, selectedMaterial, quantity);
  const unitPrice = Math.round(price / quantity);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearImage = () => {
    setUploadedImage(null);
  };

  const handleAddToCart = () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first!");
      return;
    }
    setShowPreviewModal(true);
  };

  const confirmAddToCart = () => {
    if (!uploadedImage) return;

    cart.addItem(
      {
        productId: `custom-${Date.now()}`,
        name:
          stickerName || `Custom ${selectedShape} Sticker (${stickerWidth}")`,
        price: String(unitPrice),
        image: uploadedImage,
        category: "Custom Stickers",
        slug: `custom-sticker-${Date.now()}`,
      },
      quantity
    );

    if (shareToGallery && stickerName && artistName) {
      galleryStore.addSticker({
        image: uploadedImage,
        name: stickerName,
        artist: artistName.startsWith("@") ? artistName : `@${artistName}`,
        shape: selectedShape,
        material: selectedMaterial,
        size: stickerWidth,
        isUserCreation: true,
      });
      toast.success("Added to cart & shared to gallery! 🎨");
    } else {
      toast.success("Custom sticker added to cart!");
    }

    setShowPreviewModal(false);
    setStickerName("");
    setArtistName("");
    setShareToGallery(false);
  };

  return (
    <div className="min-h-screen">
      <HeroSection />

      <StickerStudioForm
        uploadedImage={uploadedImage}
        isDragging={isDragging}
        selectedShape={selectedShape}
        selectedMaterial={selectedMaterial}
        stickerWidth={stickerWidth}
        quantity={quantity}
        onImageUpload={handleFile}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onFileInput={handleFileInput}
        onClearImage={clearImage}
        onShapeChange={setSelectedShape}
        onMaterialChange={setSelectedMaterial}
        onSizeChange={setStickerWidth}
        onQuantityChange={setQuantity}
      />

      <PricingBar
        price={price}
        unitPrice={unitPrice}
        quantity={quantity}
        onAddToCart={handleAddToCart}
      />

      <HowItWorksSection />

      <section id="community-gallery">
        <CommunityGallery
          stickers={galleryStore.stickers}
          userStickerIds={galleryStore.userStickers}
          activeTab={galleryTab}
          onTabChange={setGalleryTab}
          onLike={galleryStore.likeSticker}
          onDelete={galleryStore.removeSticker}
        />
      </section>

      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        uploadedImage={uploadedImage || ""}
        selectedShape={selectedShape}
        selectedMaterial={selectedMaterial}
        stickerWidth={stickerWidth}
        quantity={quantity}
        unitPrice={unitPrice}
        price={price}
        stickerName={stickerName}
        setStickerName={setStickerName}
        artistName={artistName}
        setArtistName={setArtistName}
        shareToGallery={shareToGallery}
        setShareToGallery={setShareToGallery}
        onConfirm={confirmAddToCart}
      />
    </div>
  );
};
