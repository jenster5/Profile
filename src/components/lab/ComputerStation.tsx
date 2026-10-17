import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileStationPanel, { MOBILE_PANEL_POSITION, MOBILE_PANEL_SIZE } from "./MobileStationPanel";

type Phase = "boot" | "typing" | "reveal";

interface ComputerStationProps {
  onClose: () => void;
}

const projects = [
  {
    title: "Partnex",
    description: "Website for a Swedish construction company specializing in residential developments and total contracting. Built with Next.js, React, and TypeScript with a focus on performance and clear information architecture.",
    tech: ["Next.js", "React", "TypeScript"],
    demo: "https://partnex.se",
  },
  {
    title: "Floccs",
    description: "Frontend development for Floccs, a growing horse marketplace in the Nordics. Developed responsive pages and reusable React components with a focus on performance and scalability.",
    tech: ["Web Development", "React", "Startup"],
    demo: "https://floccs.com",
  },
  {
    title: "CVOOM",
    description: "Developed a mobile app with React Native for a startup focused on modernizing the job search process. The app helps candidates introduce themselves to employers through short video interviews, making applications more personal and engaging.",
    tech: ["React Native", "Mobile Development", "Startup"],
  },
];

const BOOT_LINES = [
  "Booting LabOS v2.1...",
  "Loading modules.......... OK",
  "Mounting /projects....... OK",
  "Initializing display.... OK",
  "> ls ~/projects",
];

const ComputerStation: React.FC<ComputerStationProps> = ({ onClose }) => {
  const [phase, setPhase] = useState<Phase>("boot");
  const isMobile = useIsMobile();
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (phase === "boot") {
      const interval = setInterval(() => {
        setVisibleLines((prev) => {
          if (prev >= BOOT_LINES.length) {
            clearInterval(interval);
            setTimeout(() => setPhase("typing"), 400);
            return prev;
          }
          return prev + 1;
        });
      }, 350);
      return () => clearInterval(interval);
    }
    if (phase === "typing") {
      const t = setTimeout(() => setPhase("reveal"), 1500);
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
        style={isMobile ? MOBILE_PANEL_POSITION : { left: "3%", bottom: "3%" }}
        animate={isMobile ? MOBILE_PANEL_SIZE : {
          width: isReveal ? "60%" : "40%",
          height: isReveal ? "94%" : "35%",
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <motion.div
          className="relative w-full h-full rounded-lg border border-border bg-card/95 backdrop-blur-sm shadow-xl overflow-hidden"
        >
          {/* Terminal title bar */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border-b border-border">
            <div className="flex gap-1">
              <button onClick={onClose} className="w-2 h-2 rounded-full bg-destructive hover:opacity-80 transition-opacity" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            </div>
            <span className="text-[8px] md:text-[9px] font-mono text-muted-foreground ml-1">~/projects — bash</span>
            <button
              onClick={onClose}
              className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div className="p-3 overflow-y-auto" style={{ height: "calc(100% - 28px)" }}>
            <AnimatePresence mode="wait">
              {/* Phase: Boot */}
              {(phase === "boot" || phase === "typing") && (
                <motion.div
                  key="boot"
                  className="font-mono text-xs md:text-[9px] space-y-0.5"
                  exit={phase === "typing" ? { opacity: 0, y: -10 } : undefined}
                  transition={{ duration: 0.3 }}
                >
                  {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                    <motion.p
                      key={i}
                      className={i === BOOT_LINES.length - 1 ? "text-primary" : "text-muted-foreground"}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {line}
                    </motion.p>
                  ))}
                  {phase === "typing" && (
                    <motion.div
                      className="flex gap-1 mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {projects.map((p, i) => (
                        <motion.span
                          key={p.title}
                          className="text-primary text-[8px]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.2 }}
                        >
                          {p.title}{i < projects.length - 1 ? "  " : ""}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                  <p className="text-primary animate-pulse mt-0.5">█</p>
                </motion.div>
              )}

              {/* Phase: Reveal */}
              {phase === "reveal" && (
                <motion.div
                  key="reveal"
                  className="overflow-y-auto h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center mb-2">
                    <span className="text-xl">💻</span>
                  </div>
                  <h3 className="font-display text-sm md:text-base font-bold text-foreground text-center mb-0.5">
                    Selected Work
                  </h3>
                  <p className="text-[8px] md:text-[9px] text-muted-foreground text-center mb-3 font-mono">
                    3 items found in ~/projects
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-2">
                    {projects.map((project, idx) => (
                      <motion.div
                        key={project.title}
                        className="rounded-lg border border-border bg-secondary/50 p-2.5 hover:border-primary/50 transition-colors"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.4 }}
                      >
                        <h4 className="font-display text-base md:text-xs font-semibold text-foreground mb-0.5">
                          {project.title}
                        </h4>
                        <p className="text-sm md:text-[10px] text-muted-foreground leading-relaxed mb-1.5">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-0.5 mb-1.5">
                          {project.tech.map((t) => (
                            <span
                              key={t}
                              className="text-xs md:text-[8px] px-1 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        {project.demo && (
                          <div className="flex gap-2">
                            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-0.5 text-sm md:text-[9px] text-muted-foreground hover:text-primary transition-colors">
                              <ExternalLink size={8} /> Visit
                            </a>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <p className="text-[8px] text-muted-foreground/50 text-center mt-3 font-mono">
                    ESC or click outside to close
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </MobileStationPanel>
  );
};

export default ComputerStation;
