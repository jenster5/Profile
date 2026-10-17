import React from "react";
import { Button } from "@/components/ui/button";
import stationChemical from "@/assets/station-chemical.png";
import stationMicroscope from "@/assets/station-microscope.png";
import stationComputer from "@/assets/station-computer.png";
import stationBookshelf from "@/assets/station-bookshelf.png";

// Station positions and sizes (percentages of room)
export const STATIONS = [
  { id: "chemical", label: "Chemical Bench", x: 5, y: 8, w: 22, h: 18, image: stationChemical },
  { id: "microscope", label: "Microscope", x: 73, y: 8, w: 22, h: 18, image: stationMicroscope },
  { id: "computer", label: "Computer", x: 5, y: 74, w: 22, h: 18, image: stationComputer },
  { id: "lounge", label: "Bookshelf", x: 73, y: 74, w: 22, h: 18, image: stationBookshelf },
];

// Center portal
export const PORTAL = { id: "portal", x: 40, y: 38, w: 20, h: 24 };

// Wall thickness as percentage
const WALL = 3;

export const WALLS = [
  { x: 0, y: 0, w: 100, h: WALL },
  { x: 0, y: 100 - WALL, w: 100, h: WALL },
  { x: 0, y: 0, w: WALL, h: 100 },
  { x: 100 - WALL, y: 0, w: WALL, h: 100 },
];

interface LabRoomProps {
  visitedStations: Set<string>;
  allVisited: boolean;
  onStationInteract?: (stationId: string) => void;
  interactionDisabled?: boolean;
}

const LabRoom: React.FC<LabRoomProps> = ({ visitedStations, allVisited, onStationInteract, interactionDisabled }) => {
  const visitedCount = visitedStations.size;
  const progress = visitedCount / 4;

  // Map dots to stations by position: top-left, top-right, bottom-right, bottom-left
  const DOT_STATION_MAP = ["microscope", "lounge", "computer", "chemical"];

  return (
    <div className="absolute inset-0 overflow-hidden rounded-lg">
      {/* Floor */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "hsl(210 10% 88%)" }}
      />

      {/* Walls */}
      {WALLS.map((wall, i) => (
        <div
          key={`wall-${i}`}
          className="absolute"
          style={{
            left: `${wall.x}%`,
            top: `${wall.y}%`,
            width: `${wall.w}%`,
            height: `${wall.h}%`,
            backgroundColor: "hsl(220 20% 18%)",
            border: "1px solid hsl(var(--border))",
          }}
        />
      ))}

      {/* Stations with images */}
      {STATIONS.map((station) => {
        const isTop = station.id === "chemical" || station.id === "microscope";
        const isBottom = station.id === "computer" || station.id === "lounge";
        return (
          <div
            key={station.id}
            className="absolute z-20"
            style={{
              left: `${station.x}%`,
              top: `${station.y}%`,
              width: `${station.w}%`,
              height: `${station.h}%`,
            }}
          >
            {isTop && (
              <div
                className="absolute w-full text-center"
                style={{ bottom: "100%", paddingBottom: "2px" }}
              >
                <span className="text-[9px] md:text-[11px] font-display text-foreground/90 font-semibold bg-background/60 px-2 py-0.5 rounded-sm">
                  {station.label}
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              aria-label={`Open ${station.label}`}
              disabled={interactionDisabled}
              className="relative w-full h-full p-0 rounded-md overflow-hidden shadow-lg touch-manipulation hover:ring-2 hover:ring-primary focus-visible:ring-primary disabled:opacity-100"
              onClick={(event) => {
                event.stopPropagation();
                onStationInteract?.(station.id);
              }}
            >
              <img
                src={station.image}
                alt={station.label}
                className="w-full h-full object-cover"
                style={station.id === "computer" ? { transform: "rotate(180deg)" } : undefined}
              />
            </Button>
            {isBottom && (
              <div
                className="absolute top-full w-full text-center pointer-events-none pt-0.5 leading-none"
              >
                <span className="inline-block text-[9px] md:text-[11px] font-display text-foreground/90 font-semibold bg-background/60 px-2 py-0.5 rounded-sm">
                  {station.label}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {/* Center Portal */}
      <div
        className="absolute z-20 flex items-center justify-center"
        style={{
          left: `${PORTAL.x}%`,
          top: `${PORTAL.y}%`,
          width: `${PORTAL.w}%`,
          height: `${PORTAL.h}%`,
        }}
      >
        <Button
          variant="ghost"
          aria-label="Exit portal"
          title={allVisited ? "Exit the lab" : "Visit all four stations to unlock"}
          disabled={interactionDisabled}
          className="absolute inset-0 z-10 w-full h-full p-0 rounded-full touch-manipulation hover:bg-transparent focus-visible:ring-primary disabled:opacity-100"
          onClick={(event) => {
            event.stopPropagation();
            onStationInteract?.("portal");
          }}
        />
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-700"
          style={{
            background: allVisited
              ? "radial-gradient(circle, hsl(var(--primary) / 0.5), hsl(var(--primary) / 0.15), transparent 70%)"
              : `radial-gradient(circle, hsl(var(--primary) / ${0.05 + progress * 0.1}), transparent 70%)`,
            filter: allVisited ? "blur(8px)" : "blur(4px)",
            animation: allVisited ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : undefined,
          }}
        />

        {/* Progress segments */}
        <div className="relative w-[60%] h-[60%]">
          {[0, 1, 2, 3].map((i) => {
            const angle = i * 90 - 45;
            const lit = visitedStations.has(DOT_STATION_MAP[i]);
            return (
              <div
                key={i}
                className="absolute w-2.5 h-2.5 rounded-full transition-all duration-500 border"
                style={{
                  left: `${50 + 40 * Math.cos((angle * Math.PI) / 180)}%`,
                  top: `${50 + 40 * Math.sin((angle * Math.PI) / 180)}%`,
                  transform: "translate(-50%, -50%)",
                  backgroundColor: lit
                    ? "hsl(var(--primary))"
                    : "hsl(220 20% 12%)",
                  borderColor: lit
                    ? "hsl(var(--primary) / 0.8)"
                    : "hsl(220 15% 25%)",
                  boxShadow: lit ? "0 0 10px hsl(var(--primary) / 0.7)" : "none",
                }}
              />
            );
          })}

          {/* Center icon */}
          <div
            className="absolute inset-0 flex items-center justify-center text-lg transition-all duration-500"
            style={{
              opacity: allVisited ? 1 : 0.7,
              filter: allVisited ? "drop-shadow(0 0 8px hsl(var(--primary) / 0.9))" : "drop-shadow(0 0 2px rgba(0,0,0,0.8))",
            }}
          >
            {allVisited ? "🌀" : "🔒"}
          </div>
        </div>

        {/* Label */}
        {visitedCount > 0 && (
          <div className="absolute -bottom-1 w-full text-center">
            <span className="text-[8px] md:text-[10px] font-mono font-semibold" style={{ color: allVisited ? "hsl(var(--primary))" : "hsl(220 15% 30%)", textShadow: allVisited ? "0 0 6px hsl(var(--primary) / 0.6)" : "none" }}>
              {allVisited ? "Portal Ready!" : `${visitedCount}/4`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabRoom;
