import Image from "next/image";
import {
  Eye,
  User,
  Heart,
  Trash2,
  Package,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

import type { GallerySticker } from "@/types";

interface CommunityGalleryProps {
  stickers: GallerySticker[];
  userStickerIds: string[];
  activeTab: "all" | "mine";
  onTabChange: (tab: "all" | "mine") => void;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CommunityGallery({
  stickers,
  userStickerIds,
  activeTab,
  onTabChange,
  onLike,
  onDelete,
}: CommunityGalleryProps) {
  const displayStickers =
    activeTab === "mine"
      ? stickers.filter((s) => userStickerIds.includes(s.id))
      : stickers;

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-linear-to-b from-white via-slate-50 to-white">
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="container relative mx-auto px-4 mb-12">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-6">
              <Sparkles className="h-4 w-4 text-slate-700" />
              <span className="text-sm font-medium text-slate-700">Community Showcase</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-black bg-clip-text text-transparent">
              Community Creations
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Get inspired by amazing custom stickers from our creative community
            </p>
          </motion.div>

          <motion.div 
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Button
              onClick={() => onTabChange("all")}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === "all"
                  ? "bg-black text-white shadow-lg shadow-black/20"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                All Creations
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === "all" ? "bg-white/20" : "bg-slate-100"
                }`}>
                  {stickers.length}
                </span>
              </span>
            </Button>
            <Button
              onClick={() => onTabChange("mine")}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === "mine"
                  ? "bg-black text-white shadow-lg shadow-black/20"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                My Stickers
                {userStickerIds.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activeTab === "mine" ? "bg-white/20" : "bg-slate-100"
                  }`}>
                    {userStickerIds.length}
                  </span>
                )}
              </span>
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="container relative mx-auto px-4">
        {displayStickers.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center border border-slate-200 shadow-inner">
              <Package className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">
              {activeTab === "mine" ? "No stickers yet" : "Gallery is empty"}
            </h3>
            <p className="text-slate-600 mb-6">
              {activeTab === "mine"
                ? "Create a sticker and share it to see it here!"
                : "Be the first to share your creation!"}
            </p>
            <Button
              variant="default"
              className="bg-black text-white hover:bg-slate-900 shadow-lg shadow-black/20"
              onClick={() => {
                document
                  .getElementById("studio")
                  ?.scrollIntoView({ behavior: "smooth" });
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
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border-2 border-slate-200 transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:border-slate-300 hover:-translate-y-1">
                    {sticker.image ? (
                      <Image
                        src={sticker.image}
                        alt={sticker.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
                        <div className="text-center">
                          <Sparkles className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                          <span className="text-sm font-medium text-slate-500">
                            {sticker.name}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg ${
                          sticker.material === "holographic"
                            ? "bg-black/80 text-white border border-white/20"
                            : sticker.material === "glossy"
                            ? "bg-white/90 text-slate-800 border border-slate-200"
                            : "bg-slate-800/80 text-white border border-white/20"
                        }`}
                      >
                        {sticker.material}
                      </span>
                    </div>

                    {userStickerIds.includes(sticker.id) && (
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black text-white shadow-lg">
                          Yours
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                      <div className="text-white mb-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="font-bold text-lg drop-shadow-lg">{sticker.name}</div>
                        <div className="text-sm text-white/80 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {sticker.artist}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        <Button
                          onClick={() => onLike(sticker.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-sm transition-all border border-white/20"
                        >
                          <Heart className="h-4 w-4" />
                          <span className="font-semibold">{sticker.likes}</span>
                        </Button>

                        {userStickerIds.includes(sticker.id) && (
                          <Button
                            onClick={() => onDelete(sticker.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/90 hover:bg-red-600 backdrop-blur-md text-white text-sm transition-all shadow-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 px-1">
                    <div className="font-semibold text-slate-900 truncate">
                      {sticker.name}
                    </div>
                    <div className="text-sm text-slate-600 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {sticker.artist}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <motion.div 
        className="container relative mx-auto px-4 mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="default"
          size="lg"
          className="group bg-black text-white shadow-xl shadow-black/20 px-8 py-6 text-lg"
          onClick={() => {
            document
              .getElementById("studio")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Create Your Own
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </section>
  );
}