import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import characterSprite from "@/assets/character-scientist.png";

interface HorseExitAnimationProps {
  onComplete: () => void;
}

const DebrisParticle: React.FC<{ delay: number; size: number; emoji: string }> = ({ delay, size, emoji }) => (
  <motion.div
    className="absolute text-center select-none"
    style={{ fontSize: size }}
    initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      x: [0, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 500],
      y: [0, -100 - Math.random() * 200, -300 - Math.random() * 300],
      rotate: [0, 360 + Math.random() * 720],
      scale: [0.5, 1.2, 0.3],
    }}
    transition={{ duration: 2, delay, ease: "easeOut" }}
  >
    {emoji}
  </motion.div>
);

const HorseExitAnimation: React.FC<HorseExitAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<"swirl" | "liftoff" | "fade">("swirl");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("liftoff"), 1200);
    const t2 = setTimeout(() => setPhase("fade"), 2800);
    const t3 = setTimeout(onComplete, 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  const debris = ["🧪", "📋", "🔬", "💻", "📚", "🧫", "⚗️", "🧬"];

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        x: phase === "swirl" || phase === "liftoff"
          ? [0, -3, 4, -5, 3, -2, 4, -3, 2, 0]
          : 0,
        y: phase === "swirl" || phase === "liftoff"
          ? [0, 2, -3, 4, -2, 3, -4, 2, -1, 0]
          : 0,
      }}
      transition={{
        opacity: { duration: 0.3 },
        x: { duration: 0.5, repeat: Infinity, ease: "linear" },
        y: { duration: 0.4, repeat: Infinity, ease: "linear" },
      }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: "hsl(var(--background))" }}
        initial={{ opacity: 0.7 }}
        animate={{ opacity: phase === "fade" ? 1 : 0.85 }}
        transition={{ duration: 0.8 }}
      />

      {/* Tornado funnel */}
      <motion.div
        className="absolute flex items-center justify-center"
        style={{ width: 200, height: 200 }}
        initial={{ scale: 0, rotate: 0 }}
        animate={
          phase === "swirl"
            ? { scale: 1, rotate: 360 }
            : phase === "liftoff"
            ? { scale: 1.5, rotate: 1080, y: -window.innerHeight }
            : { scale: 0, rotate: 1440, y: -window.innerHeight }
        }
        transition={
          phase === "swirl"
            ? { duration: 1.2, ease: "easeOut" }
            : { duration: 1.6, ease: [0.4, 0, 0.2, 1] }
        }
      >
        {/* Spinning rings */}
        {[0, 1, 2].map((ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border-2"
            style={{
              width: 80 + ring * 50,
              height: 80 + ring * 50,
              borderColor: `hsl(var(--primary) / ${0.6 - ring * 0.15})`,
            }}
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 0.8 - ring * 0.15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Tornado emoji center */}
        <motion.span
          className="text-5xl md:text-6xl select-none z-10"
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          🌪️
        </motion.span>

        {/* Scientist being swept up */}
        <motion.div
          className="absolute z-20"
          style={{ width: 50, height: 50 }}
          initial={{ x: -60, y: 40, opacity: 1 }}
          animate={
            phase === "swirl"
              ? {
                  x: [-60, 30, -20, 10],
                  y: [40, -10, -30, -20],
                  rotate: [0, 180, 360, 540],
                  opacity: 1,
                }
              : { opacity: 1, rotate: 720 }
          }
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <img
            src={characterSprite}
            alt="Scientist"
            className="w-full h-full object-contain"
          />
        </motion.div>
      </motion.div>

      {/* Flying debris */}
      <div className="absolute" style={{ left: "50%", top: "50%" }}>
        {debris.map((emoji, i) => (
          <DebrisParticle
            key={i}
            delay={0.3 + i * 0.15}
            size={16 + Math.random() * 16}
            emoji={emoji}
          />
        ))}
      </div>

      {/* Text */}
      <motion.p
        className="absolute bottom-[20%] font-mono text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "fade" ? 0 : 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {phase === "swirl" ? "🌪️ A wild tornado appears!" : "Swept away...!"}
      </motion.p>
    </motion.div>
  );
};

export default HorseExitAnimation;
