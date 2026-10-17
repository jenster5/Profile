import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileStationPanel, { MOBILE_PANEL_POSITION, MOBILE_PANEL_SIZE } from "./MobileStationPanel";

type Phase = "focus" | "scanning" | "reveal";

interface MicroscopeStationProps {
  onClose: () => void;
}

const skillCategories = [
  {
    title: "Code",
    skills: ["JavaScript", "TypeScript", "React", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "Node.js", "Git"],
  },
  {
    title: "Toolbox",
    skills: ["VS Code", "Cursor", "Figma", "GitHub", "Netlify", "Vite", "REST APIs", "npm"],
  },
  {
    title: "Laboratory",
    skills: ["Cell Biology", "Molecular Biology", "Data Analysis", "Scientific Writing", "PCR", "Microscopy"],
  },
  {
    title: "Learning",
    skills: ["Python", "Docker", "PostgreSQL", "AI/ML Fundamentals"],
  },
];

const allSkills = skillCategories.flatMap((c) => c.skills);

const MicroscopeStation: React.FC<MicroscopeStationProps> = ({ onClose }) => {
  const [phase, setPhase] = useState<Phase>("focus");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (phase === "focus") {
      const t = setTimeout(() => setPhase("scanning"), 1800);
      return () => clearTimeout(t);
    }
    if (phase === "scanning") {
      const t = setTimeout(() => setPhase("reveal"), 2500);
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
      {(isReveal || isMobile) && (
        <div className={isMobile ? "fixed inset-0 z-[100] bg-background/70 backdrop-blur-sm" : "absolute inset-0 z-30"} onClick={onClose} />
      )}

      <motion.div
        className={isMobile ? "fixed z-[110] overflow-visible" : "absolute z-40 overflow-visible"}
        style={isMobile ? MOBILE_PANEL_POSITION : { right: "3%", top: "3%" }}
        animate={isMobile ? MOBILE_PANEL_SIZE : {
          width: isReveal ? "55%" : "40%",
          height: isReveal ? "94%" : "35%",
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <motion.div
          className="relative w-full h-full rounded-lg border border-border bg-card/95 backdrop-blur-sm shadow-xl overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-50 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <AnimatePresence mode="wait">
            {/* Phase: Focus */}
            {phase === "focus" && (
              <motion.div
                key="focus"
                className="flex flex-col items-center justify-center h-full gap-2 p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="relative">
                  <motion.div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-primary/60 flex items-center justify-center overflow-hidden"
                    style={{
                      background: "radial-gradient(circle, hsl(var(--primary) / 0.05) 0%, hsl(var(--primary) / 0.15) 70%, hsl(var(--primary) / 0.3) 100%)",
                    }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="text-2xl">🔬</span>
                  </motion.div>

                  <motion.div
                    className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-5 rounded-sm bg-muted-foreground/30 border border-border"
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-5 rounded-sm bg-muted-foreground/30 border border-border"
                    animate={{ rotate: [0, -180, -360] }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </div>

                <p className="text-[9px] md:text-[10px] text-muted-foreground font-mono animate-pulse">
                  Adjusting focus…
                </p>
              </motion.div>
            )}

            {/* Phase: Scanning */}
            {phase === "scanning" && (
              <motion.div
                key="scanning"
                className="flex flex-col items-center justify-center h-full p-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-[9px] md:text-[10px] text-muted-foreground font-mono mb-2">
                  Scanning specimens…
                </p>

                <div
                  className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-primary/40 overflow-hidden flex items-center justify-center"
                  style={{
                    background: "radial-gradient(circle, hsl(var(--card)) 0%, hsl(var(--primary) / 0.08) 100%)",
                  }}
                >
                  {allSkills.slice(0, 10).map((skill, i) => {
                    const angle = (i / 10) * Math.PI * 2;
                    const r = 30 + Math.random() * 10;
                    return (
                      <motion.span
                        key={skill}
                        className="absolute px-1 py-0.5 text-[7px] font-medium rounded-full border border-primary/30 bg-primary/10 text-primary whitespace-nowrap"
                        initial={{ opacity: 0, scale: 0, x: Math.cos(angle) * 60, y: Math.sin(angle) * 60 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          x: Math.cos(angle) * r,
                          y: Math.sin(angle) * r,
                        }}
                        transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
                      >
                        {skill}
                      </motion.span>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Phase: Reveal */}
            {phase === "reveal" && (
              <motion.div
                key="reveal"
                className="p-5 pt-10 md:p-4 overflow-y-auto h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center mb-3">
                  <span className="text-2xl">🔬</span>
                </div>
                <h3 className="font-display text-sm md:text-base font-bold text-foreground text-center mb-1">
                  Specimen Analysis Complete
                </h3>
                <p className="text-[9px] text-muted-foreground text-center mb-3 font-mono">
                  Skills identified across all samples
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {skillCategories.map((cat, catIdx) => (
                    <motion.div
                      key={cat.title}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: catIdx * 0.1, duration: 0.4 }}
                    >
                      <h4 className="font-display text-sm md:text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {cat.title}
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {cat.skills.map((skill, i) => (
                          <motion.span
                            key={skill}
                            className="px-1.5 py-0.5 text-xs md:text-[10px] font-medium rounded-full border border-border bg-secondary text-muted-foreground"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: catIdx * 0.1 + i * 0.03 }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
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

export default MicroscopeStation;
