import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { STATIONS, WALLS, PORTAL } from "./LabRoom";
import { buildBlockedGrid, findPath } from "./pathfinding";
import characterSprite from "@/assets/character-scientist.png";

interface LabCharacterProps {
  roomRef: React.RefObject<HTMLDivElement>;
  onStationInteract?: (stationId: string) => void;
  interactionDisabled?: boolean;
  allVisited?: boolean;
  walkToStation?: { id: string; nonce: number } | null;
}

const CHARACTER_SIZE = 14; // Visual sprite size (%)
const COLLISION_SIZE = 6;  // Actual hitbox size (%)
const COLLISION_OFFSET = (CHARACTER_SIZE - COLLISION_SIZE) / 2; // Center offset
const SPEED = 0.6;

/** Get the collision rect from the character's top-left position */
const getCollisionRect = (x: number, y: number) => ({
  x: x + COLLISION_OFFSET,
  y: y + COLLISION_OFFSET,
  w: COLLISION_SIZE,
  h: COLLISION_SIZE,
});

const checkCollision = (
  x: number,
  y: number,
  obstacles: { x: number; y: number; w: number; h: number }[]
) => {
  const r = getCollisionRect(x, y);
  return obstacles.some(
    (obs) =>
      r.x < obs.x + obs.w &&
      r.x + r.w > obs.x &&
      r.y < obs.y + obs.h &&
      r.y + r.h > obs.y
  );
};

const ALL_OBSTACLES = [
  ...STATIONS.map((s) => ({ x: s.x, y: s.y, w: s.w, h: s.h })),
  ...WALLS,
];

