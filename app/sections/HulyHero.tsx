"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { GlowingButton } from "@/components/ui/glowing-button";

/* ─────────────────────────────────────────────────────────────────────────
   Jupitex hero idle sweep.

   The overlay SVGs fill maskRef which is 1574 × 1474 px.  The sweep path
   must be expressed in that same coordinate space so the reveal circle
   travels through the visible hero art (screenshot + light-beam area).

   We use a slow elliptical orbit centred on x≈900, y≈580, which sits
   roughly over the Tracker screenshot in the original design.
───────────────────────────────────────────────────────────────────────── */

const SWEEP_DURATION = 6000; // ms for one full orbit
const SWEEP_INTERVAL = 7000; // ms from orbit-end to next orbit-start

// Ellipse centred on the hero art; all values are in maskRef-local px.
const SWEEP_CX = 920;
const SWEEP_CY = 580;
const SWEEP_RX = 380;
const SWEEP_RY = 180;

function getSweepPos(progress: number) {
  const angle = progress * Math.PI * 2 - Math.PI / 2; // start at top
  return {
    x: SWEEP_CX + Math.cos(angle) * SWEEP_RX,
    y: SWEEP_CY + Math.sin(angle) * SWEEP_RY,
  };
}

const HERO_HEADLINE_GRADIENT = {
  background: "linear-gradient(to bottom right, #ffffff 30%, #d5d8f6 80%, #fdf7fe)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

const HERO_MUTED = "#e5e5e7";

/** Match `<motion.h1>` width so stats align with the hero headline block. */
const HERO_TEXT_MAX_W =
  "max-w-72 sm:max-w-[420px] md:max-w-[520px] lg:max-w-[616px]";

/** Animate 0 → target with easeOutCubic. Starts when `start` flips true. */
function useCountUp(
  target: number,
  duration = 1800,
  start = false,
  decimals = 0,
) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = Math.min((now - t0) / duration, 1);
      const next = target * ease(t);
      setValue(
        decimals ? parseFloat(next.toFixed(decimals)) : Math.floor(next),
      );
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else setValue(target);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, start, decimals]);

  return value;
}

type StatItemProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  decimals?: number;
  start: boolean;
};

function StatItem({
  value,
  prefix = "",
  suffix = "",
  label,
  decimals = 0,
  start,
}: StatItemProps) {
  const animated = useCountUp(value, 1800, start, decimals);
  const display = decimals ? animated.toFixed(decimals) : animated.toLocaleString();

  return (
    <div
      role="listitem"
      className="flex w-full min-w-0 max-w-36 flex-col items-center text-center sm:max-w-44 lg:max-w-none"
    >
      <div
        className="font-title text-[clamp(1.75rem,7vw,3.75rem)] font-light leading-none tracking-tight tabular-nums whitespace-nowrap lg:text-6xl"
        style={HERO_HEADLINE_GRADIENT}
      >
        {prefix}
        {display}
        {suffix}
      </div>
      <div
        className="mt-2 text-xs leading-snug sm:mt-3 sm:text-sm md:text-base"
        style={{ color: HERO_MUTED, opacity: 0.7 }}
      >
        {label}
      </div>
    </div>
  );
}

type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  decimals?: number;
};

