"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Check, ImagePlus, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import useGalleryStore from "@/hooks/use-gallery-store";
import toast from "react-hot-toast";

// Local imports
import type { StickerShape, StickerMaterial } from "./types";
import { SHAPES, MATERIALS } from "./constants";
import { calculatePrice, getDiscountMessage } from "./utils";
import {
    HeroSection,
    StickerPreview,
    SizeSlider,
    QuantitySelector,
    HowItWorksSection,
    CommunityGallerySection,
    PreviewModal,
} from "./components";

export default function CustomStickerStudioPage() {
    // State
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedShape, setSelectedShape] = useState<StickerShape>("die-cut");
    const [selectedMaterial, setSelectedMaterial] = useState<StickerMaterial>("matte");
    const [stickerWidth, setStickerWidth] = useState(3);
    const [quantity, setQuantity] = useState(1);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [stickerName, setStickerName] = useState("");
    const [artistName, setArtistName] = useState("");
    const [shareToGallery, setShareToGallery] = useState(false);
    const [galleryTab, setGalleryTab] = useState<"all" | "mine">("all");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Hooks
    const cart = useCart();
    const galleryStore = useGalleryStore();

    // Computed values
    const price = calculatePrice(stickerWidth, selectedMaterial, quantity);
    const unitPrice = Math.round(price / quantity);

    // Handlers
    const handleFile = useCallback((file: File) => {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => setUploadedImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files[0]);
    }, [handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleAddToCart = () => {
        if (!uploadedImage) {
            toast.error("Please upload an image first!");
            return;
        }
        setShowPreviewModal(true);
    };

    const confirmAddToCart = () => {
        if (!uploadedImage) return;

        cart.addItem({
            productId: `custom-${Date.now()}`,
            name: stickerName || `Custom ${selectedShape} Sticker (${stickerWidth}")`,
            price: String(unitPrice),
            image: uploadedImage,
            category: "Custom Stickers",
            slug: `custom-sticker-${Date.now()}`,
        }, quantity);

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

    const clearImage = () => {
        setUploadedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <HeroSection />

            {/* Studio Interface */}
            <section id="studio" className="section-light py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Sticker Studio</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Upload your design and customize every detail. See your sticker come to life in real-time.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
                        {/* Upload Zone & Preview */}
                        <div className="space-y-6">
                            <UploadZone
                                uploadedImage={uploadedImage}
                                isDragging={isDragging}
                                fileInputRef={fileInputRef}
                                selectedShape={selectedShape}
                                selectedMaterial={selectedMaterial}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onFileInput={handleFileInput}
                                onClearImage={clearImage}
                            />
                            <div className="lg:hidden space-y-6">
                                <SizeSlider value={stickerWidth} onChange={setStickerWidth} />
                                <QuantitySelector value={quantity} onChange={setQuantity} />
                            </div>
                        </div>

                        {/* Customization Sidebar */}
                        <CustomizationPanel
                            selectedShape={selectedShape}
                            selectedMaterial={selectedMaterial}
                            stickerWidth={stickerWidth}
                            quantity={quantity}
                            onShapeChange={setSelectedShape}
                            onMaterialChange={setSelectedMaterial}
                            onSizeChange={setStickerWidth}
                            onQuantityChange={setQuantity}
                        />
                    </div>
                </div>
            </section>

            {/* Sticky Pricing Bar */}
            <PricingBar
                price={price}
                unitPrice={unitPrice}
                quantity={quantity}
                onAddToCart={handleAddToCart}
            />

            {/* How It Works Section */}
            <HowItWorksSection />

            {/* Community Gallery */}
            <section id="community-gallery">
                <CommunityGallerySection
                    stickers={galleryStore.stickers}
                    userStickerIds={galleryStore.userStickers}
                    activeTab={galleryTab}
                    onTabChange={setGalleryTab}
                    onLike={galleryStore.likeSticker}
                    onDelete={galleryStore.removeSticker}
                />
            </section>

            {/* Preview Modal */}
            <PreviewModal
                isOpen={showPreviewModal}
                onClose={() => setShowPreviewModal(false)}
                image={uploadedImage || ""}
                shape={selectedShape}
                material={selectedMaterial}
                stickerWidth={stickerWidth}
                quantity={quantity}
                price={price}
                unitPrice={unitPrice}
                stickerName={stickerName}
                artistName={artistName}
                shareToGallery={shareToGallery}
                onStickerNameChange={setStickerName}
                onArtistNameChange={setArtistName}
                onShareToGalleryChange={setShareToGallery}
                onConfirm={confirmAddToCart}
            />
        </div>
    );
}

// Upload Zone Component
function UploadZone({ uploadedImage, isDragging, fileInputRef, selectedShape, selectedMaterial, onDrop, onDragOver, onDragLeave, onFileInput, onClearImage }: {
    uploadedImage: string | null; isDragging: boolean; fileInputRef: React.RefObject<HTMLInputElement | null>;
    selectedShape: StickerShape; selectedMaterial: StickerMaterial;
    onDrop: (e: React.DragEvent) => void; onDragOver: (e: React.DragEvent) => void; onDragLeave: (e: React.DragEvent) => void;
    onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void; onClearImage: () => void;
}) {
    return (
        <motion.div
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${isDragging ? "border-foreground bg-foreground/5" : uploadedImage ? "border-gray-200 bg-white" : "border-gray-300 hover:border-gray-400 bg-gray-50"}`}
            onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileInput} className="hidden" id="file-upload" />
            <AnimatePresence mode="wait">
                {uploadedImage ? (
                    <motion.div key="preview" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative aspect-square">
                        <StickerPreview image={uploadedImage} shape={selectedShape} material={selectedMaterial} />
                        <button onClick={onClearImage} className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-black"><X className="h-5 w-5" /></button>
                    </motion.div>
                ) : (
                    <motion.label key="upload" htmlFor="file-upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center aspect-square cursor-pointer group">
                        <motion.div className="p-6 rounded-full bg-white border border-gray-200 mb-6 group-hover:border-gray-400" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Upload className="h-10 w-10 text-gray-400 group-hover:text-foreground transition-colors" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2">Drop your artwork here</h3>
                        <p className="text-muted-foreground text-sm mb-4">or click to browse files</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground"><ImagePlus className="h-4 w-4" /><span>PNG, JPG, SVG up to 10MB</span></div>
                    </motion.label>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// Customization Panel Component
function CustomizationPanel({ selectedShape, selectedMaterial, stickerWidth, quantity, onShapeChange, onMaterialChange, onSizeChange, onQuantityChange }: {
    selectedShape: StickerShape; selectedMaterial: StickerMaterial; stickerWidth: number; quantity: number;
    onShapeChange: (shape: StickerShape) => void; onMaterialChange: (material: StickerMaterial) => void;
    onSizeChange: (size: number) => void; onQuantityChange: (qty: number) => void;
}) {
    return (
        <motion.div className="space-y-8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div>
                <h3 className="text-lg font-semibold mb-4">Shape</h3>
                <div className="grid grid-cols-4 gap-3">
                    {SHAPES.map((shape) => (
                        <button key={shape.id} onClick={() => onShapeChange(shape.id)} className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${selectedShape === shape.id ? "border-foreground bg-foreground/5 text-foreground" : "border-gray-200 hover:border-gray-400 text-gray-medium"}`}>
                            <shape.icon className="h-6 w-6" /><span className="text-xs font-medium">{shape.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-4">Material</h3>
                <div className="space-y-3">
                    {MATERIALS.map((material) => (
                        <button key={material.id} onClick={() => onMaterialChange(material.id)} className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${selectedMaterial === material.id ? "border-foreground bg-foreground/5" : "border-gray-200 hover:border-gray-400"}`}>
                            <div className={`p-3 rounded-lg ${selectedMaterial === material.id ? "bg-foreground text-white" : "bg-gray-100 text-gray-medium"}`}><material.icon className="h-5 w-5" /></div>
                            <div className="text-left flex-1"><div className="font-medium">{material.label}</div><div className="text-sm text-muted-foreground">{material.description}</div></div>
                            {selectedMaterial === material.id && <Check className="h-5 w-5 text-foreground" />}
                        </button>
                    ))}
                </div>
            </div>
            <div className="hidden lg:block"><SizeSlider value={stickerWidth} onChange={onSizeChange} /></div>
            <div className="hidden lg:block"><QuantitySelector value={quantity} onChange={onQuantityChange} /></div>
        </motion.div>
    );
}

// Pricing Bar Component
function PricingBar({ price, unitPrice, quantity, onAddToCart }: { price: number; unitPrice: number; quantity: number; onAddToCart: () => void }) {
    return (
        <motion.div className="sticky bottom-0 z-40 bg-white border-t border-gray-200" initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-6">
                        <div><div className="text-sm text-muted-foreground">Total Price</div><div className="text-3xl font-bold">₹{price}</div></div>
                        <div className="hidden sm:block text-sm text-muted-foreground">
                            <div>₹{unitPrice} per sticker × {quantity} qty</div>
                            <div className="text-foreground font-medium">{getDiscountMessage(quantity)}</div>
                        </div>
                    </div>
                    <Button variant="default" size="xl" className="group" onClick={onAddToCart}>
                        <ShoppingCart className="h-5 w-5" />Add to Cart<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
