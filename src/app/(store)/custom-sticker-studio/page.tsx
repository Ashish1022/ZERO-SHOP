"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
    Upload,
    Circle,
    Square,
    Hexagon,
    RectangleHorizontal,
    Sparkles,
    Droplets,
    Layers,
    Minus,
    Plus,
    ShoppingCart,
    ArrowRight,
    Check,
    ImagePlus,
    Truck,
    Scissors,
    Package,
    X,
    Share2,
    Heart,
    User,
    Eye,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import useGalleryStore from "@/hooks/use-gallery-store";
import toast from "react-hot-toast";

// Types
type StickerShape = "die-cut" | "circle" | "square" | "rectangle";
type StickerMaterial = "matte" | "glossy" | "holographic";

interface PricingTier {
    minWidth: number;
    basePrice: number;
    perInchPrice: number;
}

// Pricing configuration
const PRICING_TIERS: PricingTier[] = [
    { minWidth: 2, basePrice: 29, perInchPrice: 15 },
    { minWidth: 4, basePrice: 59, perInchPrice: 12 },
    { minWidth: 6, basePrice: 89, perInchPrice: 10 },
    { minWidth: 8, basePrice: 119, perInchPrice: 8 },
];

const MATERIAL_MULTIPLIERS: Record<StickerMaterial, number> = {
    matte: 1,
    glossy: 1.15,
    holographic: 1.4,
};

// Calculate price based on size, material, and quantity
const calculatePrice = (
    width: number,
    material: StickerMaterial,
    quantity: number
): number => {
    let tier = PRICING_TIERS[0];
    for (const t of PRICING_TIERS) {
        if (width >= t.minWidth) tier = t;
    }
    const basePrice = tier.basePrice + (width - tier.minWidth) * tier.perInchPrice;
    const materialPrice = basePrice * MATERIAL_MULTIPLIERS[material];
    const quantityDiscount = quantity >= 10 ? 0.9 : quantity >= 5 ? 0.95 : 1;
    return Math.round(materialPrice * quantity * quantityDiscount);
};

// Shape configuration
const SHAPES: { id: StickerShape; icon: typeof Circle; label: string }[] = [
    { id: "die-cut", icon: Hexagon, label: "Die-Cut" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "square", icon: Square, label: "Square" },
    { id: "rectangle", icon: RectangleHorizontal, label: "Rectangle" },
];

// Material configuration
const MATERIALS: { id: StickerMaterial; icon: typeof Sparkles; label: string; description: string }[] = [
    { id: "matte", icon: Layers, label: "Matte", description: "Smooth, non-reflective finish" },
    { id: "glossy", icon: Droplets, label: "Glossy", description: "Shiny, vibrant colors" },
    { id: "holographic", icon: Sparkles, label: "Holographic", description: "Rainbow shimmer effect" },
];