const LabCharacter: React.FC<LabCharacterProps> = ({ roomRef, onStationInteract, interactionDisabled, allVisited, walkToStation }) => {
  const [pos, setPos] = useState({ x: 43, y: 22 });
  const [facing, setFacing] = useState<"down" | "up" | "left" | "right">("down");
  const [nearStation, setNearStation] = useState<string | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const waypointsRef = useRef<{ x: number; y: number }[]>([]);
  const animRef = useRef<number>(0);
  const posRef = useRef({ x: 43, y: 22 });
  const pendingStationRef = useRef<string | null>(null);
  const interactRef = useRef(onStationInteract);
  interactRef.current = onStationInteract;

  // Build blocked grid once for pathfinding
  const blockedGrid = useMemo(
    () => buildBlockedGrid(ALL_OBSTACLES, COLLISION_SIZE),
    []
  );

  const checkProximity = useCallback((cx: number, cy: number) => {
    const MARGIN = 8;
    const col = getCollisionRect(cx, cy);

    // Check portal proximity
    const p = PORTAL;
    const portalExpanded = { x: p.x - MARGIN, y: p.y - MARGIN, w: p.w + MARGIN * 2, h: p.h + MARGIN * 2 };
    if (
      col.x < portalExpanded.x + portalExpanded.w &&
      col.x + col.w > portalExpanded.x &&
      col.y < portalExpanded.y + portalExpanded.h &&
      col.y + col.h > portalExpanded.y
    ) {
      return "portal";
    }

    for (const s of STATIONS) {
      const expanded = { x: s.x - MARGIN, y: s.y - MARGIN, w: s.w + MARGIN * 2, h: s.h + MARGIN * 2 };
      if (
        col.x < expanded.x + expanded.w &&
        col.x + col.w > expanded.x &&
        col.y < expanded.y + expanded.h &&
        col.y + col.h > expanded.y
      ) {
        return s.id;
      }
    }
    return null;
  }, []);

  const move = useCallback(() => {
    setPos((prev) => {
      if (interactionDisabled) return prev;
      let dx = 0;
      let dy = 0;
      const keys = keysRef.current;

      if (keys.has("ArrowUp") || keys.has("w")) dy -= SPEED;
      if (keys.has("ArrowDown") || keys.has("s")) dy += SPEED;
      if (keys.has("ArrowLeft") || keys.has("a")) dx -= SPEED;
      if (keys.has("ArrowRight") || keys.has("d")) dx += SPEED;

      // Keyboard input clears waypoints
      if (dx !== 0 || dy !== 0) {
        waypointsRef.current = [];
        pendingStationRef.current = null;
      }

      // Follow waypoints if no keyboard input
      const waypoints = waypointsRef.current;
      if (waypoints.length > 0 && dx === 0 && dy === 0) {
        const target = waypoints[0];
        const tdx = target.x - prev.x;
        const tdy = target.y - prev.y;
        const dist = Math.sqrt(tdx * tdx + tdy * tdy);
        if (dist > 1.5) {
          dx = (tdx / dist) * SPEED;
          dy = (tdy / dist) * SPEED;
        } else {
          // Reached this waypoint, move to next
          waypoints.shift();
          if (waypoints.length > 0) {
            const next = waypoints[0];
            const ndx = next.x - prev.x;
            const ndy = next.y - prev.y;
            const ndist = Math.sqrt(ndx * ndx + ndy * ndy);
            if (ndist > 1) {
              dx = (ndx / ndist) * SPEED;
              dy = (ndy / ndist) * SPEED;
            }
          }
        }
      }

      if (dx === 0 && dy === 0) {
        const pending = pendingStationRef.current;
        if (pending && waypointsRef.current.length === 0) {
          pendingStationRef.current = null;
          setTimeout(() => interactRef.current?.(pending), 0);
        }
        return prev;
      }

      if (Math.abs(dx) > Math.abs(dy)) {
        setFacing(dx > 0 ? "right" : "left");
      } else {
        setFacing(dy > 0 ? "down" : "up");
      }

      let nx = prev.x + dx;
      let ny = prev.y + dy;
      let result = prev;

      if (!checkCollision(nx, ny, ALL_OBSTACLES)) result = { x: nx, y: ny };
      else if (!checkCollision(nx, prev.y, ALL_OBSTACLES)) result = { x: nx, y: prev.y };
      else if (!checkCollision(prev.x, ny, ALL_OBSTACLES)) result = { x: prev.x, y: ny };

      posRef.current = result;
      const near = checkProximity(result.x, result.y);
      setNearStation(near);
      return result;
    });

    animRef.current = requestAnimationFrame(move);
  }, [checkProximity, interactionDisabled]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(move);
    return () => cancelAnimationFrame(animRef.current);
  }, [move]);

  // Walk to a station when it is clicked/tapped, then open it on arrival
  useEffect(() => {
    if (!walkToStation) return;
    const s = walkToStation.id === "portal" ? PORTAL : STATIONS.find((st) => st.id === walkToStation.id);
    if (!s) return;
    const isTop = s.y < 50;
    const targetX = s.x + s.w / 2 - CHARACTER_SIZE / 2;
    const targetY = s.id === "portal" ? s.y + s.h / 2 - CHARACTER_SIZE / 2 : isTop
      ? s.y + s.h + 1 - COLLISION_OFFSET
      : s.y - 1 - COLLISION_SIZE - COLLISION_OFFSET;
    const current = posRef.current;
    if (Math.hypot(current.x - targetX, current.y - targetY) <= 1.5) {
      waypointsRef.current = [];
      pendingStationRef.current = null;
      interactRef.current?.(s.id);
      return;
    }
    const path = findPath(blockedGrid, current.x + COLLISION_OFFSET, current.y + COLLISION_OFFSET, targetX + COLLISION_OFFSET, targetY + COLLISION_OFFSET, COLLISION_SIZE);
    if (!path) return;
    waypointsRef.current = [...path.map((point) => ({ x: point.x - COLLISION_OFFSET, y: point.y - COLLISION_OFFSET })), { x: targetX, y: targetY }];
    pendingStationRef.current = s.id;
  }, [walkToStation, blockedGrid, checkProximity]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(key)) {
        e.preventDefault();
        keysRef.current.add(key);
        waypointsRef.current = []; // Clear path on keyboard input
        pendingStationRef.current = null;
      }
      if ((key === "e" || key === "Enter") && !interactionDisabled) {
        const near = checkProximity(posRef.current.x, posRef.current.y);
        if (near && onStationInteract) {
          onStationInteract(near);
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      keysRef.current.delete(key);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [onStationInteract, interactionDisabled, checkProximity]);

  // Tap/click to move with pathfinding
  const handleRoomClick = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const room = roomRef.current;
      if (!room) return;
      const rect = room.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const targetX = ((clientX - rect.left) / rect.width) * 100 - CHARACTER_SIZE / 2;
      const targetY = ((clientY - rect.top) / rect.height) * 100 - CHARACTER_SIZE / 2;

      const current = posRef.current;
      pendingStationRef.current = null;
      const path = findPath(blockedGrid, current.x + COLLISION_OFFSET, current.y + COLLISION_OFFSET, targetX + COLLISION_OFFSET, targetY + COLLISION_OFFSET, COLLISION_SIZE);

      if (path && path.length > 0) {
        waypointsRef.current = path.map((point) => ({ x: point.x - COLLISION_OFFSET, y: point.y - COLLISION_OFFSET }));
      } else {
        // Fallback: try straight-line movement
        waypointsRef.current = [{ x: targetX, y: targetY }];
      }
    },
    [roomRef, blockedGrid]
  );

  const isPortal = nearStation === "portal";
  const isPortalLocked = isPortal && !allVisited;

  return (
    <>
      {/* Click/tap overlay */}
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={handleRoomClick}
        onTouchStart={handleRoomClick}
      />

      {/* Interaction prompt */}
      {nearStation && !interactionDisabled && (
        <div
          className="absolute z-30 flex flex-col items-center gap-1 pointer-events-none"
          style={{
            left: `${pos.x + CHARACTER_SIZE / 2}%`,
            top: `${pos.y - 4}%`,
            transform: "translateX(-50%)",
          }}
        >
          <span
            className={`text-[10px] md:text-xs font-mono bg-background/80 border px-2 py-1 rounded-md whitespace-nowrap animate-pulse ${
              isPortalLocked
                ? "text-muted-foreground border-muted-foreground/30"
                : isPortal
                ? "text-accent-foreground border-primary bg-primary/20"
                : "text-primary border-primary/30"
            }`}
          >
            {isPortalLocked
              ? "🔒 Visit all 4 stations to unlock!"
              : isPortal
              ? "Press E to escape! 🌪️"
              : "Press E to interact"}
          </span>
          {/* Mobile tap button */}
          <button
            className={`pointer-events-auto md:hidden text-[10px] font-mono px-3 py-1 rounded-md ${
              isPortal
                ? "bg-accent text-accent-foreground"
                : "bg-primary text-primary-foreground"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (nearStation && onStationInteract) onStationInteract(nearStation);
            }}
          >
            {isPortal ? "Escape! 🌪️" : "Interact"}
          </button>
        </div>
      )}

      {/* Character */}
      <div
        className="absolute z-20 pointer-events-none"
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          width: `${CHARACTER_SIZE}%`,
          height: `${CHARACTER_SIZE}%`,
        }}
      >
        <img
          src={characterSprite}
          alt="Scientist character"
          className="w-full h-full object-contain drop-shadow-md"
          style={{
            transform: facing === "left" ? "scaleX(-1)" : undefined,
            imageRendering: "auto",
          }}
        />
      </div>
    </>
  );
};

export default LabCharacter;
