"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ShoppingCart, ArrowRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StickerPreview from "./StickerPreview";
import type { StickerShape, StickerMaterial } from "../types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    image: string;
    shape: StickerShape;
    material: StickerMaterial;
    stickerWidth: number;
    quantity: number;
    price: number;
    unitPrice: number;
    stickerName: string;
    artistName: string;
    shareToGallery: boolean;
    onStickerNameChange: (name: string) => void;
    onArtistNameChange: (name: string) => void;
    onShareToGalleryChange: (share: boolean) => void;
    onConfirm: () => void;
}

export default function PreviewModal({
    isOpen, onClose, image, shape, material, stickerWidth, quantity, price, unitPrice,
    stickerName, artistName, shareToGallery, onStickerNameChange, onArtistNameChange, onShareToGalleryChange, onConfirm
}: Props) {
    if (!isOpen || !image) return null;

    return (
        <AnimatePresence>
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
                <motion.div className="relative bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto" initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}>
                    <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20"><X className="h-5 w-5 text-gray-700" /></button>
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-6">
                        <div className="flex items-center gap-3 mb-2"><div className="p-2 rounded-full bg-white/10"><Check className="h-5 w-5" /></div><h3 className="text-2xl font-bold">Review Your Sticker</h3></div>
                        <p className="text-white/70">Make sure everything looks perfect before adding to cart</p>
                    </div>
                    <div className="p-8">
                        <div className="relative aspect-square max-w-xs mx-auto mb-8 rounded-2xl overflow-hidden border-4 border-gray-100 shadow-xl">
                            <StickerPreview image={image} shape={shape} material={material} />
                        </div>
                        <CustomizationSummary shape={shape} material={material} stickerWidth={stickerWidth} quantity={quantity} price={price} unitPrice={unitPrice} />
                        <ShareSection shareToGallery={shareToGallery} stickerName={stickerName} artistName={artistName} onShareToGalleryChange={onShareToGalleryChange} onStickerNameChange={onStickerNameChange} onArtistNameChange={onArtistNameChange} />
                        <div className="flex gap-4 mt-6">
                            <Button variant="outline" size="lg" className="flex-1" onClick={onClose}>Edit Design</Button>
                            <Button variant="default" size="lg" className="flex-1 group" onClick={onConfirm}><ShoppingCart className="h-5 w-5" />Confirm & Add<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function CustomizationSummary({ shape, material, stickerWidth, quantity, price, unitPrice }: { shape: string; material: string; stickerWidth: number; quantity: number; price: number; unitPrice: number }) {
    return (
        <div className="space-y-4 mb-8">
            <h4 className="font-semibold text-lg text-center mb-4">Your Customization</h4>
            <div className="grid grid-cols-2 gap-4">
                {[{ label: "Shape", value: shape }, { label: "Material", value: material }, { label: "Size", value: `${stickerWidth}" width` }, { label: "Quantity", value: `${quantity} stickers` }].map(item => (
                    <div key={item.label} className="p-4 rounded-xl bg-gray-50 border border-gray-100"><div className="text-sm text-muted-foreground mb-1">{item.label}</div><div className="font-semibold capitalize">{item.value}</div></div>
                ))}
            </div>
            <div className="p-6 rounded-2xl bg-gray-900 text-white mt-6">
                <div className="flex items-center justify-between mb-2"><span className="text-white/70">Unit Price</span><span>₹{unitPrice}</span></div>
                <div className="flex items-center justify-between mb-2"><span className="text-white/70">Quantity</span><span>× {quantity}</span></div>
                {quantity >= 5 && <div className="flex items-center justify-between mb-2 text-green-400"><span>Bulk Discount</span><span>-{quantity >= 10 ? "10%" : "5%"}</span></div>}
                <div className="border-t border-white/20 pt-3 mt-3 flex items-center justify-between"><span className="text-lg font-semibold">Total</span><span className="text-3xl font-bold">₹{price}</span></div>
            </div>
        </div>
    );
}

function ShareSection({ shareToGallery, stickerName, artistName, onShareToGalleryChange, onStickerNameChange, onArtistNameChange }: { shareToGallery: boolean; stickerName: string; artistName: string; onShareToGalleryChange: (v: boolean) => void; onStickerNameChange: (v: string) => void; onArtistNameChange: (v: string) => void }) {
    return (
        <div className="p-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50">
            <div className="flex items-start gap-4">
                <button onClick={() => onShareToGalleryChange(!shareToGallery)} className={`flex-shrink-0 w-12 h-7 rounded-full transition-colors ${shareToGallery ? "bg-green-500" : "bg-gray-300"}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md m-1 transition-transform ${shareToGallery ? "translate-x-5" : "translate-x-0"}`} />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1"><Share2 className="h-4 w-4 text-gray-600" /><span className="font-semibold text-gray-900">Share to Community Gallery</span></div>
                    <p className="text-sm text-muted-foreground mb-4">Let others see your awesome creation!</p>
                    <AnimatePresence>
                        {shareToGallery && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-3 overflow-hidden">
                                <div><label className="text-sm font-medium text-gray-700 block mb-1">Sticker Name *</label><input type="text" value={stickerName} onChange={(e) => onStickerNameChange(e.target.value)} placeholder="e.g. Neon Cat" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-400 focus:outline-none" /></div>
                                <div><label className="text-sm font-medium text-gray-700 block mb-1">Your Artist Name *</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span><input type="text" value={artistName.replace(/^@/, "")} onChange={(e) => onArtistNameChange(e.target.value.replace(/^@/, ""))} placeholder="your_username" className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-400 focus:outline-none" /></div></div>
                                {(!stickerName || !artistName) && <p className="text-xs text-amber-600 flex items-center gap-1">⚠️ Fill both fields to share</p>}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
