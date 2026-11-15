"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

/* Cards thrown onto a table, one after another, each landing a little low and at an angle (the
   left turned clockwise, the right anticlockwise, the middle just off square). Then, all at once:
   - "stack": they all land on the middle spot in a pile, then snap out to their places;
   - "place": each lands on its own spot already, then they all straighten up together. */
const TILT = [9, 2.5, -9];
const THROW_MS = 560; // the slide across the felt
const THROW_GAP = 230; // between one throw and the next
const THROW_EASE = "cubic-bezier(0.16, 0.84, 0.3, 1)"; // fast off the hand, dragging to a stop
const SNAP_MS = 750;
const SNAP_EASE = "cubic-bezier(0.34, 1.42, 0.5, 1)"; // a quick spring into place
const RISE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

type Phase = "hand" | "thrown" | "snap" | "rise";

/**
 * Drives the throw for a row of three cards. Attach `containerRef` to the grid and `cardRef(i)`
 * to each card's wrapper, then spread `cardStyle(i)` onto it. When the cards are not side by side
 * (stacked on phones) or motion is reduced, they simply rise in one by one instead.
 */
export function useCardThrow({
  threshold = 0.3,
  mode = "stack",
}: { threshold?: number; mode?: "stack" | "place" } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [phase, setPhase] = useState<Phase>("hand");
  const [offsets, setOffsets] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const timers: number[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const nodes = cards.current.filter(Boolean) as HTMLDivElement[];
        const oneRow =
          nodes.length === 3 && nodes.every((n) => Math.abs(n.offsetTop - nodes[0].offsetTop) < 2);
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!oneRow || reduce) {
          setPhase("rise");
          return;
        }
        // How far each card sits from the middle spot, where they all land first
        const centre = nodes[1].offsetLeft;
        setOffsets(nodes.map((n) => centre - n.offsetLeft));
        timers.push(window.setTimeout(() => setPhase("thrown"), 150));
        // Once the last card has landed and settled for a beat, they all snap out together
        timers.push(window.setTimeout(() => setPhase("snap"), 150 + THROW_GAP * 2 + THROW_MS + 280));
      },
      { threshold }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [threshold]);

  const cardRef = useCallback(
    (i: number) => (node: HTMLDivElement | null) => {
      cards.current[i] = node;
    },
    []
  );

  const cardStyle = (i: number): CSSProperties => {
    const toCentre = offsets[i] ?? 0;
    // stacking: every card lands on the middle spot · placing: each lands on its own spot, thrown
    // out from the dealer in the middle so it travels outward as it comes in
    const dx = mode === "stack" ? toCentre : 0;
    const fromX = mode === "stack" ? toCentre : toCentre * 0.55;
    const tilt = TILT[i] ?? 0;
    const shadow = "box-shadow 300ms ease";
    switch (phase) {
      case "hand": // still in the dealer's hand: below the table, out of sight
        return {
          opacity: 0,
          transform: `translate3d(${fromX}px, 220px, 0) rotate(${tilt * 1.8}deg) scale(0.96)`,
          zIndex: i + 1,
        };
      case "thrown":
        return {
          opacity: 1,
          transform: `translate3d(${dx}px, 48px, 0) rotate(${tilt}deg)`,
          zIndex: i + 1,
          // a heavier shadow while they lie piled up, so each card reads on top of the last
          boxShadow: "0 16px 40px rgba(0,0,0,0.10)",
          transition: `opacity 110ms linear ${i * THROW_GAP}ms, transform ${THROW_MS}ms ${THROW_EASE} ${i * THROW_GAP}ms, ${shadow}`,
        };
      case "snap":
        return {
          opacity: 1,
          transform: "none",
          zIndex: i + 1,
          transition: `transform ${SNAP_MS}ms ${SNAP_EASE}, ${shadow}`,
        };
      case "rise":
        return {
          opacity: 1,
          transform: "none",
          transition: `opacity 700ms ease ${200 + i * 180}ms, transform 1000ms ${RISE_EASE} ${200 + i * 180}ms, ${shadow}`,
        };
    }
  };

  return { containerRef, cardRef, cardStyle };
}
