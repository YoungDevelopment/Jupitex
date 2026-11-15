/**
 * The flashlight over the mossy rocks is dark until someone points at a rock. Once, when a
 * rock first comes into view, the light wanders across it on a random path and leaves again:
 * a glimpse that there is something under the bare stone.
 */

export type Box = { x0: number; y0: number; x1: number; y1: number };
export type Point = { x: number; y: number };
export type Sweep = Point[]; // control points; the light travels a smooth curve through them

/** Medium pace: slow enough to follow with the eye, short enough not to hold anyone up. */
export const SWEEP_MS = 3200;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * A random path: in from outside one side, through a few random spots on the rock,
 * and out past the opposite side, so it ends fully dark.
 */
export function sweepPath(box: Box, radius: number): Sweep {
  const w = box.x1 - box.x0;
  const h = box.y1 - box.y0;
  const at = (fx: number, fy: number): Point => ({ x: box.x0 + w * fx, y: box.y0 + h * fy });
  const horizontal = Math.random() < 0.5;
  const forward = Math.random() < 0.5;
  const stops = 3;

  const pts: Point[] = [];
  for (let i = 0; i < stops; i++) {
    // spread the stops along the travel axis, wander freely across the other one
    const along = (i + rand(0.65, 1.35)) / (stops + 1);
    const across = rand(0.2, 0.8);
    pts.push(horizontal ? at(along, across) : at(across, along));
  }
  if (!forward) pts.reverse();

  const first = pts[0];
  const last = pts[pts.length - 1];
  const enter: Point = horizontal
    ? { x: forward ? box.x0 - radius : box.x1 + radius, y: first.y }
    : { x: first.x, y: forward ? box.y0 - radius : box.y1 + radius };
  const exit: Point = horizontal
    ? { x: forward ? box.x1 + radius : box.x0 - radius, y: last.y }
    : { x: last.x, y: forward ? box.y1 + radius : box.y0 - radius };

  return [enter, ...pts, exit];
}

/** Catmull-Rom through the control points, so the light curves rather than zig-zags. */
function curve(p: Sweep, t: number): Point {
  const n = p.length - 1;
  const seg = Math.min(n - 1, Math.floor(t * n));
  const u = t * n - seg;
  const p0 = p[Math.max(0, seg - 1)];
  const p1 = p[seg];
  const p2 = p[seg + 1];
  const p3 = p[Math.min(n, seg + 2)];
  const cr = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
  return { x: cr(p0.x, p1.x, p2.x, p3.x), y: cr(p0.y, p1.y, p2.y, p3.y) };
}

/** Where the light is `elapsed` ms into a sweep, or null once it has left the rock. */
export function sweepAt(path: Sweep, elapsed: number): Point | null {
  if (elapsed >= SWEEP_MS) return null;
  return curve(path, easeInOut(Math.max(0, elapsed) / SWEEP_MS));
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
