"use client";

import React, { useEffect, useRef, useState } from "react";
import DashboardPreview from "./DashboardPreview";
import { HERO, NAV_LINKS, scrollToId } from "@/lib/site";
import { type Box, type Point, prefersReducedMotion, sweepAt, sweepPath } from "@/lib/flashlight";

// Fill 100% edge-to-edge on all laptop and desktop screens; only cap when crossing ultrawide (> 1920px)
const ULTRAWIDE_LIMIT = 1920;
const BASE_STAGE_WIDTH = 1428;
const BASE_STAGE_HEIGHT = 928;

// Exact 1428x928 stage coordinates for the complete 4:3 rocks
// so only the reference portion is shown inside the viewport and the rest is hidden off-screen
const LEFT_ROCK_BOX = { left: -245, top: 1, width: 706, height: 527 }; // relative to bottom stage (y=400..928)
const RIGHT_ROCK_BOX = { left: 909, top: -4, width: 1060, height: 791 }; // relative to bottom stage (y=400..928)

// Natural height of the desktop copy block (eyebrow, two headline lines, body, buttons)
const COPY_BLOCK_HEIGHT = 306;
const MIN_COPY_ROOM = 310;

// Flashlight radius per rock, in stage px
const LEFT_RADIUS = 250;
const RIGHT_RADIUS = 260;

// The part of each rock that is actually on screen (stage coordinates): the sweep crosses this
const LEFT_VISIBLE: Box = { x0: 0, y0: 400, x1: 278, y1: 928 };
const RIGHT_VISIBLE: Box = { x0: 909, y0: 396, x1: 1428, y1: 928 };

type Mode = "mobile" | "tablet" | "desktop";

/**
 * The flashlight is a mask whose centre and radius are read from CSS variables set on the
 * stage. Radius 0 (the default) means the light is off and the rock shows bare.
 */
function flashlightMask(x: string, y: string, r: string): React.CSSProperties {
  const g = `radial-gradient(circle var(${r}, 0px) at var(${x}, 0px) var(${y}, 0px), rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 42%, rgba(0,0,0,0.4) 72%, rgba(0,0,0,0) 100%)`;
  return { maskImage: g, WebkitMaskImage: g };
}

const LEFT_MASK = flashlightMask("--lx", "--ly", "--lr");
const RIGHT_MASK = flashlightMask("--rx", "--ry", "--rr");

function Star({ size = 9, fill = "#0a0a0a" }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d="M5 1L6.1 3.9L9 5L6.1 6.1L5 9L3.9 6.1L1 5L3.9 3.9L5 1Z" fill={fill} />
    </svg>
  );
}

function Logo({ className }: { className: string }) {
  return (
    <a href="#" aria-label="Jupitex home" className="flex items-center shrink-0">
      <img src="/JupitexLogos/nav_logo_light.png" alt="Jupitex" className={className} />
    </a>
  );
}

function NavLinks({ className, onNavigate }: { className: string; onNavigate?: () => void }) {
  return (
    <>
      {NAV_LINKS.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.();
            scrollToId(item.id);
          }}
          className={className}
        >
          {item.label}
        </a>
      ))}
    </>
  );
}

function NavCta({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href="#contact"
      onClick={(e) => {
        e.preventDefault();
        scrollToId("contact");
      }}
      className={`group h-[34px] pl-[7px] rounded-full bg-[#0a0a0a] text-white flex items-center font-medium tracking-[-0.01em] hover:bg-[#1e1e1e] active:scale-[0.97] transition-[background-color,transform] duration-200 shadow-xs shrink-0 ${
        compact ? "pr-[13px] gap-[7px] text-[11.5px]" : "pr-[15px] gap-[8px] text-[12px]"
      }`}
    >
      <span className="w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:rotate-90">
        <Star />
      </span>
      <span>Free audit</span>
    </a>
  );
}

