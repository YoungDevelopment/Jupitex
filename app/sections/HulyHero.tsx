"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { GlowingButton } from "@/components/ui/glowing-button";

/* ─────────────────────────────────────────────────────────────────────────
   Huly hero idle sweep.

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

export default function HulyHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

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
    startSweep();
    return stopSweep;
  }, [startSweep, stopSweep]);

  /* ── event handlers ───────────────────────────────────────────── */
  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const mask = maskRef.current;
      if (!mask) return;
      const r = mask.getBoundingClientRect();
      setMask(e.clientX - r.left, e.clientY - r.top);
    },
    [setMask],
  );

  const onMouseEnter = useCallback(() => {
    hovering.current = true;
    stopSweep();
  }, [stopSweep]);

  const onMouseLeave = useCallback(() => {
    hovering.current = false;
    startSweep();
  }, [startSweep]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative overflow-hidden h-svh min-h-[600px] sm:min-h-[700px] lg:min-h-[800px] xl:h-[1438px] pt-24 sm:pt-28 md:pt-32 lg:pt-36 xl:pt-[184px]"
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
        <h1
          className="relative z-30 text-hero-headline font-title max-w-72 sm:max-w-[420px] md:max-w-[520px] lg:max-w-[616px]"
          style={{
            background:
              "linear-gradient(to bottom right, #ffffff 30%, #d5d8f6 80%, #fdf7fe)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          We don&apos;t just talk AI. We deliver it.
        </h1>

        {/* ─── Sub-text ────────────────────────────────────────── */}
        <p
          className="relative z-30 mt-5 sm:mt-6 max-w-88 sm:max-w-104 md:max-w-md text-body-ds"
          style={{ color: "#e5e5e7" }}
        >
          Jupitex is an AI-first development agency that identifies exactly
          where AI and Automation moves the needle in your business then builds
          it, and trains your team to own it.
        </p>

        {/* ─── CTA button ──────────────────────────────────────── */}
        <div className="relative flex justify-start z-50 mt-8 sm:mt-10 md:mt-11">
          <GlowingButton href="#contact" className="h-11 px-8 text-[13px]">
            Free AI Audit Report
          </GlowingButton>
        </div>

        {/* ─── Hero media stack (overlay + screenshot) ────────── */}
        <div
          ref={maskRef}
          className="absolute max-w-none w-[200%] sm:w-[180%] md:w-[160%] xl:w-[1574px] left-0 sm:left-3 xl:left-[24px]"
          style={{
            bottom: 0,
            aspectRatio: "1.067842",
            isolation: "isolate",
            ["--hero-mask-x" as string]: "0px",
            ["--hero-mask-y" as string]: "0px",
          }}
        >
          {/* base glow/video layer (lighten blend) */}
          <div className="absolute -left-[20%] sm:-left-[25%] xl:-left-[344px] bottom-0 z-0 aspect-[1.335187] w-[140%] sm:w-[150%] xl:w-[1920px] max-w-none mix-blend-lighten before:absolute before:top-0 before:z-10 before:h-20 before:w-full before:bg-linear-to-b before:from-grey-1 before:to-grey-1/0">
            <video
              className="absolute inset-0 h-full w-full"
              width={1920}
              height={1438}
              autoPlay
              loop
              playsInline
              muted
              style={{ opacity: 1 }}
            >
              <source src="/videos/pages/home/hero/hero.mp4" type="video/mp4" />
              <source
                src="/videos/pages/home/hero/hero.webm"
                type="video/webm"
              />
            </video>
            {/* Right-side fade — inside the lighten-blend container so it darkens the video before blending */}
            <div className="pointer-events-none absolute inset-0 z-10">
              {/* Left-side smooth fade */}
              <div
                className="absolute inset-y-0 left-0 w-[100px] sm:w-[150px] xl:w-[220px]"
                style={{
                  background:
                    "linear-gradient(to right, var(--color-grey-1) 0%, color-mix(in oklab, var(--color-grey-1) 85%, transparent) 30%, color-mix(in oklab, var(--color-grey-1) 50%, transparent) 55%, color-mix(in oklab, var(--color-grey-1) 20%, transparent) 80%, transparent 100%)",
                }}
              />
              <div
                className="absolute inset-y-0 right-0 w-[100px] sm:w-[150px] xl:w-[220px]"
                style={{
                  background:
                    "linear-gradient(to left, var(--color-grey-1) 0%, color-mix(in oklab, var(--color-grey-1) 85%, transparent) 30%, color-mix(in oklab, var(--color-grey-1) 50%, transparent) 55%, color-mix(in oklab, var(--color-grey-1) 20%, transparent) 80%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {/* SVG overlay layer — clip-path follows the mask vars */}
          <div
            className="relative h-full"
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

          {/* app screenshot */}
          <Image
            alt="Huly platform screenshot"
            fetchPriority="high"
            width={1024}
            height={569}
            decoding="async"
            className="absolute rounded-t-[10px] bottom-[60px] sm:bottom-[80px] lg:bottom-[100px] xl:bottom-[141px] left-1 sm:left-2"
            style={{
              color: "transparent",
            }}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 80vw, (max-width: 1280px) 873px, 1024px"
            src="/images/hero-illustration.jpg"
          />

          {/* Bottom gradient vignette — inside isolation context so it layers on top of video */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 w-full"
            style={{
              zIndex: 30,
              height: "340px",
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000000 50%)",
            }}
          />
        </div>

        {/* ─── Feature ticker ──────────────────────────────────── */}
        <div className="absolute z-30 overflow-hidden bottom-12 sm:bottom-16 lg:bottom-20 xl:bottom-[88px] text-micro sm:text-caption-ds tracking-[-0.02em]">
          <p
            className="mb-2 sm:mb-3.5 font-light leading-none will-change-transform"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Everything you need for productive team work:
          </p>
          <ul
            className="flex flex-wrap gap-y-1 shrink-0 font-semibold"
            style={{ color: "#ffffff", lineHeight: "1.125" }}
          >
            {(
              [
                "Team Planner",
                "Project Management",
                "Virtual Office",
                "Chat",
                "Documents",
                "Inbox",
              ] as const
            ).map((item, i) => (
              <li key={item} className="relative shrink-0">
                {i > 0 && (
                  <span
                    className="relative inline-block rounded-full align-middle"
                    style={{
                      width: "3px",
                      height: "3px",
                      margin: "0 6px",
                      background: "rgba(255,255,255,0.3)",
                    }}
                  />
                )}
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ─── Bottom gradient vignette (inside section, full width) ── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-20 w-full"
        style={{
          height: "340px",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000000 50%)",
        }}
      />
    </section>
  );
}
