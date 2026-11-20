import type { CSSProperties } from "react";

/** Fine film grain. Laid over a gradient (mix-blend overlay) so it reads as light, not a flat fill. */
export const GRAIN: CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
  backgroundSize: "180px 180px",
};

/* ─── Workflow stage light ─────────────────────────────────────────────
 * Each workflow has its own composition: a base wash plus a few soft blobs of light
 * that drift on their own paths (and lean toward the pointer, by depth).
 * x / y / w / h are percentages of the stage; depth is how far a blob follows the pointer.
 */
export type LightBlob = {
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
  depth: number;
  path: "a" | "b" | "c";
  dur: number; // seconds per drift cycle
};
/** base and alt are two washes lit from different sides; the stage breathes between them */
export type StageLight = { base: string; alt: string; glow: string; blobs: LightBlob[] };

export const STAGE_LIGHT: Record<string, StageLight> = {
  // Compliance QA: calm blue, lit from the top right, deep navy pooling bottom left
  "compliance-qa": {
    base: "linear-gradient(155deg, #d7dce5 0%, #aebcd5 34%, #6582bb 68%, #2f4a8a 100%)",
    alt: "linear-gradient(330deg, #d9dee8 0%, #b3c1da 30%, #6b88c2 66%, #34508f 100%)",
    glow: "rgba(236, 242, 255, 0.67)",
    blobs: [
      { color: "rgba(40, 74, 152, 0.70)", x: 16, y: 86, w: 72, h: 78, depth: -0.8, path: "a", dur: 9 },
      { color: "rgba(84, 124, 214, 0.55)", x: 84, y: 64, w: 56, h: 64, depth: 0.6, path: "b", dur: 11 },
      { color: "rgba(240, 243, 249, 0.85)", x: 72, y: 8, w: 62, h: 48, depth: 0.4, path: "c", dur: 10 },
      { color: "rgba(146, 168, 222, 0.50)", x: 34, y: 34, w: 46, h: 42, depth: 1, path: "a", dur: 8 },
    ],
  },
  // Placement intake: moss, a bright streak of light across a dark field
  placements: {
    base: "linear-gradient(118deg, #253219 0%, #3e5429 42%, #2d3c1d 72%, #1a2311 100%)",
    alt: "linear-gradient(250deg, #22301a 0%, #445b2c 38%, #34461f 70%, #1b2412 100%)",
    glow: "rgba(214, 236, 160, 0.48)",
    blobs: [
      { color: "rgba(188, 214, 122, 0.60)", x: 60, y: 24, w: 62, h: 26, depth: 0.9, path: "c", dur: 8 },
      { color: "rgba(108, 142, 62, 0.62)", x: 18, y: 42, w: 56, h: 64, depth: -0.6, path: "a", dur: 10 },
      { color: "rgba(222, 236, 172, 0.32)", x: 40, y: 6, w: 44, h: 26, depth: 0.5, path: "b", dur: 10 },
      { color: "rgba(16, 22, 10, 0.62)", x: 86, y: 92, w: 64, h: 60, depth: -0.4, path: "b", dur: 12 },
    ],
  },
  // Client reporting and remittance: amber, a warm glow coming in from the right
  "client-reporting": {
    base: "linear-gradient(200deg, #dad4c7 0%, #c6b08e 36%, #9c7047 70%, #5f4127 100%)",
    alt: "linear-gradient(20deg, #5e4027 0%, #9a6e45 32%, #c8b291 66%, #ddd7ca 100%)",
    glow: "rgba(255, 236, 204, 0.61)",
    blobs: [
      { color: "rgba(214, 140, 60, 0.58)", x: 88, y: 66, w: 56, h: 66, depth: 0.8, path: "b", dur: 10 },
      { color: "rgba(118, 74, 38, 0.62)", x: 14, y: 86, w: 64, h: 62, depth: -0.7, path: "a", dur: 11 },
      { color: "rgba(238, 232, 220, 0.78)", x: 38, y: 10, w: 60, h: 44, depth: 0.3, path: "c", dur: 9 },
      { color: "rgba(228, 178, 102, 0.38)", x: 58, y: 50, w: 42, h: 40, depth: 1, path: "a", dur: 8 },
    ],
  },
  // Disputes and validation: slate-teal, reversed, dark at the top left, light at the foot
  disputes: {
    base: "linear-gradient(330deg, #d8e0e1 0%, #acbdc0 34%, #5f8189 70%, #33525a 100%)",
    alt: "linear-gradient(150deg, #d6dfe0 0%, #a9bbbe 32%, #5c7f88 68%, #31505a 100%)",
    glow: "rgba(226, 244, 246, 0.58)",
    blobs: [
      { color: "rgba(232, 238, 239, 0.80)", x: 82, y: 86, w: 60, h: 52, depth: 0.5, path: "a", dur: 10 },
      { color: "rgba(40, 80, 94, 0.66)", x: 14, y: 14, w: 64, h: 62, depth: -0.8, path: "b", dur: 11 },
      { color: "rgba(126, 176, 182, 0.48)", x: 54, y: 56, w: 44, h: 44, depth: 1, path: "c", dur: 8 },
      { color: "rgba(36, 64, 72, 0.50)", x: 92, y: 8, w: 40, h: 40, depth: -0.4, path: "a", dur: 13 },
    ],
  },
  // Payment posting and reconciliation: sage, lit from the centre, darker at the edges
  "payment-posting": {
    base: "radial-gradient(120% 110% at 50% 42%, #e1e3d6 0%, #bcc1a2 40%, #828d5b 80%, #5c663e 100%)",
    alt: "radial-gradient(120% 110% at 26% 70%, #e2e4d7 0%, #bdc2a3 38%, #838e5c 78%, #5b653d 100%)",
    glow: "rgba(246, 248, 230, 0.64)",
    blobs: [
      { color: "rgba(170, 156, 76, 0.52)", x: 86, y: 80, w: 54, h: 60, depth: 0.7, path: "b", dur: 10 },
      { color: "rgba(104, 136, 78, 0.58)", x: 12, y: 74, w: 56, h: 62, depth: -0.7, path: "a", dur: 10 },
      { color: "rgba(240, 242, 230, 0.72)", x: 50, y: 30, w: 56, h: 46, depth: 0.4, path: "c", dur: 8 },
      { color: "rgba(146, 172, 104, 0.42)", x: 24, y: 14, w: 40, h: 36, depth: 1, path: "a", dur: 11 },
    ],
  },
};