function HeroActions({ style }: { style: React.CSSProperties }) {
  return (
    <div style={style} className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
      <a
        href="#contact"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("contact");
        }}
        className="group h-[44px] pl-[8px] pr-[20px] rounded-full bg-[#0a0a0a] text-white flex items-center gap-3 text-[14px] font-medium tracking-[-0.01em] hover:bg-[#1a1a1a] active:scale-[0.97] transition-[background-color,transform] duration-200 shadow-[0_12px_28px_rgba(10,10,10,0.16)]"
      >
        <span className="w-[28px] h-[28px] rounded-full bg-[#FF731E] flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:rotate-90">
          <Star size={12} fill="#ffffff" />
        </span>
        <span>{HERO.primaryCta}</span>
      </a>
      <a
        href="#automations"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("automations");
        }}
        className="group flex items-center gap-1.5 text-[14px] font-medium tracking-[-0.01em] text-[#3d4044] hover:text-[#0a0a0a] transition-colors duration-200"
      >
        <span>{HERO.secondaryCta}</span>
        <svg
          width="13"
          height="13"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          <path
            d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}

function RightRock() {
  return (
    <>
      <img
        src="/rocks/rock-right-bare.webp"
        alt=""
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain"
      />
      <img
        src="/rocks/rock-right-green.webp"
        alt=""
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain"
        style={RIGHT_MASK}
      />
    </>
  );
}

