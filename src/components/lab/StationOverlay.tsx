import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import ChemicalStation from "./ChemicalStation";
import MicroscopeStation from "./MicroscopeStation";
import ComputerStation from "./ComputerStation";
import LoungeStation from "./LoungeStation";

interface StationOverlayProps {
  stationId: string;
  onClose: () => void;
}

const stationContent: Record<string, { title: string; description: string; emoji: string }> = {
  computer: {
    title: "Workstation",
    description: "This is where the coding happens. Projects, experiments, and late-night debugging sessions.",
    emoji: "💻",
  },
  chemical: {
    title: "Chemical Bench",
    description: "Reagents, buffers, and solutions. The wet lab essentials for any experiment.",
    emoji: "🧪",
  },
  microscope: {
    title: "Microscope Station",
    description: "Observing cells, tissues, and microstructures. Where data meets the eye.",
    emoji: "🔬",
  },
  lounge: {
    title: "Lounge",
    description: "A cozy corner to unwind. Hobbies, interests, and life beyond the lab.",
    emoji: "📚",
  },
  whiteboard: {
    title: "Lounge",
    description: "A cozy corner to unwind. Hobbies, interests, and life beyond the lab.",
    emoji: "📚",
  },
};

const StationOverlay: React.FC<StationOverlayProps> = ({ stationId, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const normalizedStationId = stationId === "whiteboard" ? "lounge" : stationId;

  if (normalizedStationId === "chemical") {
    return <ChemicalStation onClose={onClose} />;
  }

  if (normalizedStationId === "microscope") {
    return <MicroscopeStation onClose={onClose} />;
  }

  if (normalizedStationId === "computer") {
    return <ComputerStation onClose={onClose} />;
  }

  if (normalizedStationId === "lounge") {
    return <LoungeStation onClose={onClose} />;
  }

  const content = stationContent[normalizedStationId] || { title: normalizedStationId, description: "", emoji: "📚" };
  const isComputer = normalizedStationId === "computer";

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />

      {/* Content */}
      <motion.div
        className="relative z-50 w-[80%] max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl"
        initial={{ scale: 0.7, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.7, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <span className="text-4xl">{content.emoji}</span>
        </div>

        <h3 className="font-display text-xl font-bold text-foreground text-center mb-2">
          {content.title}
        </h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          {content.description}
        </p>

        {isComputer && (
          <motion.div
            className="rounded-lg border border-border bg-secondary p-4 font-mono text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-primary mb-1">$ cat projects.txt</p>
            <p>→ AI Chatbot</p>
            <p>→ Weather App</p>
            <p>→ Guess Who Game</p>
            <p>→ Music Player</p>
            <p className="mt-2 text-primary animate-pulse">█</p>
          </motion.div>
        )}

        <p className="text-xs text-muted-foreground/50 text-center mt-4 font-mono">
          ESC or click outside to close
        </p>
      </motion.div>
    </motion.div>
  );
};

export default StationOverlay;
