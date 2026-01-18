import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImagePlus, Check } from "lucide-react";

import { StickerPreview } from "./sticker-preview";
import { SizeSlider } from "./size-slider";
import { QuantitySelector } from "./quantity-selector";

import { SHAPES, MATERIALS } from "@/constants";
import type { StickerShape, StickerMaterial } from "@/types";
import { Input } from "@/components/ui/input";

interface StickerStudioFormProps {
  uploadedImage: string | null;
  isDragging: boolean;
  selectedShape: StickerShape;
  selectedMaterial: StickerMaterial;
  stickerWidth: number;
  quantity: number;
  onImageUpload: (file: File) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  onShapeChange: (shape: StickerShape) => void;
  onMaterialChange: (material: StickerMaterial) => void;
  onSizeChange: (size: number) => void;
  onQuantityChange: (qty: number) => void;
}

export function StickerStudioForm({
  uploadedImage,
  isDragging,
  selectedShape,
  selectedMaterial,
  stickerWidth,
  quantity,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileInput,
  onClearImage,
  onShapeChange,
  onMaterialChange,
  onSizeChange,
  onQuantityChange,
}: StickerStudioFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <section id="studio" className="section-light py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Sticker Studio
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload your design and customize every detail. See your sticker come
            to life in real-time.
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
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileInput}
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
                      onClick={onClearImage}
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
              <SizeSlider value={stickerWidth} onChange={onSizeChange} />
              <QuantitySelector value={quantity} onChange={onQuantityChange} />
            </div>
          </div>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >

            <div>
              <h3 className="text-lg font-semibold mb-4">Shape</h3>
              <div className="grid grid-cols-4 gap-3">
                {SHAPES.map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => onShapeChange(shape.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                      selectedShape === shape.id
                        ? "border-foreground bg-foreground/5 text-foreground"
                        : "border-gray-200 hover:border-gray-400 text-gray-medium"
                    }`}
                  >
                    <shape.icon className="h-6 w-6" />
                    <span className="text-xs font-medium">{shape.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Material</h3>
              <div className="space-y-3">
                {MATERIALS.map((material) => (
                  <button
                    key={material.id}
                    onClick={() => onMaterialChange(material.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                      selectedMaterial === material.id
                        ? "border-foreground bg-foreground/5"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        selectedMaterial === material.id
                          ? "bg-foreground text-white"
                          : "bg-gray-100 text-gray-medium"
                      }`}
                    >
                      <material.icon className="h-5 w-5" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium">{material.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {material.description}
                      </div>
                    </div>
                    {selectedMaterial === material.id && (
                      <Check className="h-5 w-5 text-foreground" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <SizeSlider value={stickerWidth} onChange={onSizeChange} />
            </div>

            <div className="hidden lg:block">
              <QuantitySelector value={quantity} onChange={onQuantityChange} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
