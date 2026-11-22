"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import "./hero-cta.css";

const BALL = 28; // the orange ball
const PAD = 8; // space between the ball and the pill's left edge
const PILL_H = 44;
const BALL_INSET = (PILL_H - BALL) / 2; // the gap around the ball inside the pill
const MAGNET_REACH = 90; // px around the button where it starts to lean toward the pointer
// How far each layer follows the pointer, and the most it may travel (px). The ball goes a
// little further than the pill and the label a little less, so it feels alive without the
// ball ever reaching the label.
const PILL_PULL = 0.2;
const PILL_MAX = { x: 10, y: 6 };
const BALL_PULL = 0.08;
const BALL_MAX = { x: 4, y: 3 };
const TEXT_PULL = 0.03;
const TEXT_MAX = { x: 2, y: 1.5 };

const pull = (v: number, k: number, max: number) => Math.max(-max, Math.min(max, v * k)).toFixed(2);

// Intro timeline (ms after mount): the hero copy fades in around 480ms, then the ball pops,
// slides to the left and the label is revealed behind it
const POP_AT = 560;
const OPEN_AT = POP_AT + 520;

type Phase = "hidden" | "ball" | "open";

function Star() {
  return (
    <svg width={12} height={12} viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d="M5 1L6.1 3.9L9 5L6.1 6.1L5 9L3.9 6.1L1 5L3.9 3.9L5 1Z" fill="#ffffff" />
    </svg>
  );
}

/**
 * The hero's primary button. It arrives as an orange ball, which slides left as the black pill
 * opens and reveals the label. Once open it is magnetic: it leans toward a nearby pointer, with
 * the ball travelling a little further than the pill.
 */
export default function HeroCta({ label, onClick }: { label: string; onClick: () => void }) {
  const reduce = usePrefersReducedMotion();
  const [introPhase, setIntroPhase] = useState<Phase>("hidden");
  // Under reduced motion there is no intro: the button simply starts open
  const phase: Phase = reduce ? "open" : introPhase;
  const [width, setWidth] = useState(0); // the open pill's natural width
  const measureRef = useRef<HTMLSpanElement>(null);
  const rootRef = useRef<HTMLAnchorElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const ballRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  // Width of the open button, from an invisible copy of the label
  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const update = () => setWidth(Math.ceil(el.getBoundingClientRect().width));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [label]);

  // Intro: ball, then open
  useEffect(() => {
    if (reduce) return;
    const t1 = window.setTimeout(() => setIntroPhase("ball"), POP_AT);
    const t2 = window.setTimeout(() => setIntroPhase("open"), OPEN_AT);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reduce]);

  // Magnetic pull: only with a real pointer, only once open, never under reduced motion.
  // Runs in refs and transforms, so React never re-renders while the pointer moves.
  useEffect(() => {
    if (reduce || phase !== "open") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = rootRef.current;
    if (!root) return;

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;

    const paint = () => {
      const p = pillRef.current;
      const b = ballRef.current;
      const t = textRef.current;
      if (p) p.style.transform = `translate3d(${pull(cur.x, PILL_PULL, PILL_MAX.x)}px, ${pull(cur.y, PILL_PULL, PILL_MAX.y)}px, 0)`;
      if (b) b.style.translate = `${pull(cur.x, BALL_PULL, BALL_MAX.x)}px ${pull(cur.y, BALL_PULL, BALL_MAX.y)}px`;
      if (t) t.style.translate = `${pull(cur.x, TEXT_PULL, TEXT_MAX.x)}px ${pull(cur.y, TEXT_PULL, TEXT_MAX.y)}px`;
    };
    const tick = () => {
      // a soft spring: quick to follow, settles without wobbling
      cur.x += (target.x - cur.x) * 0.18;
      cur.y += (target.y - cur.y) * 0.18;
      paint();
      if (Math.abs(target.x - cur.x) > 0.05 || Math.abs(target.y - cur.y) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        cur.x = target.x;
        cur.y = target.y;
        paint();
        raf = 0;
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const near =
        e.clientX > r.left - MAGNET_REACH &&
        e.clientX < r.right + MAGNET_REACH &&
        e.clientY > r.top - MAGNET_REACH &&
        e.clientY < r.bottom + MAGNET_REACH;
      target.x = near ? dx : 0;
      target.y = near ? dy : 0;
      kick();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduce, phase]);

  const open = phase === "open";
  const closedInset = width ? (width - PILL_H) / 2 : 0;
  // While closed, the ball sits in the middle of where the pill will be
  const ballShift = open ? 0 : closedInset;

  return (
    <a
      ref={rootRef}
      href="#contact"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="hero-cta group relative inline-flex rounded-full focus-visible:outline-none"
      style={{ width: width || undefined, height: PILL_H }}
      data-phase={phase}
    >
      {/* Invisible copy, only there to measure the open width */}
      <span
        ref={measureRef}
        aria-hidden
        className="invisible absolute left-0 top-0 whitespace-nowrap flex items-center gap-3 text-[14px] font-medium tracking-[-0.01em]"
        style={{ paddingLeft: PAD, paddingRight: 20, height: PILL_H }}
      >
        <span style={{ width: BALL, height: BALL }} className="shrink-0" />
        {label}
      </span>

      {/* The magnetic layer: everything visible moves together */}
      <span ref={pillRef} className="hero-cta__body absolute inset-0 will-change-transform">
        {/* Black pill: opens from a circle around the ball to its full width */}
        <span
          className="hero-cta__pill absolute inset-0 rounded-full bg-[#0a0a0a] shadow-[0_12px_28px_rgba(10,10,10,0.16)] overflow-hidden"
          style={{
            // closed: clipped to exactly the ball, so the pill grows out of it
            clipPath: open
              ? "inset(0px 0px 0px 0px round 999px)"
              : `inset(${BALL_INSET}px ${closedInset + BALL_INSET}px ${BALL_INSET}px ${closedInset + BALL_INSET}px round 999px)`,
          }}
        >
          {/* light sweeps: one as the pill opens, one on each hover */}
          <span aria-hidden className="hero-cta__shine absolute inset-y-0 -left-1/3 w-1/3" />
          <span aria-hidden className="hero-cta__shine-hover absolute inset-y-0 -left-1/3 w-1/3" />
        </span>

        {/* Label, revealed as the ball moves out of the way */}
        <span
          ref={textRef}
          className="hero-cta__label absolute inset-y-0 flex items-center whitespace-nowrap text-white text-[14px] font-medium tracking-[-0.01em]"
          style={{ left: PAD + BALL + 12 }}
        >
          {label}
        </span>

        {/* The orange ball */}
        <span
          className="absolute top-1/2 hero-cta__ball-track"
          style={{ left: PAD, transform: `translate3d(${ballShift}px, -50%, 0)` }}
        >
          <span
            ref={ballRef}
            className="hero-cta__ball relative flex items-center justify-center rounded-full bg-[#FF731E]"
            style={{ width: BALL, height: BALL }}
          >
            <span aria-hidden className="hero-cta__ring absolute inset-0 rounded-full" />
            <span className="hero-cta__star flex">
              <Star />
            </span>
          </span>
        </span>
      </span>
    </a>
  );
}