export default function CustomStickerStudioPage() {
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
    const cart = useCart();
    const galleryStore = useGalleryStore();

    const price = calculatePrice(stickerWidth, selectedMaterial, quantity);
    const unitPrice = Math.round(price / quantity);

    // Handle file upload
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

    // Open preview modal instead of direct cart add
    const handleAddToCart = () => {
        if (!uploadedImage) {
            toast.error("Please upload an image first!");
            return;
        }
        setShowPreviewModal(true);
    };

    // Confirm and add to cart from modal
    const confirmAddToCart = () => {
        if (!uploadedImage) return;

        // Add to cart
        cart.addItem({
            productId: `custom-${Date.now()}`,
            name: stickerName || `Custom ${selectedShape} Sticker (${stickerWidth}")`,
            price: String(unitPrice),
            image: uploadedImage,
            category: "Custom Stickers",
            slug: `custom-sticker-${Date.now()}`,
        }, quantity);

        // Share to gallery if opted in
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

        // Reset form
        setShowPreviewModal(false);
        setStickerName("");
        setArtistName("");
        setShareToGallery(false);
    };

    const clearImage = () => {
        setUploadedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section - Dark Theme */}
            <HeroSection />

            {/* Studio Interface - Light Theme */}
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
                            {/* Upload Area */}
                            <motion.div
                                className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${isDragging
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

                            {/* Size & Quantity - Mobile */}
                            <div className="lg:hidden space-y-6">
                                <SizeSlider value={stickerWidth} onChange={setStickerWidth} />
                                <QuantitySelector value={quantity} onChange={setQuantity} />
                            </div>
                        </div>

                        {/* Customization Sidebar */}
                        <motion.div
                            className="space-y-8"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {/* Shape Selector */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Shape</h3>
                                <div className="grid grid-cols-4 gap-3">
                                    {SHAPES.map((shape) => (
                                        <button
                                            key={shape.id}
                                            onClick={() => setSelectedShape(shape.id)}
                                            className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${selectedShape === shape.id
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

                            {/* Material Selector */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Material</h3>
                                <div className="space-y-3">
                                    {MATERIALS.map((material) => (
                                        <button
                                            key={material.id}
                                            onClick={() => setSelectedMaterial(material.id)}
                                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${selectedMaterial === material.id
                                                ? "border-foreground bg-foreground/5"
                                                : "border-gray-200 hover:border-gray-400"
                                                }`}
                                        >
                                            <div
                                                className={`p-3 rounded-lg ${selectedMaterial === material.id
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

                            {/* Size Slider - Desktop */}
                            <div className="hidden lg:block">
                                <SizeSlider value={stickerWidth} onChange={setStickerWidth} />
                            </div>

                            {/* Quantity Selector - Desktop */}
                            <div className="hidden lg:block">
                                <QuantitySelector value={quantity} onChange={setQuantity} />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Sticky Pricing Bar */}
            <motion.div
                className="sticky bottom-0 z-40 bg-white border-t border-gray-200"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-6">
                            <div>
                                <div className="text-sm text-muted-foreground">Total Price</div>
                                <div className="text-3xl font-bold">₹{price}</div>
                            </div>
                            <div className="hidden sm:block text-sm text-muted-foreground">
                                <div>₹{unitPrice} per sticker × {quantity} qty</div>
                                <div className="text-foreground font-medium">
                                    {quantity >= 10 ? "10% bulk discount applied!" : quantity >= 5 ? "5% discount applied!" : "Order 5+ for discounts"}
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="default"
                            size="xl"
                            className="group"
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            Add to Cart
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* How It Works Section - Dark Theme */}
            <HowItWorksSection />

            {/* Community Gallery - Light Theme */}
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
            <AnimatePresence>
                {showPreviewModal && uploadedImage && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPreviewModal(false)}
                        />

                        {/* Modal Content */}
                        <motion.div
                            className="relative bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-700" />
                            </button>

                            {/* Header */}
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-6">
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

                            {/* Preview Content */}
                            <div className="p-8">
                                {/* Sticker Preview */}
                                <div className="relative aspect-square max-w-xs mx-auto mb-8 rounded-2xl overflow-hidden border-4 border-gray-100 shadow-xl">
                                    <StickerPreview
                                        image={uploadedImage}
                                        shape={selectedShape}
                                        material={selectedMaterial}
                                    />
                                </div>

                                {/* Customization Summary */}
                                <div className="space-y-4 mb-8">
                                    <h4 className="font-semibold text-lg text-center mb-4">Your Customization</h4>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                            <div className="text-sm text-muted-foreground mb-1">Shape</div>
                                            <div className="font-semibold capitalize">{selectedShape}</div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                            <div className="text-sm text-muted-foreground mb-1">Material</div>
                                            <div className="font-semibold capitalize">{selectedMaterial}</div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                            <div className="text-sm text-muted-foreground mb-1">Size</div>
                                            <div className="font-semibold">{stickerWidth}" width</div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                            <div className="text-sm text-muted-foreground mb-1">Quantity</div>
                                            <div className="font-semibold">{quantity} stickers</div>
                                        </div>
                                    </div>

                                    {/* Price Summary */}
                                    <div className="p-6 rounded-2xl bg-gray-900 text-white mt-6">
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

                                    {/* Share to Gallery Section */}
                                    <div className="mt-6 p-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50">
                                        <div className="flex items-start gap-4">
                                            <button
                                                onClick={() => setShareToGallery(!shareToGallery)}
                                                className={`flex-shrink-0 w-12 h-7 rounded-full transition-colors duration-200 ${shareToGallery ? "bg-green-500" : "bg-gray-300"
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 m-1 ${shareToGallery ? "translate-x-5" : "translate-x-0"
                                                    }`} />
                                            </button>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Share2 className="h-4 w-4 text-gray-600" />
                                                    <span className="font-semibold text-gray-900">Share to Community Gallery</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    Let others see your awesome creation! Your sticker will appear in the gallery below.
                                                </p>

                                                {/* Share fields */}
                                                <AnimatePresence>
                                                    {shareToGallery && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="space-y-3 overflow-hidden"
                                                        >
                                                            <div>
                                                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                                                    Sticker Name *
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={stickerName}
                                                                    onChange={(e) => setStickerName(e.target.value)}
                                                                    placeholder="e.g. Neon Cat, Kawaii Cloud..."
                                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-400 focus:outline-none transition-colors"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                                                    Your Artist Name *
                                                                </label>
                                                                <div className="relative">
                                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                                                                    <input
                                                                        type="text"
                                                                        value={artistName.replace(/^@/, "")}
                                                                        onChange={(e) => setArtistName(e.target.value.replace(/^@/, ""))}
                                                                        placeholder="your_username"
                                                                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-400 focus:outline-none transition-colors"
                                                                    />
                                                                </div>
                                                            </div>
                                                            {shareToGallery && (!stickerName || !artistName) && (
                                                                <p className="text-xs text-amber-600 flex items-center gap-1">
                                                                    <span>⚠️</span> Fill both fields to share to gallery
                                                                </p>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="flex-1"
                                        onClick={() => setShowPreviewModal(false)}
                                    >
                                        Edit Design
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="lg"
                                        className="flex-1 group"
                                        onClick={confirmAddToCart}
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                        Confirm & Add to Cart
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Hero Section Component
function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden section-dark">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                }} />
            </div>

            <div className="container mx-auto px-4 py-32 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left - Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                            </span>
                            <span className="text-sm font-medium">Custom Sticker Studio</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter mb-6">
                            Your Art.
                            <br />
                            <span className="text-muted-foreground">
                                Our Sticky-ness.
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/60 max-w-xl mb-10">
                            Upload your designs and we'll turn them into premium die-cut stickers.
                            Perfect for artists, creators, and anyone who wants to stick their mark.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button variant="hero" size="xl" className="group bg-white text-black hover:bg-white/90" asChild>
                                <a href="#studio">
                                    Start Creating
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </a>
                            </Button>
                            <Button
                                variant="hero-outline"
                                size="xl"
                                onClick={() => {
                                    document.getElementById('community-gallery')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                See Examples
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/10">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold">1000+</div>
                                <div className="text-sm text-white/50">Custom Orders</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold">48hr</div>
                                <div className="text-sm text-white/50">Production Time</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold">Premium</div>
                                <div className="text-sm text-white/50">Vinyl Quality</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right - Animation */}
                    <motion.div
                        className="relative hidden lg:block"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <StickerPeelAnimation />
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
                    <div className="w-1 h-2 rounded-full bg-white/40" />
                </div>
            </div>
        </section>
    );
}

// Floating Stickers Showcase - Unique Hero Animation
function StickerPeelAnimation() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Sticker shapes and positions
    const floatingStickers = [
        { shape: "circle", size: "w-32 h-32", position: "top-8 left-8", delay: 0, label: "DIE-CUT" },
        { shape: "square", size: "w-28 h-28", position: "top-4 right-12", delay: 0.5, label: "SQUARE" },
        { shape: "hexagon", size: "w-36 h-36", position: "bottom-12 left-4", delay: 1, label: "CUSTOM" },
        { shape: "rectangle", size: "w-40 h-24", position: "bottom-8 right-8", delay: 1.5, label: "RECTANGLE" },
    ];

    // Floating particles
    const particles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 3 + 4,
        delay: Math.random() * 2,
    }));

    return (
        <div className="relative w-full aspect-square max-w-lg mx-auto">
            {/* Floating particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-white pointer-events-none"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() > 0.5 ? 10 : -10, 0],
                        opacity: [0.1, 0.4, 0.1],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Sparkle effects */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={`sparkle-${i}`}
                    className="absolute pointer-events-none"
                    style={{
                        left: `${20 + i * 12}%`,
                        top: `${15 + (i % 3) * 25}%`,
                    }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut",
                    }}
                >
                    <Sparkles className="h-4 w-4 text-white/30" />
                </motion.div>
            ))}

            {/* Central upload indicator */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {/* Outer glow ring */}
                <motion.div
                    className="absolute w-80 h-80 rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
                    }}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Orbiting rings with dots */}
                <motion.div
                    className="absolute w-72 h-72 rounded-full border border-white/5"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                    {/* Orbiting dots */}
                    <motion.div
                        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white/30"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/20"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                </motion.div>

                <motion.div
                    className="absolute w-64 h-64 rounded-full border border-white/10"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <motion.div
                        className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rounded-full bg-white/40"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </motion.div>

                <motion.div
                    className="absolute w-48 h-48 rounded-full border border-white/5"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                    <motion.div
                        className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/30"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                </motion.div>

                {/* Pulsing inner ring */}
                <motion.div
                    className="absolute w-44 h-44 rounded-full border-2 border-white/10"
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Center element */}
                <motion.div
                    className="relative z-10 w-40 h-40 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden"
                    animate={{
                        scale: [1, 1.02, 1],
                        borderColor: ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.25)", "rgba(255,255,255,0.1)"],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* Shimmer effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        animate={{ x: ["-200%", "200%"] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    />

                    {/* Inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

                    <div className="text-center relative z-10">
                        <motion.div
                            className="w-16 h-16 mx-auto mb-3 rounded-xl bg-white/10 flex items-center justify-center border border-white/10"
                            animate={{
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.05, 1],
                            }}
                            transition={{ duration: 6, repeat: Infinity }}
                        >
                            <motion.div
                                animate={{ y: [0, -3, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Upload className="h-8 w-8 text-white/70" />
                            </motion.div>
                        </motion.div>
                        <motion.div
                            className="text-sm font-medium text-white/80"
                            animate={{ opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Drop Your Art
                        </motion.div>
                        <div className="text-xs text-white/40 mt-1">Any Shape • Any Size</div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Floating sticker shapes */}
            {floatingStickers.map((sticker, index) => (
                <motion.div
                    key={sticker.shape}
                    className={`absolute ${sticker.position}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: 1,
                        scale: activeIndex === index ? 1.15 : 1,
                        y: [0, -12, 0],
                        rotate: activeIndex === index ? [0, 2, -2, 0] : 0,
                    }}
                    transition={{
                        opacity: { duration: 0.5, delay: sticker.delay },
                        scale: { duration: 0.4, ease: "easeOut" },
                        y: { duration: 3, repeat: Infinity, delay: sticker.delay, ease: "easeInOut" },
                        rotate: { duration: 0.5, repeat: activeIndex === index ? Infinity : 0, repeatDelay: 2 },
                    }}
                >
                    <motion.div
                        className={`relative ${sticker.size} ${sticker.shape === "circle" ? "rounded-full" :
                                sticker.shape === "hexagon" ? "rounded-2xl rotate-12" :
                                    sticker.shape === "rectangle" ? "rounded-xl" :
                                        "rounded-xl"
                            } bg-white/5 backdrop-blur-sm border ${activeIndex === index ? "border-white/50" : "border-white/10"
                            } flex items-center justify-center transition-all duration-300 overflow-hidden`}
                        whileHover={{ scale: 1.08, borderColor: "rgba(255,255,255,0.5)" }}
                    >
                        {/* Inner glow for active */}
                        {activeIndex === index && (
                            <motion.div
                                className="absolute inset-0 bg-white/10"
                                animate={{ opacity: [0.1, 0.2, 0.1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        )}

                        {/* Inner content */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

                        {/* Shimmer effect on active */}
                        {activeIndex === index && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{ x: ["-200%", "200%"] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                            />
                        )}

                        {/* Sticker pattern */}
                        <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: sticker.shape === "circle"
                                ? "radial-gradient(circle at center, white 1px, transparent 1px)"
                                : "linear-gradient(45deg, white 1px, transparent 1px)",
                            backgroundSize: sticker.shape === "circle" ? "12px 12px" : "8px 8px",
                        }} />

                        {/* Label with animation */}
                        <motion.div
                            className={`relative text-center ${sticker.shape === "hexagon" ? "-rotate-12" : ""}`}
                            animate={activeIndex === index ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <div className={`text-[10px] font-bold tracking-widest transition-colors ${activeIndex === index ? "text-white/90" : "text-white/60"
                                }`}>
                                {sticker.label}
                            </div>
                        </motion.div>

                        {/* Active indicator - pulsing border */}
                        {activeIndex === index && (
                            <motion.div
                                className="absolute inset-0 border-2 border-white/30"
                                style={{ borderRadius: "inherit" }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: [0, 1, 0], scale: [0.9, 1, 1.1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        )}

                        {/* Corner sparkle on active */}
                        {activeIndex === index && (
                            <motion.div
                                className="absolute -top-1 -right-1"
                                animate={{ scale: [0, 1, 0], rotate: [0, 180, 360] }}
                                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
                            >
                                <Sparkles className="h-4 w-4 text-white/60" />
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Connection line to center - animated dash */}
                    <motion.svg
                        className="absolute top-1/2 left-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        animate={{ opacity: activeIndex === index ? 0.4 : 0.1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.line
                            x1="50%"
                            y1="50%"
                            x2={index < 2 ? "100%" : "0%"}
                            y2={index % 2 === 0 ? "100%" : "0%"}
                            stroke="white"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                            animate={{ strokeDashoffset: [0, 8] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    </motion.svg>
                </motion.div>
            ))}

            {/* Bottom indicators with animation */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6">
                {floatingStickers.map((sticker, index) => (
                    <motion.button
                        key={sticker.shape}
                        onClick={() => setActiveIndex(index)}
                        className={`text-xs font-medium transition-all ${activeIndex === index
                                ? "text-white"
                                : "text-white/40 hover:text-white/60"
                            }`}
                        animate={activeIndex === index ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {sticker.label}
                        {activeIndex === index && (
                            <motion.div
                                className="h-0.5 bg-white mt-1 mx-auto"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

// Sticker Preview Component
function StickerPreview({
    image,
    shape,
    material,
}: {
    image: string;
    shape: StickerShape;
    material: StickerMaterial;
}) {
    const getShapeStyles = () => {
        switch (shape) {
            case "circle":
                return "rounded-full aspect-square";
            case "square":
                return "rounded-2xl aspect-square";
            case "rectangle":
                return "rounded-2xl aspect-video";
            case "die-cut":
            default:
                return "rounded-3xl aspect-square";
        }
    };

    const getMaterialOverlay = () => {
        switch (material) {
            case "glossy":
                return (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
                );
            case "holographic":
                return (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(45deg, rgba(255,0,0,0.1), rgba(255,165,0,0.1), rgba(255,255,0,0.1), rgba(0,128,0,0.1), rgba(0,0,255,0.1), rgba(75,0,130,0.1), rgba(238,130,238,0.1))",
                        }}
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center p-8 bg-gray-50">
            {/* Checkered background pattern */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
            linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%)
          `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
            />

            {/* Sticker */}
            <motion.div
                className={`relative overflow-hidden ${getShapeStyles()} w-3/4 max-w-xs shadow-2xl border-4 border-white`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                key={shape + material}
            >
                <Image
                    src={image}
                    alt="Your sticker preview"
                    fill
                    className="object-cover"
                />
                {getMaterialOverlay()}
            </motion.div>

            {/* Labels */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-white rounded-full shadow">{shape.toUpperCase()}</span>
                <span className="px-2 py-1 bg-white rounded-full shadow">{material.toUpperCase()}</span>
            </div>
        </div>
    );
}

// Size Slider Component
function SizeSlider({
    value,
    onChange,
}: {
    value: number;
    onChange: (value: number) => void;
}) {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Size</h3>
                <span className="text-2xl font-bold">{value}"</span>
            </div>
            <div className="relative">
                <input
                    type="range"
                    min="2"
                    max="10"
                    step="0.5"
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>2"</span>
                    <span>10"</span>
                </div>
            </div>
        </div>
    );
}

// Quantity Selector Component
function QuantitySelector({
    value,
    onChange,
}: {
    value: number;
    onChange: (value: number) => void;
}) {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Quantity</h3>
                {value >= 5 && (
                    <span className="text-xs text-foreground font-medium px-2 py-1 bg-gray-100 rounded-full">
                        {value >= 10 ? "10% OFF" : "5% OFF"}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onChange(Math.max(1, value - 1))}
                    className="p-3 rounded-xl border-2 border-gray-200 hover:border-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={value <= 1}
                >
                    <Minus className="h-5 w-5" />
                </button>
                <div className="flex-1 text-center">
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={value}
                        onChange={(e) => onChange(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                        className="w-20 text-center text-2xl font-bold bg-transparent border-none outline-none"
                    />
                </div>
                <button
                    onClick={() => onChange(Math.min(100, value + 1))}
                    className="p-3 rounded-xl border-2 border-gray-200 hover:border-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={value >= 100}
                >
                    <Plus className="h-5 w-5" />
                </button>
            </div>
            <div className="flex justify-center gap-2 mt-3">
                {[5, 10, 25, 50].map((qty) => (
                    <button
                        key={qty}
                        onClick={() => onChange(qty)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${value === qty
                            ? "bg-foreground text-white"
                            : "bg-gray-100 text-gray-medium hover:bg-gray-200"
                            }`}
                    >
                        {qty}
                    </button>
                ))}
            </div>
        </div>
    );
}

// How It Works Section
function HowItWorksSection() {
    const steps = [
        {
            number: "01",
            icon: Upload,
            title: "Upload & Adjust",
            description: "Upload your artwork and customize the shape, size, and material. Preview your sticker in real-time.",
        },
        {
            number: "02",
            icon: Scissors,
            title: "We Print & Cut",
            description: "Our precision machines print your design on premium vinyl and die-cut it to perfection.",
        },
        {
            number: "03",
            icon: Truck,
            title: "Shipped to You",
            description: "Your custom stickers are carefully packaged and shipped straight to your doorstep.",
        },
    ];

    return (
        <section id="how-it-works" className="section-dark py-24 md:py-32">
            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">
                        How It <span className="text-muted-foreground">Works</span>
                    </h2>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        From your screen to your hands in just 3 simple steps
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            className="relative group"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-white/20 to-transparent z-0" />
                            )}

                            <div className="relative z-10 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                                {/* Number */}
                                <div className="text-8xl font-bold text-white/5 absolute -top-4 -left-2 select-none">
                                    {step.number}
                                </div>

                                <div className="relative mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
                                        <step.icon className="h-8 w-8 text-white" />
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="text-white/60 leading-relaxed">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Community Gallery Section
function CommunityGallerySection({
    stickers,
    userStickerIds,
    activeTab,
    onTabChange,
    onLike,
    onDelete,
}: {
    stickers: GallerySticker[];
    userStickerIds: string[];
    activeTab: "all" | "mine";
    onTabChange: (tab: "all" | "mine") => void;
    onLike: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    const displayStickers = activeTab === "mine"
        ? stickers.filter(s => userStickerIds.includes(s.id))
        : stickers;

    return (
        <section className="section-light py-24 md:py-32 overflow-hidden">
            <div className="container mx-auto px-4 mb-12">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">
                        Community <span className="text-muted-foreground">Creations</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Get inspired by amazing custom stickers from our creative community
                    </p>

                    {/* Tabs */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <button
                            onClick={() => onTabChange("all")}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === "all"
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                All Creations
                                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">
                                    {stickers.length}
                                </span>
                            </span>
                        </button>
                        <button
                            onClick={() => onTabChange("mine")}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === "mine"
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                My Stickers
                                {userStickerIds.length > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">
                                        {userStickerIds.length}
                                    </span>
                                )}
                            </span>
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Gallery Grid */}
            <div className="container mx-auto px-4">
                {displayStickers.length === 0 ? (
                    <motion.div
                        className="text-center py-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <Package className="h-12 w-12 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {activeTab === "mine" ? "No stickers yet" : "Gallery is empty"}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            {activeTab === "mine"
                                ? "Create a sticker and share it to see it here!"
                                : "Be the first to share your creation!"}
                        </p>
                        <Button
                            variant="default"
                            onClick={() => {
                                document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Create Your First Sticker
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        <AnimatePresence mode="popLayout">
                            {displayStickers.map((sticker, index) => (
                                <motion.div
                                    key={sticker.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="group"
                                >
                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 transition-all hover:shadow-xl hover:border-gray-300">
                                        {/* Sticker Image or Placeholder */}
                                        {sticker.image ? (
                                            <Image
                                                src={sticker.image}
                                                alt={sticker.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center">
                                                <div className="text-center">
                                                    <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                                                    <span className="text-sm font-medium text-gray-500">{sticker.name}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Material badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${sticker.material === "holographic"
                                                ? "bg-gray-900 text-white"
                                                : sticker.material === "glossy"
                                                    ? "bg-white/80 text-gray-700 border border-gray-200"
                                                    : "bg-gray-700 text-white"
                                                }`}>
                                                {sticker.material}
                                            </span>
                                        </div>

                                        {/* User creation badge */}
                                        {userStickerIds.includes(sticker.id) && (
                                            <div className="absolute top-3 right-3">
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                                                    Your Creation
                                                </span>
                                            </div>
                                        )}

                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                            <div className="text-white mb-3">
                                                <div className="font-bold text-lg">{sticker.name}</div>
                                                <div className="text-sm text-white/70 flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {sticker.artist}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => onLike(sticker.id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm transition-colors"
                                                >
                                                    <Heart className="h-4 w-4" />
                                                    {sticker.likes}
                                                </button>

                                                {userStickerIds.includes(sticker.id) && (
                                                    <button
                                                        onClick={() => onDelete(sticker.id)}
                                                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500/80 hover:bg-red-500 text-white text-sm transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info below card */}
                                    <div className="mt-3 px-1">
                                        <div className="font-medium text-gray-900 truncate">{sticker.name}</div>
                                        <div className="text-sm text-muted-foreground">{sticker.artist}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* CTA */}
            <motion.div
                className="container mx-auto px-4 mt-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Button
                    variant="default"
                    size="xl"
                    className="group"
                    onClick={() => {
                        document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    Create Your Own
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
            </motion.div>
        </section>
    );
}

// Type for GallerySticker used in component
interface GallerySticker {
    id: string;
    image: string;
    name: string;
    artist: string;
    shape: string;
    material: string;
    size: number;
    createdAt: string;
    likes: number;
    isUserCreation?: boolean;
}
