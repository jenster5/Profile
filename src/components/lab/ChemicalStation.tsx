import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import scientistImg from "@/assets/scientist-explosion.png";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileStationPanel, { MOBILE_PANEL_POSITION, MOBILE_PANEL_SIZE } from "./MobileStationPanel";

type Phase = "prompt" | "mixing" | "explosion" | "reveal";

interface ChemicalStationProps {
  onClose: () => void;
}

const PARTICLES = Array.from({ length: 20 }, (_, i) => {
  const angle = (i / 20) * Math.PI * 2;
  return {
    id: i,
    x: Math.cos(angle) * (80 + Math.random() * 60),
    y: Math.sin(angle) * (80 + Math.random() * 60),
    emoji: ["💥", "🧪", "⚗️", "✨", "💫", "🔥", "💣", "☁️", "🌟", "⭐"][i % 10],
    delay: Math.random() * 0.2,
  };
});

const BUBBLES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: 25 + Math.random() * 50,
  delay: Math.random() * 1.2,
  size: 3 + Math.random() * 4,
}));

const ChemicalStation: React.FC<ChemicalStationProps> = ({ onClose }) => {
  const [phase, setPhase] = useState<Phase>("prompt");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (phase === "mixing") {
      const t = setTimeout(() => setPhase("explosion"), 2500);
      return () => clearTimeout(t);
    }
    if (phase === "explosion") {
      const t = setTimeout(() => setPhase("reveal"), 1200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isReveal = phase === "reveal";

  return (
    <MobileStationPanel>
      {/* Clickable backdrop only during reveal for closing */}
      {(isReveal || isMobile) && (
        <div className={isMobile ? "fixed inset-0 z-[100] bg-background/70 backdrop-blur-sm" : "absolute inset-0 z-30"} onClick={onClose} />
      )}

      <motion.div
        className={isMobile ? "fixed z-[110] overflow-visible" : "absolute z-40 overflow-visible"}
        style={isMobile ? MOBILE_PANEL_POSITION : { left: "3%", top: "3%" }}
        animate={isMobile ? MOBILE_PANEL_SIZE : {
          width: isReveal ? "55%" : "26%",
          height: isReveal ? "94%" : "22%",
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <motion.div
          className="relative w-full h-full rounded-lg border border-border bg-card/95 backdrop-blur-sm shadow-xl overflow-hidden"
          animate={{
            x: phase === "explosion" ? [0, -3, 3, -2, 2, 0] : 0,
          }}
          transition={
            phase === "explosion"
              ? { x: { duration: 0.4, ease: "easeInOut" } }
              : {}
          }
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-50 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Explosion flash */}
          <AnimatePresence>
            {phase === "explosion" && (
              <motion.div
                className="absolute inset-0 z-30 rounded-lg"
                style={{
                  background: "radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, transparent 70%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.8, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* Prompt */}
            {phase === "prompt" && (
              <motion.div
                key="prompt"
                className="flex flex-col items-center justify-center h-full gap-2 p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <span className="text-2xl md:text-3xl">🧪</span>
                <motion.button
                  onClick={() => setPhase("mixing")}
                  className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-semibold text-[10px] md:text-xs hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Mix Chemicals! ⚗️
                </motion.button>
              </motion.div>
            )}

            {/* Mixing */}
            {phase === "mixing" && (
              <motion.div
                key="mixing"
                className="flex flex-col items-center justify-center h-full p-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-[9px] md:text-[10px] text-muted-foreground mb-2 font-mono">Mixing…</p>
                <div className="relative flex items-end justify-center gap-3 w-full" style={{ height: "65%" }}>
                  {/* Left bottle */}
                  <motion.div
                    className="relative w-[18%] origin-bottom-right"
                    animate={{ rotate: 45, x: 8, y: -4 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  >
                    <div className="w-[40%] h-2 mx-auto rounded-t-sm bg-muted-foreground/40" />
                    <div className="w-full aspect-[5/8] rounded-b-lg bg-[hsl(200,80%,55%)] border border-border" />
                    <motion.div
                      className="absolute -right-0.5 bottom-0 w-1 rounded-full bg-[hsl(200,80%,55%)]"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 15, opacity: [0, 1, 1, 0.5] }}
                      transition={{ delay: 0.8, duration: 1.5 }}
                    />
                  </motion.div>

                  {/* Beaker */}
                  <div className="relative w-[28%] aspect-[4/5] flex flex-col justify-end">
                    <div className="relative w-full h-full rounded-b-lg border-2 border-muted-foreground/30 overflow-hidden">
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-[hsl(140,70%,45%)]"
                        initial={{ height: "0%" }}
                        animate={{ height: "75%" }}
                        transition={{ delay: 0.6, duration: 1.8, ease: "easeIn" }}
                      />
                      {BUBBLES.map((b) => (
                        <motion.div
                          key={b.id}
                          className="absolute rounded-full bg-foreground/20"
                          style={{ left: `${b.left}%`, width: b.size, height: b.size }}
                          initial={{ bottom: "10%", opacity: 0 }}
                          animate={{ bottom: "90%", opacity: [0, 0.7, 0] }}
                          transition={{ delay: 1 + b.delay, duration: 1.2, repeat: 1, ease: "easeOut" }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right bottle */}
                  <motion.div
                    className="relative w-[18%] origin-bottom-left"
                    animate={{ rotate: -45, x: -8, y: -4 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                  >
                    <div className="w-[40%] h-2 mx-auto rounded-t-sm bg-muted-foreground/40" />
                    <div className="w-full aspect-[5/8] rounded-b-lg bg-[hsl(40,90%,55%)] border border-border" />
                    <motion.div
                      className="absolute -left-0.5 bottom-0 w-1 rounded-full bg-[hsl(40,90%,55%)]"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 15, opacity: [0, 1, 1, 0.5] }}
                      transition={{ delay: 1, duration: 1.3 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Explosion */}
            {phase === "explosion" && (
              <motion.div
                key="explosion"
                className="flex items-center justify-center h-full relative overflow-visible"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.span
                  className="text-5xl md:text-6xl"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: [0.5, 1.8, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  💥
                </motion.span>
                <motion.img
                  src={scientistImg}
                  alt="Scientist after explosion"
                  className="absolute w-16 h-16 md:w-24 md:h-24 object-contain"
                  initial={{ opacity: 0, scale: 0, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: -5 }}
                  transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
                />
                {PARTICLES.map((p) => (
                  <motion.span
                    key={p.id}
                    className="absolute text-base md:text-lg"
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1.2 }}
                    animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
                    transition={{ duration: 1, delay: p.delay, ease: "easeOut" }}
                  >
                    {p.emoji}
                  </motion.span>
                ))}
              </motion.div>
            )}

            {/* Reveal - expanded panel */}
            {phase === "reveal" && (
              <motion.div
                key="reveal"
                className="p-5 pt-10 md:p-4 overflow-y-auto h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center mb-3">
                  <img src={scientistImg} alt="Scientist" className="w-8 h-8 md:w-10 md:h-10 mx-auto object-cover rounded-full" />
                </div>
                <h3 className="font-display text-sm md:text-base font-bold text-foreground text-center mb-2">
                  About Me
                </h3>
                <div className="space-y-3 text-sm md:text-xs text-muted-foreground leading-relaxed">
                  <p>
                    I'm a full-stack developer with a background in developmental and cancer biology. Before moving into tech, I spent several years in academic research, earning a PhD in developmental biology in California and later working as a postdoctoral researcher at Weill Cornell Medical College and the Karolinska Institutet.
                  </p>
                  <p>
                    As it turns out, careers don't always follow a straight line. During a break from research, I started learning programming and quickly realized how much I enjoyed building things with code. That curiosity eventually led me to transition into software development, starting with an intensive full-stack bootcamp at Technigo.
                  </p>
                  <p>
                    Since then, I've worked on internships, startup projects, and independent development work. Being part of small teams has also meant wearing many hats — from building applications to helping market products and supporting early fundraising efforts.
                  </p>
                  <p>
                    My background in science still shapes how I work today. Research taught me how to approach complex problems patiently and methodically, and how important collaboration is when tackling difficult challenges.
                  </p>
                </div>
                <p className="text-[9px] text-muted-foreground/50 text-center mt-3 font-mono">
                  ESC or click outside to close
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </MobileStationPanel>
  );
};

export default ChemicalStation;
