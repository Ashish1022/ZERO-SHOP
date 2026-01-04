"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StickerPeelAnimation from "./StickerPeelAnimation";

export default function HeroSection() {
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
