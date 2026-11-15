/**
 * Responsive variants for the layered rock and wood art. Each `<name>.webp`
 * (2000w) in /public has `-1000` and `-1400` siblings, so phones and
 * standard-density screens don't download the full-size file.
 * Bare and green layers must share the same `sizes` so they pick the same
 * width and their masks stay aligned.
 */
export const artSrcSet = (base: string) =>
  `${base}-1000.webp 1000w, ${base}-1400.webp 1400w, ${base}.webp 2000w`;