function ScrollHint({ className, gradient }: { className: string; gradient: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-40 flex items-end justify-center ${className}`}
      style={{ background: gradient }}
    >
      <div className="flex items-center gap-[6px] text-white/90 text-[11px] font-normal">
        <Star size={11} fill="white" />
        <span>Scroll to explore</span>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [viewportMode, setViewportMode] = useState<Mode>("desktop");
  const [stageScale, setStageScale] = useState(1);
  const [bottomOffsetPx, setBottomOffsetPx] = useState(0);
  const [topScale, setTopScale] = useState(1);
  const [copyRoom, setCopyRoom] = useState(MIN_COPY_ROOM);
  const [mobileDashScale, setMobileDashScale] = useState(0.64);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Flashlight position in the 1428 x 928 reference coordinate system.
  // Lives in refs and is written to CSS variables, so moving it never re-renders React.
  const targetPos = useRef<Point>({ x: 0, y: 0 });
  const currentPos = useRef<Point>({ x: 0, y: 0 });
  // How lit the pointer's light is: 0 = off (rocks bare), 1 = full radius
  const targetOn = useRef(0);
  const currentOn = useRef(0);
  const rafRef = useRef(0);
  const sweepRaf = useRef(0); // the one-off reveal on load; the pointer takes over and cancels it
  const modeRef = useRef<Mode>("desktop");
  const bottomOffsetRef = useRef(0);

  useEffect(() => {
    const updateLayout = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (vw < 768) {
        modeRef.current = "mobile";
        bottomOffsetRef.current = 0;
        setViewportMode("mobile");
        setStageScale(1);
        setBottomOffsetPx(0);
        setTopScale(1);
        setMobileDashScale(Math.min(0.75, Math.max(0.58, (vw / 390) * 0.64)));
      } else if (vw < 1024) {
        modeRef.current = "tablet";
        bottomOffsetRef.current = 0;
        setViewportMode("tablet");
        setStageScale(vw / BASE_STAGE_WIDTH);
        setBottomOffsetPx(0);
        setTopScale(1);
      } else {
        modeRef.current = "desktop";
        setViewportMode("desktop");
        const effectiveWidth = Math.min(vw, ULTRAWIDE_LIMIT);
        const sW = effectiveWidth / BASE_STAGE_WIDTH;
        setStageScale(sW);

        const idealHeight = BASE_STAGE_HEIGHT * sW;
        const heightDelta = vh - idealHeight;
        let offset = heightDelta < 0 ? Math.max(-110, heightDelta * 0.48) : 0;

        // Space between the nav and the dashboard, where the copy lives. On short
        // screens the dashboard sinks further past the bottom edge to keep enough of it.
        let room = vh - 68 - (476 * sW + offset);
        if (room < MIN_COPY_ROOM) {
          offset -= MIN_COPY_ROOM - room;
          room = MIN_COPY_ROOM;
        }
        bottomOffsetRef.current = offset;
        setBottomOffsetPx(offset);
        setCopyRoom(room);

        // Scale the copy to the screen, but never past what fits with breathing room.
        const fit = (room - 44) / COPY_BLOCK_HEIGHT;
        setTopScale(Math.max(0.8, Math.min(sW, Math.max(0.92, vh / 860), fit)));
      }
      setMounted(true);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // Writes each rock's light (stage coordinates + radius) into CSS variables, in the rock's local coordinates.
  const paintRocks = (l: Point, lr: number, r: Point, rr: number) => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--lx", `${(l.x - LEFT_ROCK_BOX.left).toFixed(1)}px`);
    el.style.setProperty("--ly", `${(l.y - 400 - LEFT_ROCK_BOX.top).toFixed(1)}px`);
    el.style.setProperty("--lr", `${lr.toFixed(1)}px`);
    el.style.setProperty("--rx", `${(r.x - RIGHT_ROCK_BOX.left).toFixed(1)}px`);
    el.style.setProperty("--ry", `${(r.y - 400 - RIGHT_ROCK_BOX.top).toFixed(1)}px`);
    el.style.setProperty("--rr", `${rr.toFixed(1)}px`);
  };

  // The pointer's light: one point over both rocks, swelling on and shrinking off.
  const paint = () => {
    const p = currentPos.current;
    const on = currentOn.current;
    paintRocks(p, LEFT_RADIUS * on, p, RIGHT_RADIUS * on);
  };

  // Eases toward the target and stops the loop once it has settled.
  const startLoop = () => {
    if (rafRef.current) return;
    const tick = () => {
      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;
      const dOn = targetOn.current - currentOn.current;
      if (Math.abs(dx) > 0.08 || Math.abs(dy) > 0.08 || Math.abs(dOn) > 0.002) {
        currentPos.current.x += dx * 0.16;
        currentPos.current.y += dy * 0.16;
        currentOn.current += dOn * 0.12;
        paint();
        rafRef.current = requestAnimationFrame(tick);
      } else {
        currentOn.current = targetOn.current;
        paint();
        rafRef.current = 0;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const stopSweep = () => {
    if (sweepRaf.current) cancelAnimationFrame(sweepRaf.current);
    sweepRaf.current = 0;
  };

  // Once the copy has settled, the light crosses each rock once, each in its own random direction.
  useEffect(() => {
    if (!mounted || prefersReducedMotion()) return;
    const timer = window.setTimeout(() => {
      const left = sweepPath(LEFT_VISIBLE, LEFT_RADIUS);
      const right = sweepPath(RIGHT_VISIBLE, RIGHT_RADIUS);
      const RIGHT_LAG = 450; // the two passes overlap, not in lockstep
      const start = performance.now();
      const step = (now: number) => {
        const l = sweepAt(left, now - start);
        const r = sweepAt(right, now - start - RIGHT_LAG);
        paintRocks(
          l ?? left[left.length - 1],
          l ? LEFT_RADIUS : 0,
          r ?? right[0],
          r && now - start >= RIGHT_LAG ? RIGHT_RADIUS : 0
        );
        if (l || r || now - start < RIGHT_LAG) {
          sweepRaf.current = requestAnimationFrame(step);
        } else {
          // the glimpse is over: hand the light to the pointer, if there is one
          sweepRaf.current = 0;
          currentPos.current = { ...targetPos.current };
          currentOn.current = 0;
          paint();
          startLoop();
        }
      };
      sweepRaf.current = requestAnimationFrame(step);
    }, 700);
    return () => {
      window.clearTimeout(timer);
      stopSweep();
    };
    // paint/startLoop only touch refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  useEffect(() => {
    paint();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();

    if (modeRef.current === "desktop") {
      const s = rect.width / BASE_STAGE_WIDTH;
      const stageX = (clientX - rect.left) / s;
      const bottomStageTopPx = rect.height - 528 * s - bottomOffsetRef.current;
      const stageY = 400 + (clientY - rect.top - bottomStageTopPx) / s;
      targetPos.current = { x: stageX, y: stageY };
    } else {
      const normX = (clientX - rect.left) / Math.max(1, rect.width);
      const normY = (clientY - rect.top) / Math.max(1, rect.height);
      targetPos.current = {
        x: 920 + normX * 508,
        y: 400 + Math.max(0, (normY - 0.45) / 0.55) * 528,
      };
    }
    targetOn.current = 1;
    // the glimpse always plays out; the pointer takes the light once it has finished
    if (sweepRaf.current) return;
    // switching on from dark: light up where the pointer is, don't fly in from where it last was
    if (currentOn.current < 0.05) currentPos.current = { ...targetPos.current };
    startLoop();
  };

  // Pointer gone (or finger lifted): the light dims out where it is
  const handlePointerLeave = () => {
    targetOn.current = 0;
    if (sweepRaf.current) return; // the glimpse ends dark by itself
    startLoop();
  };

  // Entrance: each line unblurs and settles, staggered. Held back until the layout is measured.
  const reveal = (delayMs: number, durationMs: number): React.CSSProperties =>
    mounted
      ? { animation: `blurFadeIn ${durationMs}ms var(--ease-out) ${delayMs}ms both` }
      : { opacity: 0 };

  const r1 = reveal(20, 500);
  const r2 = reveal(100, 650);
  const r3 = reveal(220, 700);
  const r4 = reveal(360, 700);
  const r5 = reveal(480, 700);

  const navLinkClass =
    "text-[11px] font-medium tracking-[0.04em] uppercase text-[#121212] hover:text-black/55 transition-colors duration-200";

  return (
    <section
      onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
      onTouchMove={(e) => {
        if (e.touches[0]) {
          handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onTouchEnd={handlePointerLeave}
      onTouchCancel={handlePointerLeave}
      onMouseLeave={handlePointerLeave}
      className="relative w-full h-screen h-svh min-h-[680px] overflow-hidden select-none bg-background flex justify-center"
    >
      {/* Full-bleed side mist across the entire viewport */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(45% 52% at 6% 78%, rgba(222, 227, 231, 0.78) 0%, rgba(241, 242, 243, 0) 100%), radial-gradient(45% 52% at 94% 78%, rgba(222, 227, 231, 0.78) 0%, rgba(241, 242, 243, 0) 100%)",
        }}
      />

      {/* Stage container: 100% full width up to 1920px; capped only on ultrawide.
          Hidden until measured so phones never flash the desktop layout. */}
      <div
        ref={stageRef}
        className="relative w-full max-w-[1920px] h-full overflow-hidden flex flex-col justify-between transition-opacity duration-500"
        style={{ opacity: mounted ? 1 : 0 }}
      >
        {/* =====================================================================
            1. DESKTOP & LAPTOP VIEW (>= 1024px)
           ===================================================================== */}
        {viewportMode === "desktop" && (
          <>
            <header className="relative z-30 w-full h-[68px] px-[44px] flex items-center justify-between shrink-0">
              <Logo className="h-[26px] w-auto object-contain" />
              <nav aria-label="Primary" className="flex items-center gap-[29px] translate-x-[6px]">
                <NavLinks className={navLinkClass} />
              </nav>
              <NavCta />
            </header>

            {/* Center Hero Heading & Subtitle */}
            <div
              className="relative z-30 flex-1 flex flex-col items-center justify-center text-center"
              style={{
                paddingBottom: `${Math.round(476 * stageScale + bottomOffsetPx)}px`,
                transform: `scale(${topScale})`,
                // Scale around the middle of the space above the dashboard
                transformOrigin: `50% ${(copyRoom / 2).toFixed(1)}px`,
              }}
            >
              <div
                style={r1}
                className="text-[11px] font-medium tracking-[0.045em] text-[#7c7f82] uppercase"
              >
                {HERO.eyebrow}
              </div>

              <h1 className="mt-[8px] flex flex-col items-center">
                <span
                  style={r2}
                  className="block text-[62px] font-medium tracking-[-0.038em] leading-[1.05] text-[#c7cacd]"
                >
                  {HERO.titleMuted}
                </span>
                <span
                  style={r3}
                  className="block text-[62px] font-medium tracking-[-0.038em] leading-[1.08] text-[#090909]"
                >
                  {HERO.titleStrong}
                </span>
              </h1>

              <p
                style={r4}
                className="mt-[16px] max-w-[500px] text-[14.8px] font-normal leading-[1.46] tracking-[-0.01em] text-[#8a8e92]"
              >
                {HERO.body}
              </p>

              <HeroActions style={{ ...r5, marginTop: 20 }} />
            </div>

            {/* Unified 1428x528 Bottom Stage */}
            <div
              className="absolute left-1/2 z-20 origin-bottom"
              style={{
                bottom: `${bottomOffsetPx}px`,
                width: "1428px",
                height: "528px",
                transform: `translateX(-50%) scale(${stageScale})`,
              }}
            >
              {/* 1. Left Rock Formation (clipped at x=278px so it never bleeds behind the translucent sidebar) */}
              <div className="pointer-events-none absolute left-0 bottom-0 w-[278px] h-[528px] overflow-hidden z-10">
                <div
                  className="absolute"
                  style={{
                    left: `${LEFT_ROCK_BOX.left}px`,
                    top: `${LEFT_ROCK_BOX.top}px`,
                    width: `${LEFT_ROCK_BOX.width}px`,
                    height: `${LEFT_ROCK_BOX.height}px`,
                  }}
                >
                  <img
                    src="/rocks/rock-left-bare.webp"
                    alt=""
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  <img
                    src="/rocks/rock-left-green.webp"
                    alt=""
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-contain"
                    style={LEFT_MASK}
                  />
                </div>
              </div>

              {/* 2. Center Dashboard Preview (x: 275..1153) */}
              <div
                className="absolute bottom-0 z-20"
                style={{ left: "275px", width: "878px", height: "476px" }}
              >
                <DashboardPreview />
              </div>

              {/* 3. Right Rock Formation (its left slope overlaps the dashboard) */}
              <div
                className="pointer-events-none absolute z-30"
                style={{
                  left: `${RIGHT_ROCK_BOX.left}px`,
                  top: `${RIGHT_ROCK_BOX.top}px`,
                  width: `${RIGHT_ROCK_BOX.width}px`,
                  height: `${RIGHT_ROCK_BOX.height}px`,
                }}
              >
                <RightRock />
              </div>
            </div>

            <ScrollHint
              className="h-[92px] pb-[15px]"
              gradient="linear-gradient(to top, rgba(10, 9, 7, 0.92) 0%, rgba(18, 17, 14, 0.52) 44%, rgba(24, 23, 20, 0) 100%)"
            />
          </>
        )}

        {/* =====================================================================
            2. TABLET VIEW (768px – 1023px)
           ===================================================================== */}
        {viewportMode === "tablet" && (
          <div className="relative z-20 flex flex-col h-full">
            <header className="w-full h-[68px] px-7 flex items-center justify-between shrink-0">
              <Logo className="h-[24px] w-auto object-contain" />
              <nav aria-label="Primary" className="flex items-center gap-6">
                <NavLinks className={navLinkClass} />
              </nav>
              <NavCta />
            </header>

            <div className="flex-1 px-8 flex flex-col items-center justify-center text-center z-20">
              <div
                style={r1}
                className="text-[11.5px] font-medium tracking-[0.05em] text-[#7c7f82] uppercase"
              >
                {HERO.eyebrow}
              </div>
              <h1 className="mt-3 flex flex-col items-center">
                <span
                  style={r2}
                  className="block text-[clamp(3.2rem,6.4vw,4.1rem)] font-medium tracking-[-0.038em] leading-[1.04] text-[#c7cacd] whitespace-nowrap"
                >
                  {HERO.titleMuted}
                </span>
                <span
                  style={r3}
                  className="block text-[clamp(3.2rem,6.4vw,4.1rem)] font-medium tracking-[-0.038em] leading-[1.07] text-[#090909] whitespace-nowrap"
                >
                  {HERO.titleStrong}
                </span>
              </h1>
              <p
                style={r4}
                className="mt-5 max-w-[500px] text-[15.5px] font-normal leading-[1.48] tracking-[-0.01em] text-[#8a8e92]"
              >
                {HERO.body}
              </p>
              <HeroActions style={r5} />
            </div>

            {/* Tablet Bottom Stage: Dashboard + Right Rock */}
            <div className="relative w-full h-[430px] shrink-0 overflow-hidden">
              <div
                className="absolute bottom-0 left-7 z-20 origin-bottom-left"
                style={{ width: "878px", height: "476px", transform: "scale(0.82)" }}
              >
                <DashboardPreview />
              </div>

              <div
                className="pointer-events-none absolute -right-[420px] -bottom-[220px] z-30 origin-bottom-right"
                style={{
                  width: `${RIGHT_ROCK_BOX.width}px`,
                  height: `${RIGHT_ROCK_BOX.height}px`,
                  transform: "scale(0.78)",
                }}
              >
                <RightRock />
              </div>

              <ScrollHint
                className="h-[80px] pb-4"
                gradient="linear-gradient(to top, rgba(10, 9, 7, 0.92) 0%, rgba(18, 17, 14, 0.5) 45%, rgba(24, 23, 20, 0) 100%)"
              />
            </div>
          </div>
        )}

        {/* =====================================================================
            3. MOBILE VIEW (< 768px)
           ===================================================================== */}
        {viewportMode === "mobile" && (
          <div className="relative z-20 flex flex-col h-full">
            <header className="relative w-full h-[64px] px-5 flex items-center justify-between shrink-0 z-50">
              <Logo className="h-[22px] w-auto object-contain" />

              <div className="flex items-center gap-2.5 shrink-0">
                <NavCta compact />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                  aria-expanded={mobileMenuOpen}
                  className="w-[34px] h-[34px] rounded-full border border-black/10 bg-white/90 flex items-center justify-center text-[#121212] cursor-pointer active:scale-95 transition-transform duration-150"
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path
                      d={mobileMenuOpen ? "M4 4L12 12M12 4L4 12" : "M2.5 5.5H13.5M2.5 10.5H13.5"}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Dropdown overlays the hero without moving the text */}
              {mobileMenuOpen && (
                <nav
                  aria-label="Primary"
                  className="absolute top-[64px] left-5 right-5 p-4 rounded-2xl bg-card border border-black/8 shadow-[0_16px_40px_rgba(0,0,0,0.12)] flex flex-col gap-3 z-50 animate-[stepIn_0.25s_var(--ease-out)]"
                >
                  <NavLinks
                    onNavigate={() => setMobileMenuOpen(false)}
                    className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#121212] py-1"
                  />
                </nav>
              )}
            </header>

            <div className="flex-1 px-4 flex flex-col items-center justify-center text-center z-20">
              <div
                style={r1}
                className="text-[11px] font-medium tracking-[0.055em] text-[#7c7f82] uppercase"
              >
                {HERO.eyebrow}
              </div>
              <h1 className="mt-2.5 flex flex-col items-center">
                <span
                  style={r2}
                  className="block text-[clamp(2.1rem,8.6vw,3.2rem)] font-medium tracking-[-0.038em] leading-[1.04] text-[#c7cacd]"
                >
                  {HERO.titleMuted}
                </span>
                <span
                  style={r3}
                  className="block text-[clamp(2.1rem,8.6vw,3.2rem)] font-medium tracking-[-0.038em] leading-[1.06] text-[#090909]"
                >
                  {HERO.titleStrong}
                </span>
              </h1>
              <p
                style={r4}
                className="mt-4 max-w-[345px] text-[14px] sm:text-[15px] font-normal leading-[1.5] tracking-[-0.01em] text-[#7c8085]"
              >
                {HERO.body}
              </p>
              <HeroActions style={{ ...r5, marginTop: 20 }} />
            </div>

            {/* Mobile Bottom Stage: Dashboard peeking from behind the Right Rock */}
            <div className="relative w-full h-[300px] sm:h-[380px] shrink-0 overflow-hidden">
              <div
                className="absolute bottom-0 left-3.5 sm:left-6 z-20 origin-bottom-left"
                style={{
                  width: "878px",
                  height: "476px",
                  transform: `scale(${mobileDashScale})`,
                }}
              >
                <DashboardPreview />
              </div>

              <div
                className="pointer-events-none absolute -right-[330px] -bottom-[175px] z-30 origin-bottom-right"
                style={{
                  width: `${RIGHT_ROCK_BOX.width}px`,
                  height: `${RIGHT_ROCK_BOX.height}px`,
                  transform: `scale(${Math.min(0.56, mobileDashScale * 0.82)})`,
                }}
              >
                <RightRock />
              </div>

              <ScrollHint
                className="h-[72px] pb-3.5"
                gradient="linear-gradient(to top, rgba(10, 9, 7, 0.94) 0%, rgba(18, 17, 14, 0.58) 48%, rgba(24, 23, 20, 0) 100%)"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
