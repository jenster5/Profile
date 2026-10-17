import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import LabRoom from "./LabRoom";
import LabCharacter from "./LabCharacter";
import StationOverlay from "./StationOverlay";
import HorseExitAnimation from "./HorseExitAnimation";

interface LabGameProps {
  onExit: () => void;
}

const REQUIRED_STATIONS = ["chemical", "microscope", "computer", "lounge"];

export const shouldShowKeyboardHint = (desktopPointer: boolean, touchPoints: number) =>
  desktopPointer && touchPoints === 0;

const LabGame: React.FC<LabGameProps> = ({ onExit }) => {
  const roomRef = useRef<HTMLDivElement>(null);
  const [activeStation, setActiveStation] = useState<string | null>(null);
  const [visitedStations, setVisitedStations] = useState<Set<string>>(new Set());
  const [showExitAnimation, setShowExitAnimation] = useState(false);
  const [walkToStation, setWalkToStation] = useState<{ id: string; nonce: number } | null>(null);
  const [showKeyboardHint, setShowKeyboardHint] = useState(false);

  // Keyboard hints only make sense with a mouse + keyboard, so hide them on tablets and phones.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(min-width: 1280px) and (hover: hover) and (pointer: fine)");
    const update = () => setShowKeyboardHint(shouldShowKeyboardHint(mq.matches, navigator.maxTouchPoints || 0));
    update();
    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);


  const handleStationClick = useCallback((id: string) => {
    setWalkToStation({ id, nonce: Date.now() });
  }, []);

  const allVisited = REQUIRED_STATIONS.every((s) => visitedStations.has(s));

  const handleStationClose = useCallback(() => {
    if (activeStation) {
      const normalized = activeStation === "whiteboard" ? "lounge" : activeStation;
      setVisitedStations((prev) => new Set(prev).add(normalized));
    }
    setActiveStation(null);
  }, [activeStation]);

  const handleStationInteract = useCallback(
    (id: string) => {
      if (id === "portal") {
        if (allVisited) setShowExitAnimation(true);
        return;
      }
      setActiveStation(id === "whiteboard" ? "lounge" : id);
    },
    [allVisited]
  );

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 w-full max-w-4xl">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </button>
        <div className="ml-auto flex items-center gap-3">
          {showKeyboardHint && (
            <p className="text-xs text-muted-foreground/60 font-mono">
              WASD / Arrow keys · E to interact
            </p>
          )}
          <span className="text-[10px] text-muted-foreground/80 font-mono whitespace-nowrap">
            {visitedStations.size}/4 explored
          </span>
        </div>
      </div>

      {/* Game container */}
      <div
        ref={roomRef}
        className="relative w-full max-w-4xl border border-border rounded-lg glow-teal"
        style={{ aspectRatio: "16 / 9" }}
      >
        <LabRoom
          visitedStations={visitedStations}
          allVisited={allVisited}
          onStationInteract={handleStationClick}
          interactionDisabled={!!activeStation || showExitAnimation}
        />
        <LabCharacter
          roomRef={roomRef}
          onStationInteract={handleStationInteract}
          interactionDisabled={!!activeStation || showExitAnimation}
          allVisited={allVisited}
          walkToStation={walkToStation}
        />
        <AnimatePresence>
          {activeStation && (
            <StationOverlay
              stationId={activeStation}
              onClose={handleStationClose}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Horse exit animation */}
      <AnimatePresence>
        {showExitAnimation && (
          <HorseExitAnimation onComplete={onExit} />
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default LabGame;
