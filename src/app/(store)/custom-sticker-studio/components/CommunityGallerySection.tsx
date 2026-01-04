"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Eye, User, Heart, Trash2, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GallerySticker } from "../types";

interface Props {
    stickers: GallerySticker[];
    userStickerIds: string[];
    activeTab: "all" | "mine";
    onTabChange: (tab: "all" | "mine") => void;
    onLike: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function CommunityGallerySection({ stickers, userStickerIds, activeTab, onTabChange, onLike, onDelete }: Props) {
    const displayStickers = activeTab === "mine" ? stickers.filter(s => userStickerIds.includes(s.id)) : stickers;

    return (
        <section className="section-light py-24 md:py-32 overflow-hidden">
            <div className="container mx-auto px-4 mb-12">
                <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">Community <span className="text-muted-foreground">Creations</span></h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">Get inspired by amazing custom stickers from our creative community</p>
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {(["all", "mine"] as const).map(tab => (
                            <button key={tab} onClick={() => onTabChange(tab)} className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === tab ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                                <span className="flex items-center gap-2">
                                    {tab === "all" ? <Eye className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                    {tab === "all" ? "All Creations" : "My Stickers"}
                                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">{tab === "all" ? stickers.length : userStickerIds.length}</span>
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
            <div className="container mx-auto px-4">
                {displayStickers.length === 0 ? (
                    <EmptyState activeTab={activeTab} />
                ) : (
                    <GalleryGrid stickers={displayStickers} userStickerIds={userStickerIds} onLike={onLike} onDelete={onDelete} />
                )}
            </div>
            <motion.div className="container mx-auto px-4 mt-16 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Button variant="default" size="xl" className="group" onClick={() => document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' })}>
                    Create Your Own <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
            </motion.div>
        </section>
    );
}

function EmptyState({ activeTab }: { activeTab: "all" | "mine" }) {
    return (
        <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center"><Package className="h-12 w-12 text-gray-300" /></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{activeTab === "mine" ? "No stickers yet" : "Gallery is empty"}</h3>
            <p className="text-muted-foreground mb-6">{activeTab === "mine" ? "Create a sticker and share it to see it here!" : "Be the first to share your creation!"}</p>
            <Button variant="default" onClick={() => document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' })}>Create Your First Sticker <ArrowRight className="h-4 w-4 ml-2" /></Button>
        </motion.div>
    );
}

function GalleryGrid({ stickers, userStickerIds, onLike, onDelete }: { stickers: GallerySticker[]; userStickerIds: string[]; onLike: (id: string) => void; onDelete: (id: string) => void }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <AnimatePresence mode="popLayout">
                {stickers.map((sticker, index) => (
                    <StickerCard key={sticker.id} sticker={sticker} index={index} isUserCreation={userStickerIds.includes(sticker.id)} onLike={onLike} onDelete={onDelete} />
                ))}
            </AnimatePresence>
        </div>
    );
}

function StickerCard({ sticker, index, isUserCreation, onLike, onDelete }: { sticker: GallerySticker; index: number; isUserCreation: boolean; onLike: (id: string) => void; onDelete: (id: string) => void }) {
    return (
        <motion.div layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="group">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 transition-all hover:shadow-xl hover:border-gray-300">
                {sticker.image ? <Image src={sticker.image} alt={sticker.name} fill className="object-cover" /> : <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center"><Sparkles className="h-12 w-12 text-gray-300" /></div>}
                <div className="absolute top-3 left-3"><span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${sticker.material === "holographic" ? "bg-gray-900 text-white" : sticker.material === "glossy" ? "bg-white/80 text-gray-700 border border-gray-200" : "bg-gray-700 text-white"}`}>{sticker.material}</span></div>
                {isUserCreation && <div className="absolute top-3 right-3"><span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">Your Creation</span></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <div className="text-white mb-3"><div className="font-bold text-lg">{sticker.name}</div><div className="text-sm text-white/70 flex items-center gap-1"><User className="h-3 w-3" />{sticker.artist}</div></div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onLike(sticker.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm"><Heart className="h-4 w-4" />{sticker.likes}</button>
                        {isUserCreation && <button onClick={() => onDelete(sticker.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500/80 hover:bg-red-500 text-white text-sm"><Trash2 className="h-4 w-4" />Delete</button>}
                    </div>
                </div>
            </div>
            <div className="mt-3 px-1"><div className="font-medium text-gray-900 truncate">{sticker.name}</div><div className="text-sm text-muted-foreground">{sticker.artist}</div></div>
        </motion.div>
    );
}