function StatsBar({
  stats = [
    { value: 4, suffix: " weeks", label: "from Audit to Automation" },
    { value: 105, suffix: " hrs", label: "saved per month" },
    { value: 11, suffix: " audits", label: "completed since 2026" },
    { value: 27, suffix: " +", label: "projects" },
  ],
  className = "",
}: {
  stats?: Stat[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="list"
      className={[
        "w-full",
        "relative mx-auto grid max-w-[1120px] grid-cols-2 items-start justify-items-center",
        "gap-x-3 gap-y-6 px-4 2xs:px-5 sm:gap-x-8 sm:gap-y-8 sm:px-6 md:px-8 lg:grid-cols-4 lg:gap-x-10 xl:gap-x-14",
        "mt-8 sm:mt-20",
        "pb-5 sm:pb-7 md:pb-10 lg:pb-12",
        className,
      ].join(" ")}
    >
      {stats.map((s, i) => (
        <StatItem key={i} {...s} start={inView} />
      ))}
    </div>
  );
}

export default function HulyHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : false,
  );

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const sweepRaf = useRef<number>(0);
  const sweepTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sweepStart = useRef(0);
  const hovering = useRef(false);

  /* keep a stable ref to startSweep to break the self-referential closure */
  const startSweepFn = useRef<() => void>(() => {});

  /* ── update CSS vars on the mask wrapper ──────────────────────── */
  const setMask = useCallback((x: number, y: number) => {
    maskRef.current?.style.setProperty("--hero-mask-x", `${x}px`);
    maskRef.current?.style.setProperty("--hero-mask-y", `${y}px`);
  }, []);

  /* ── idle sweep ───────────────────────────────────────────────── */
  const startSweep = useCallback(() => {
    if (hovering.current) return;
    sweepStart.current = performance.now();

    const tick = (now: number) => {
      if (hovering.current) return;
      if (!maskRef.current) return;
      const t = Math.min((now - sweepStart.current) / SWEEP_DURATION, 1);
      const { x, y } = getSweepPos(t);
      setMask(x, y);
      if (t < 1) {
        sweepRaf.current = requestAnimationFrame(tick);
      } else {
        sweepTimer.current = setTimeout(
          () => startSweepFn.current(),
          SWEEP_INTERVAL - SWEEP_DURATION,
        );
      }
    };

    sweepRaf.current = requestAnimationFrame(tick);
  }, [setMask]);

  useEffect(() => {
    startSweepFn.current = startSweep;
  }, [startSweep]);

  const stopSweep = useCallback(() => {
    cancelAnimationFrame(sweepRaf.current);
    if (sweepTimer.current) {
      clearTimeout(sweepTimer.current);
      sweepTimer.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      stopSweep();
      return;
    }
    startSweep();
    return stopSweep;
  }, [startSweep, stopSweep, isDesktop]);

  /* ── event handlers (desktop only) ────────────────────────────── */
  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!isDesktop) return;
      const mask = maskRef.current;
      if (!mask) return;
      const r = mask.getBoundingClientRect();
      setMask(e.clientX - r.left, e.clientY - r.top);
    },
    [setMask, isDesktop],
  );

  const onMouseEnter = useCallback(() => {
    if (!isDesktop) return;
    hovering.current = true;
    stopSweep();
  }, [stopSweep, isDesktop]);

  const onMouseLeave = useCallback(() => {
    if (!isDesktop) return;
    hovering.current = false;
    startSweep();
  }, [startSweep, isDesktop]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative overflow-hidden h-svh min-h-[600px] sm:min-h-[700px] md:min-h-[800px] lg:h-[1078px] xl:h-[1438px] pt-20 sm:pt-28 md:pt-32 lg:pt-36 xl:pt-[184px]"
      style={{ background: "#000000" }}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ─── Inner container ────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative mx-auto flex h-full flex-col max-w-[1280px] px-5 2xs:px-6 sm:px-8"
      >
        {/* ─── H1 ─────────────────────────────────────────────── */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0, ease: [0.25, 0.1, 0.25, 1] }}
          className={`relative z-30 text-display-hero font-title ${HERO_TEXT_MAX_W}`}
          style={{
            background:
              "linear-gradient(to bottom right, #ffffff 30%, #d5d8f6 80%, #fdf7fe)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          We help growing businesses put AI to work.
        </motion.h1>

        {/* ─── Sub-text ────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="relative z-30 mt-3 sm:mt-5 md:mt-6 max-w-88 sm:max-w-104 md:max-w-md text-body-ds"
          style={{ color: "#e5e5e7" }}
        >
          We look at your day-to-day operations, find the repetitive work
          that&apos;s costing you time and money, then build AI that handles it.
        </motion.p>

        {/* ─── CTA button ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative flex justify-start z-50 mt-6 sm:mt-8 md:mt-10 lg:mt-11"
        >
          <GlowingButton href="#contact" className="h-11 px-16 text-[13px]">
            Free AI Audit Report
          </GlowingButton>
        </motion.div>

        {/* ─── Hero media stack (overlay + screenshot) ────────── */}
        <div
          ref={maskRef}
          className="absolute bottom-0 left-0 w-[140%] xs:w-[135%] sm:w-[130%] md:w-[140%] lg:w-[1220px] xl:left-[24px] xl:w-[1574px] max-w-none aspect-[1.067842]"
          style={{
            isolation: "isolate",
            ["--hero-mask-x" as string]: "0px",
            ["--hero-mask-y" as string]: "0px",
          }}
        >
          {/* base glow/video layer (lighten blend) */}
          <div className="absolute -left-[30%] w-[170%] sm:-left-[25%] sm:w-[155%] md:-left-[22%] md:w-[148%] lg:-left-[253px] lg:w-[1620px] xl:-left-[344px] xl:w-[1920px] bottom-0 z-0 aspect-[1.335187] max-w-none mix-blend-lighten">
            <video
              className="absolute inset-0 h-full w-full"
              width={1920}
              height={1438}
              autoPlay
              loop
              playsInline
              muted
              preload="metadata"
              style={{ opacity: 1 }}
            >
              <source src="/videos/pages/home/hero/hero.mp4" type="video/mp4" />
              <source
                src="/videos/pages/home/hero/hero.webm"
                type="video/webm"
              />
            </video>
            {/* Edge fades — blend video edges into the black background */}
            <div className="pointer-events-none absolute inset-0 z-10">
              {/* Top fade — visible on mobile/tablet only */}
              <div
                className="absolute top-0 left-0 right-0 h-[80px] sm:h-[100px] lg:h-0"
                style={{
                  background:
                    "linear-gradient(to bottom, #000000 0%, rgba(0,0,0,0.7) 40%, transparent 100%)",
                }}
              />
              <div
                className="absolute inset-y-0 left-0 w-[100px] sm:w-[140px] md:w-[200px] xl:w-[320px]"
                style={{
                  background:
                    "linear-gradient(to right, #000000 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 75%, transparent 100%)",
                }}
              />
              <div
                className="absolute inset-y-0 right-0 w-[100px] sm:w-[140px] md:w-[200px] xl:w-[320px]"
                style={{
                  background:
                    "linear-gradient(to left, #000000 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 75%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {/* SVG overlay layer — clip-path follows the mask vars */}
          <div
            className="relative h-full hidden lg:block"
            style={{
              mixBlendMode: "overlay",
              clipPath:
                "circle(var(--hero-mask-size) at var(--hero-mask-x) var(--hero-mask-y))",
            }}
          >
            <Image
              alt=""
              loading="lazy"
              width={1574}
              height={1474}
              decoding="async"
              className="absolute w-full max-w-none"
              style={{
                WebkitMaskImage:
                  "radial-gradient(var(--hero-mask-size) at var(--hero-mask-x) var(--hero-mask-y), black 20%, transparent)",
                maskImage:
                  "radial-gradient(var(--hero-mask-size) at var(--hero-mask-x) var(--hero-mask-y), black 20%, transparent)",
                color: "transparent",
              }}
              src="/images/hero-overlay-1.svg"
              unoptimized
            />
            <Image
              alt=""
              loading="lazy"
              width={1574}
              height={1474}
              decoding="async"
              className="absolute z-10 w-full max-w-none"
              style={{
                WebkitMaskImage:
                  "radial-gradient(var(--hero-mask-size) at var(--hero-mask-x) var(--hero-mask-y), black 20%, transparent)",
                maskImage:
                  "radial-gradient(var(--hero-mask-size) at var(--hero-mask-x) var(--hero-mask-y), black 20%, transparent)",
                color: "transparent",
              }}
              src="/images/hero-overlay-2.svg"
              unoptimized
            />
          </div>

          {/* hero illustration */}
          <Image
            alt="AI automation dashboard preview"
            src="/images/hero-illustration.png"
            className="absolute bottom-[85px] sm:bottom-[85px] md:bottom-[95px] lg:bottom-[133px] xl:bottom-[136px] left-[1.3%] sm:left-[3%] md:left-[2%] lg:left-[36px] xl:left-[8px] w-[92%] sm:w-[90%] md:w-[76%] lg:w-[873px] xl:w-[1024px] rounded-t sm:rounded-t-md lg:rounded-t-lg xl:rounded-t-[10px] object-cover object-top"
            width={1024}
            height={569}
            priority
            fetchPriority="high"
            sizes="(max-width: 640px) 92vw, (max-width: 768px) 90vw, (max-width: 1024px) 76vw, 1024px"
          />

          {/* Bottom gradient vignette — inside isolation context so it layers on top of video */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 z-30 w-full h-[200px] sm:h-[260px] md:h-[300px] lg:h-[340px]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000000 50%)",
            }}
          />
        </div>

        {/* ─── Feature ticker ──────────────────────────────────── */}
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-40 flex justify-center">
        <StatsBar className="pointer-events-auto" />
      </div>

      {/* ─── Bottom gradient vignette (inside section, full width) ── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-20 w-full h-[200px] sm:h-[260px] md:h-[300px] lg:h-[340px]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000000 50%)",
        }}
      />
    </section>
  );
}
