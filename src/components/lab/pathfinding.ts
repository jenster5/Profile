/**
 * A* grid-based pathfinding for the lab room.
 * Operates on a coarse grid (GRID_SIZE x GRID_SIZE cells).
 */

const GRID_SIZE = 50; // 50x50 grid, each cell = 2% of room

interface GridNode {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent: GridNode | null;
}

/**
 * Build a blocked grid from obstacles. A cell is blocked if it overlaps any obstacle.
 */
export function buildBlockedGrid(
  obstacles: { x: number; y: number; w: number; h: number }[],
  collisionSize: number
): boolean[][] {
  const cellSize = 100 / GRID_SIZE;
  const half = collisionSize / 2;
  const grid: boolean[][] = [];

  for (let gy = 0; gy < GRID_SIZE; gy++) {
    grid[gy] = [];
    for (let gx = 0; gx < GRID_SIZE; gx++) {
      // The character's center would be at this cell's center
      // Check if the collision box centered here overlaps any obstacle
      const cx = gx * cellSize + cellSize / 2 - half;
      const cy = gy * cellSize + cellSize / 2 - half;

      const blocked = obstacles.some(
        (obs) =>
          cx < obs.x + obs.w &&
          cx + collisionSize > obs.x &&
          cy < obs.y + obs.h &&
          cy + collisionSize > obs.y
      );
      grid[gy][gx] = blocked;
    }
  }
  return grid;
}

function heuristic(ax: number, ay: number, bx: number, by: number): number {
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

/**
 * A* search returning a path of room-percentage waypoints.
 * Returns null if no path found.
 */
export function findPath(
  blockedGrid: boolean[][],
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  collisionSize: number
): { x: number; y: number }[] | null {
  const cellSize = 100 / GRID_SIZE;
  const half = collisionSize / 2;

  // Convert room % positions (character top-left + half collision offset) to grid cells
  const toGrid = (px: number, py: number) => ({
    gx: Math.round((px + half) / cellSize - 0.5),
    gy: Math.round((py + half) / cellSize - 0.5),
  });

  const start = toGrid(startX, startY);
  const end = toGrid(endX, endY);

  // Clamp to grid bounds
  const clamp = (v: number) => Math.max(0, Math.min(GRID_SIZE - 1, v));
  start.gx = clamp(start.gx);
  start.gy = clamp(start.gy);
  end.gx = clamp(end.gx);
  end.gy = clamp(end.gy);

  // If end is blocked, find nearest unblocked cell
  if (blockedGrid[end.gy]?.[end.gx]) {
    let best: { gx: number; gy: number } | null = null;
    let bestDist = Infinity;
    for (let dy = -5; dy <= 5; dy++) {
      for (let dx = -5; dx <= 5; dx++) {
        const nx = end.gx + dx;
        const ny = end.gy + dy;
        if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && !blockedGrid[ny][nx]) {
          const d = Math.abs(dx) + Math.abs(dy);
          if (d < bestDist) {
            bestDist = d;
            best = { gx: nx, gy: ny };
          }
        }
      }
    }
    if (best) {
      end.gx = best.gx;
      end.gy = best.gy;
    } else {
      return null;
    }
  }

  if (start.gx === end.gx && start.gy === end.gy) return [];

  const key = (x: number, y: number) => y * GRID_SIZE + x;
  const open: GridNode[] = [];
  const closed = new Set<number>();

  const startNode: GridNode = {
    x: start.gx,
    y: start.gy,
    g: 0,
    h: heuristic(start.gx, start.gy, end.gx, end.gy),
    f: 0,
    parent: null,
  };
  startNode.f = startNode.g + startNode.h;
  open.push(startNode);

  // 8-directional neighbors
  const dirs = [
    [0, -1], [0, 1], [-1, 0], [1, 0],
    [-1, -1], [-1, 1], [1, -1], [1, 1],
  ];

  let iterations = 0;
  const MAX_ITERATIONS = 5000;

  while (open.length > 0 && iterations < MAX_ITERATIONS) {
    iterations++;

    // Find lowest f
    let lowestIdx = 0;
    for (let i = 1; i < open.length; i++) {
      if (open[i].f < open[lowestIdx].f) lowestIdx = i;
    }
    const current = open.splice(lowestIdx, 1)[0];

    if (current.x === end.gx && current.y === end.gy) {
      // Reconstruct path
      const path: { x: number; y: number }[] = [];
      let node: GridNode | null = current;
      while (node) {
        // Convert grid cell back to room position (character top-left corner for collision center)
        path.unshift({
          x: node.x * cellSize + cellSize / 2 - half,
          y: node.y * cellSize + cellSize / 2 - half,
        });
        node = node.parent;
      }
      // Skip the first point (current position) and simplify
      return simplifyPath(path.slice(1));
    }

    closed.add(key(current.x, current.y));

    for (const [ddx, ddy] of dirs) {
      const nx = current.x + ddx;
      const ny = current.y + ddy;
      if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) continue;
      if (blockedGrid[ny][nx]) continue;
      if (closed.has(key(nx, ny))) continue;

      // For diagonal moves, check that both adjacent cells are clear
      if (ddx !== 0 && ddy !== 0) {
        if (blockedGrid[current.y][nx] || blockedGrid[ny][current.x]) continue;
      }

      const g = current.g + (ddx !== 0 && ddy !== 0 ? 1.414 : 1);
      const existing = open.find((n) => n.x === nx && n.y === ny);
      if (existing) {
        if (g < existing.g) {
          existing.g = g;
          existing.f = g + existing.h;
          existing.parent = current;
        }
      } else {
        const h = heuristic(nx, ny, end.gx, end.gy);
        open.push({ x: nx, y: ny, g, h, f: g + h, parent: current });
      }
    }
  }

  return null; // No path found
}

/**
 * Remove unnecessary intermediate waypoints (straight-line simplification).
 */
function simplifyPath(path: { x: number; y: number }[]): { x: number; y: number }[] {
  if (path.length <= 2) return path;

  const result = [path[0]];
  for (let i = 1; i < path.length - 1; i++) {
    const prev = result[result.length - 1];
    const curr = path[i];
    const next = path[i + 1];
    // Keep point if direction changes
    const dx1 = Math.sign(curr.x - prev.x);
    const dy1 = Math.sign(curr.y - prev.y);
    const dx2 = Math.sign(next.x - curr.x);
    const dy2 = Math.sign(next.y - curr.y);
    if (dx1 !== dx2 || dy1 !== dy2) {
      result.push(curr);
    }
  }
  result.push(path[path.length - 1]);
  return result;
}
