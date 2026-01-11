import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Upload } from "lucide-react";

export const StickerPeel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
}, []);


  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 3 + 4,
    delay: Math.random() * 2,
  }));

  const floatingStickers = [
    {
      shape: "circle",
      size: "w-32 h-32",
      position: "top-8 left-8",
      delay: 0,
      label: "DIE-CUT",
    },
    {
      shape: "square",
      size: "w-28 h-28",
      position: "top-4 right-12",
      delay: 0.5,
      label: "SQUARE",
    },
    {
      shape: "hexagon",
      size: "w-36 h-36",
      position: "bottom-12 left-4",
      delay: 1,
      label: "CUSTOM",
    },
    {
      shape: "rectangle",
      size: "w-40 h-24",
      position: "bottom-8 right-8",
      delay: 1.5,
      label: "RECTANGLE",
    },
  ];

  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto">
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
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute w-80 h-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute w-72 h-72 rounded-full border border-white/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
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

        <motion.div
          className="absolute w-44 h-44 rounded-full border-2 border-white/10"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="relative z-10 w-40 h-40 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden"
          animate={{
            scale: [1, 1.02, 1],
            borderColor: [
              "rgba(255,255,255,0.1)",
              "rgba(255,255,255,0.25)",
              "rgba(255,255,255,0.1)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ["-200%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />

          <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent" />

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
            <div className="text-xs text-white/40 mt-1">
              Any Shape • Any Size
            </div>
          </div>
        </motion.div>
      </motion.div>
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
            y: {
              duration: 3,
              repeat: Infinity,
              delay: sticker.delay,
              ease: "easeInOut",
            },
            rotate: {
              duration: 0.5,
              repeat: activeIndex === index ? Infinity : 0,
              repeatDelay: 2,
            },
          }}
        >
          <motion.div
            className={`relative ${sticker.size} ${
              sticker.shape === "circle"
                ? "rounded-full"
                : sticker.shape === "hexagon"
                ? "rounded-2xl rotate-12"
                : sticker.shape === "rectangle"
                ? "rounded-xl"
                : "rounded-xl"
            } bg-white/5 backdrop-blur-sm border ${
              activeIndex === index ? "border-white/50" : "border-white/10"
            } flex items-center justify-center transition-all duration-300 overflow-hidden`}
            whileHover={{ scale: 1.08, borderColor: "rgba(255,255,255,0.5)" }}
          >
            {activeIndex === index && (
              <motion.div
                className="absolute inset-0 bg-white/10"
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}

            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent" />

            {activeIndex === index && (
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              />
            )}

            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  sticker.shape === "circle"
                    ? "radial-gradient(circle at center, white 1px, transparent 1px)"
                    : "linear-gradient(45deg, white 1px, transparent 1px)",
                backgroundSize:
                  sticker.shape === "circle" ? "12px 12px" : "8px 8px",
              }}
            />

            <motion.div
              className={`relative text-center ${
                sticker.shape === "hexagon" ? "-rotate-12" : ""
              }`}
              animate={activeIndex === index ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <div
                className={`text-[10px] font-bold tracking-widest transition-colors ${
                  activeIndex === index ? "text-white/90" : "text-white/60"
                }`}
              >
                {sticker.label}
              </div>
            </motion.div>

            {activeIndex === index && (
              <motion.div
                className="absolute inset-0 border-2 border-white/30"
                style={{ borderRadius: "inherit" }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: [0, 1, 0], scale: [0.9, 1, 1.1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}

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
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6">
        {floatingStickers.map((sticker, index) => (
          <motion.button
            key={sticker.shape}
            onClick={() => setActiveIndex(index)}
            className={`text-xs font-medium transition-all ${
              activeIndex === index
                ? "text-white"
                : "text-white/40 hover:text-white/60"
            }`}
            animate={
              activeIndex === index ? { scale: [1, 1.1, 1] } : { scale: 1 }
            }
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
};
