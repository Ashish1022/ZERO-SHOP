"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { HeroSection } from "../components/custom/hero";
import { StickerPreview } from "../components/custom/sticker-preview";
import { ImagePlus, Upload, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export type StickerShape = "die-cut" | "circle" | "square" | "rectangle";
export type StickerMaterial = "matte" | "glossy" | "holographic";

export const CustomView = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<StickerShape>("die-cut");
  const [selectedMaterial, setSelectedMaterial] =
    useState<StickerMaterial>("matte");
    const [stickerWidth, setStickerWidth] = useState(3);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      <section id="studio" className="section-light py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Sticker Studio
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Upload your design and customize every detail. See your sticker
              come to life in real-time.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
            <div className="space-y-6">
              <motion.div
                className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
                  isDragging
                    ? "border-foreground bg-foreground/5"
                    : uploadedImage
                    ? "border-gray-200 bg-white"
                    : "border-gray-300 hover:border-gray-400 bg-gray-50"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />

                <AnimatePresence mode="wait">
                  {uploadedImage ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative aspect-square"
                    >
                      <StickerPreview
                        image={uploadedImage}
                        shape={selectedShape}
                        material={selectedMaterial}
                      />
                      <button
                        onClick={clearImage}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.label
                      key="upload"
                      htmlFor="file-upload"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center aspect-square cursor-pointer group"
                    >
                      <motion.div
                        className="p-6 rounded-full bg-white border border-gray-200 mb-6 group-hover:border-gray-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Upload className="h-10 w-10 text-gray-400 group-hover:text-foreground transition-colors" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-2">
                        Drop your artwork here
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        or click to browse files
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ImagePlus className="h-4 w-4" />
                        <span>PNG, JPG, SVG up to 10MB</span>
                      </div>
                    </motion.label>
                  )}
                </AnimatePresence>
              </motion.div>

              <div className="lg:hidden space-y-6">
                {/* <Slider value={stickerWidth} onChange={setStickerWidth} />
                <QuantitySelector value={quantity} onChange={setQuantity} /> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
