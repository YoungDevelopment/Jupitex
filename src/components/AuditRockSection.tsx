"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import SectionWrapper from "@/components/SectionWrapper";
import { type Box, prefersReducedMotion, sweepAt, sweepPath } from "@/lib/flashlight";
import { artSrcSet } from "@/lib/images";

const LOGO_ORANGE = "#FF731E";

export interface TestimonialItem {
  id: number;
  quote: string;
  name: string;
  role: string;
  company: string;
  metric: string;
  initials: string;
}

// Only real clients. Confirm each person has approved their name and quote before this goes live.
export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    quote:
      "Orders used to slip through the cracks. Since Jupitex built our internal tool, every order is tracked from start to finish and we haven't missed a single one. It's what let us scale the business.",
    name: "Irfan",
    // TODO: confirm Irfan's surname and job title before this goes live
    role: "VP of Manufacturing",
    company: "Label Works",
    metric: "Zero Missed Orders",
    initials: "IR",
  },
  {
    id: 2,
    quote:
      "Our team used to spend whole days reading SMS and email replies by hand. Since Jupitex set up AI QA for both, that review takes hours, not days.",
    name: "Mark Fisher",
    role: "Head of Compliance",
    company: "Compliance Ops",
    metric: "Days → Hours",
    initials: "MF",
  },
  {
    id: 3,
    quote:
      "Within three weeks of launching our new site and automated lead-gen workflows, we closed $5,000 in new pipeline automatically.",
    name: "Hina Patel",
    role: "Managing Partner",
    company: "MaxHP LLC",
    metric: "+$5k New Pipeline",
    initials: "HP",
  },
];

/**
 * The rock art is a 2400x1792 canvas; the box it sits in is the old 1024:1033 rock's footprint.
 * These offsets line the new canvas up with where the old rock was drawn.
 */
const ROCK_CANVAS: React.CSSProperties = { left: "-17.05%", top: "0%", width: "134.1%" };
// 134.1% of the rock column (340 / 440 / 540 / 600px)
const AUDIT_ROCK_SIZES = "(min-width: 1280px) 805px, (min-width: 1024px) 725px, (min-width: 640px) 590px, 456px";

/** Flashlight over the moss, like the hero's rocks: centre and radius come from CSS variables (radius 0 = off). */
const AUDIT_MASK: React.CSSProperties = (() => {
  const g =
    "radial-gradient(circle var(--ar, 0px) at var(--ax, 50%) var(--ay, 30%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 42%, rgba(0,0,0,0.4) 72%, rgba(0,0,0,0) 100%)";
  return { maskImage: g, WebkitMaskImage: g };
})();

/** Light radius, as a fraction of the rock canvas width. */
const AUDIT_RADIUS = 0.26;

/** Where the rock sits on its 2400x1792 canvas (fractions): the sweep crosses this. */
const AUDIT_ROCK_AREA: Box = { x0: 0.13, y0: 0.02, x1: 0.86, y1: 0.75 };

const CARD_COUNT = TESTIMONIALS.length;
const CARD_GAP = 16; // the least clear space between two visible cards

/** Wraps an angle into [-period/2, period/2): the dial's "circle" can be longer than 360°. */
function normalizeAngle(deg: number, period: number): number {
  const half = period / 2;
  return ((((deg + half) % period) + period) % period) - half;
}

/** How a card shrinks as it travels away from the top of the arc. */
function arcScale(absAngle: number) {
  return Math.max(0.9, 1.02 - (absAngle / 180) * 0.14);
}

/**
 * The smallest spacing (in degrees) at which no two visible cards touch anywhere on the arc.
 * Near the top the cards sit side by side; toward the sides they stack, so the spacing has to
 * hold both ways. The dial's loop is then CARD_COUNT × step long, longer than 360° if needed.
 */
function pickAngleStep(rx: number, ry: number, w: number, h: number, visibleTo: number) {
  const place = (deg: number) => {
    const r = (deg * Math.PI) / 180;
    const s = arcScale(Math.abs(deg));
    // cards scale from their centre; their top-left sits on the arc
    return { cx: rx * Math.sin(r), cy: ry * (1 - Math.cos(r)) + h / 2, w: w * s, h: h * s };
  };
  for (let step = 36; step <= 90; step++) {
    let clear = true;
    for (let a = -visibleTo; a + step <= visibleTo && clear; a += 1) {
      const p = place(a);
      const q = place(a + step);
      const overlapX = Math.abs(p.cx - q.cx) < (p.w + q.w) / 2 + CARD_GAP;
      const overlapY = Math.abs(p.cy - q.cy) < (p.h + q.h) / 2 + CARD_GAP;
      if (overlapX && overlapY) clear = false;
    }
    if (clear) return step;
  }
  return 90;
}

/**
 * Stretch the spacing so a card starts fading in on the left (at -fadeEnd) at the very moment
 * the card on the right starts fading out (at +fadeStart): the arc between them holds a whole
 * number of steps, never tighter than the no-overlap minimum.
 */
function syncedStep(minStep: number, fadeStart: number, fadeEnd: number) {
  const span = fadeStart + fadeEnd;
  const gaps = Math.max(1, Math.floor(span / minStep));
  return span / gaps;
}

export default function AuditRockSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const rockRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [stageScale, setStageScale] = useState(1);
  const [stageOffsetY, setStageOffsetY] = useState(0);
  const [dialConfig, setDialConfig] = useState({
    radiusX: 540,
    radiusY: 390,
    cardWidth: 252,
    fadeStartAngle: 74,
    fadeEndAngle: 96,
    angleStep: 45,
  });

  // The dial turns every frame, so its angle and the card placement live outside React state:
  // re-rendering this whole section 60 times a second is what made it heavy.
  const angleRef = useRef(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const configRef = useRef(dialConfig);
  const hoveredRef = useRef<number | null>(null);
  const onScreenRef = useRef(false);

  /** Writes each card's place on the arc straight to the DOM. */
  const placeCards = useCallback(() => {
    const cfg = configRef.current;
    const period = cfg.angleStep * CARD_COUNT;
    for (let index = 0; index < CARD_COUNT; index++) {
      const el = cardRefs.current[index];
      if (!el) continue;
      const angle = normalizeAngle(index * cfg.angleStep + angleRef.current, period); // [-period/2, period/2)
      const absAngle = Math.abs(angle);
      const rad = (angle * Math.PI) / 180;

      // Circular dial coordinates relative to top peak center
      const x = cfg.radiusX * Math.sin(rad);
      const y = cfg.radiusY * (1 - Math.cos(rad));

      // Cards within the active arc window are visible; cards cycling underneath fade out smoothly
      let cardOpacity = 0;
      if (absAngle <= cfg.fadeStartAngle) {
        cardOpacity = 1;
      } else if (absAngle <= cfg.fadeEndAngle) {
        cardOpacity = Math.max(
          0,
          1 - (absAngle - cfg.fadeStartAngle) / Math.max(1, cfg.fadeEndAngle - cfg.fadeStartAngle)
        );
      }

      const isHovered = hoveredRef.current === TESTIMONIALS[index].id;
      const scale = isHovered ? 1.05 : arcScale(absAngle);
      const zIndex = isHovered ? 50 : Math.max(1, Math.round(35 - absAngle / 5));

      el.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      el.style.opacity = cardOpacity.toFixed(3);
      el.style.zIndex = String(zIndex);
      el.style.pointerEvents = cardOpacity > 0.15 ? "auto" : "none";
    }
  }, []);

  // Re-place after every render that changes the arc or the hovered card
  useLayoutEffect(() => {
    configRef.current = dialConfig;
    hoveredRef.current = hoveredCard;
    placeCards();
  }, [dialConfig, hoveredCard, placeCards]);

  // Responsive arc radius & 100vh height adaptation so the rotary dial frames the mountain on all displays
  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      let radiusX = 540;
      let radiusY = 390;
      let cardWidth = 252;
      let fadeStartAngle = 74;
      let fadeEndAngle = 96;
      let rockTop = 305;
      let rockWidth = 600;
      let minComfortHeight = 520;

      if (w >= 1280) {
        radiusX = 540;
        radiusY = 390;
        cardWidth = 252;
        fadeStartAngle = 74;
        fadeEndAngle = 96;
        rockTop = 305;
        rockWidth = 600;
        minComfortHeight = 520;
      } else if (w >= 1024) {
        radiusX = 392;
        radiusY = 310;
        cardWidth = 206;
        fadeStartAngle = 73;
        fadeEndAngle = 92;
        rockTop = 295;
        rockWidth = 540;
        minComfortHeight = 480;
      } else if (w >= 640) {
        radiusX = 365;
        radiusY = 260;
        cardWidth = 204;
        fadeStartAngle = 38;
        fadeEndAngle = 58;
        rockTop = 275;
        rockWidth = 440;
        minComfortHeight = 450;
      } else {
        radiusX = 410;
        radiusY = 240;
        cardWidth = 228;
        fadeStartAngle = 16;
        fadeEndAngle = 42;
        rockTop = 250;
        rockWidth = 340;
        minComfortHeight = 420;
      }

      // Measure the real cards (their height depends on the copy), fall back to their min-height
      const cards = document.querySelectorAll<HTMLElement>("[data-testimonial-card]");
      let cardHeight = w >= 1280 ? 228 : 215;
      cards.forEach((c) => (cardHeight = Math.max(cardHeight, c.offsetHeight)));
      // a card is still noticeably visible until most of the way through its fade
      const visibleTo = fadeStartAngle + (fadeEndAngle - fadeStartAngle) * 0.7;

      setDialConfig({
        radiusX,
        radiusY,
        cardWidth,
        fadeStartAngle,
        fadeEndAngle,
        angleStep: syncedStep(
          pickAngleStep(radiusX, radiusY, cardWidth, cardHeight, visibleTo),
          fadeStartAngle,
          fadeEndAngle
        ),
      });

      const sectionPaddingTop = w >= 1024 ? 96 : w >= 640 ? 80 : 64;
      const fallbackStageOffsetTop = w >= 1024 ? 252 : w >= 640 ? 228 : 235;
      const measuredOffsetTop = stageRef.current?.offsetTop;
      const stageTop =
        sectionPaddingTop +
        (measuredOffsetTop && measuredOffsetTop > 0
          ? measuredOffsetTop
          : fallbackStageOffsetTop);

      const availableStageHeight = Math.max(300, h - stageTop);
      const rockHeight = rockWidth * (1033 / 1024);
      const naturalStageBottom = rockTop + rockHeight - 24;

      let nextScale = 1;
      if (availableStageHeight < minComfortHeight) {
        nextScale = Math.max(0.65, availableStageHeight / minComfortHeight);
      } else if (availableStageHeight > naturalStageBottom && w >= 1024) {
        const arcSpan = radiusX * 2 + cardWidth;
        const maxHorizScale = Math.max(1, (w - 80) / arcSpan);
        const desiredScale = availableStageHeight / naturalStageBottom;
        nextScale = Math.min(maxHorizScale, desiredScale, 1.35);
      }

      const nextOffsetY = Math.max(
        0,
        Math.round(availableStageHeight - naturalStageBottom * nextScale)
      );

      setStageScale(nextScale);
      setStageOffsetY(nextOffsetY);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Viewport intersection observer for entrance animation (synced with SectionWrapper)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.01, rootMargin: "360px 0px -40px 0px" }
    );

    if (stageRef.current) {
      observer.observe(stageRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Flashlight on the rock: dark until the pointer is over the stage; one sweep across the
  // rock the first time it is on screen. Lives in refs and CSS variables, never re-renders React.
  useEffect(() => {
    const stage = stageRef.current;
    const rock = rockRef.current;
    if (!stage || !rock) return;

    // positions are fractions of the rock canvas (0..1), so they survive resizes and scaling
    const target = { x: 0.5, y: 0.3, on: 0 };
    const cur = { x: 0.5, y: 0.3, on: 0 };
    let raf = 0;
    let sweepRaf = 0;

    const paintAt = (x: number, y: number, on: number) => {
      const w = rock.offsetWidth;
      const h = rock.offsetHeight;
      rock.style.setProperty("--ax", `${(x * w).toFixed(1)}px`);
      rock.style.setProperty("--ay", `${(y * h).toFixed(1)}px`);
      rock.style.setProperty("--ar", `${(w * AUDIT_RADIUS * on).toFixed(1)}px`);
    };
    const paint = () => paintAt(cur.x, cur.y, cur.on);

    const tick = () => {
      const dx = target.x - cur.x;
      const dy = target.y - cur.y;
      const dOn = target.on - cur.on;
      if (Math.abs(dx) > 0.0002 || Math.abs(dy) > 0.0002 || Math.abs(dOn) > 0.002) {
        cur.x += dx * 0.16;
        cur.y += dy * 0.16;
        cur.on += dOn * 0.12;
        paint();
        raf = requestAnimationFrame(tick);
      } else {
        cur.on = target.on;
        paint();
        raf = 0;
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const stopSweep = () => {
      if (sweepRaf) cancelAnimationFrame(sweepRaf);
      sweepRaf = 0;
    };

    const onMove = (e: PointerEvent) => {
      // the stage is scaled, so measure on screen and work in fractions of the canvas
      const r = rock.getBoundingClientRect();
      target.x = (e.clientX - r.left) / Math.max(1, r.width);
      target.y = (e.clientY - r.top) / Math.max(1, r.height);
      target.on = 1;
      // the glimpse always plays out; the pointer takes the light once it has finished
      if (sweepRaf) return;
      // switching on from dark: light up where the pointer is, don't fly in from where it last was
      if (cur.on < 0.05) {
        cur.x = target.x;
        cur.y = target.y;
      }
      kick();
    };
    const onLeave = () => {
      target.on = 0;
      if (sweepRaf) return; // the glimpse ends dark by itself
      kick();
    };

    // The glimpse: once the rock is well into view, the light crosses it in a random direction
    let sweepTimer = 0;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        seen.disconnect();
        if (prefersReducedMotion()) return;
        sweepTimer = window.setTimeout(() => {
          // the rock's own area on the canvas (radius is a fraction of the canvas width;
          // in canvas fractions it is AUDIT_RADIUS across, and AUDIT_RADIUS * 2400/1792 down)
          const path = sweepPath(AUDIT_ROCK_AREA, AUDIT_RADIUS * 1.34);
          const start = performance.now();
          const step = (now: number) => {
            const p = sweepAt(path, now - start);
            if (p) {
              paintAt(p.x, p.y, 1);
              sweepRaf = requestAnimationFrame(step);
            } else {
              // the glimpse is over: dark again, or straight to the pointer if it is on the stage
              sweepRaf = 0;
              cur.x = target.x;
              cur.y = target.y;
              cur.on = 0;
              paint();
              kick();
            }
          };
          sweepRaf = requestAnimationFrame(step);
        }, 450);
      },
      { threshold: 0.45 }
    );
    seen.observe(rock);

    paint();
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("pointercancel", onLeave);
    window.addEventListener("resize", paint);

    return () => {
      seen.disconnect();
      window.clearTimeout(sweepTimer);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("pointercancel", onLeave);
      window.removeEventListener("resize", paint);
      stopSweep();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Continuous circular rotation loop: runs only while the stage is on screen
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let rafId = 0;
    let lastTime = 0;
    let currentSpeed = 5.5; // degrees per second
    const targetBaseSpeed = 5.5;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Off screen: stop entirely; the observer restarts it
      if (!onScreenRef.current) {
        rafId = 0;
        return;
      }

      const targetSpeed = hoveredRef.current !== null ? 0 : targetBaseSpeed;
      currentSpeed += (targetSpeed - currentSpeed) * Math.min(1, dt * 6);

      if (Math.abs(currentSpeed) > 0.01) {
        // unbounded; normalizeAngle wraps it to the dial's own loop length
        angleRef.current += currentSpeed * dt;
        placeCards();
      }

      rafId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreenRef.current = entry.isIntersecting;
      if (entry.isIntersecting && !rafId) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [placeCards]);

  return (
    <SectionWrapper
      id="testimonials"
      ariaLabel="Client Testimonials"
      subject="CLIENT TESTIMONIALS"
      className="h-screen min-h-screen max-h-screen !pb-0"
      containerClassName="h-full"
      contentClassName="flex-1 flex flex-col items-center !mt-4"
      title={
        <>
          <span className="text-[#8e9296]">What our clients say about</span>
          <span className="inline-flex items-center px-3.5 sm:px-4 py-1.5 rounded-[16px] bg-white border border-black/[0.06] shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
            <Image
              src="/JupitexLogos/nav_logo_light.png"
              alt="Jupitex"
              width={125}
              height={35}
              className="h-[22px] sm:h-[27px] lg:h-[30px] w-auto object-contain"
            />
          </span>
        </>
      }
      description={
        <>
          What our clients say about the work we{" "}
          <span className="text-[#090909] font-medium">
            automated for them
          </span>
          , in their own words.
        </>
      }
    >
      {/* =====================================================================
          UNIFIED STAGE: ROTATING ARC CARDS (STRAIGHT) & MOUNTAIN IN BETWEEN
         ===================================================================== */}
      <div
        ref={stageRef}
        className="relative w-full flex-1 min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] mt-6 sm:mt-8 xl:mt-9 origin-top"
        style={{
          transform:
            stageScale !== 1 || stageOffsetY !== 0
              ? `translate3d(0, ${stageOffsetY}px, 0) scale(${stageScale.toFixed(3)})`
              : undefined,
        }}
      >
        {/* THE MOUNTAIN / ROCK IN BETWEEN */}
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[250px] sm:top-[275px] lg:top-[295px] xl:top-[305px] z-10 w-[340px] sm:w-[440px] lg:w-[540px] xl:w-[600px] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible
              ? "translate3d(0, 0px, 0)"
              : "translate3d(0, 140px, 0)",
            transitionDelay: "100ms",
          }}
        >
          {/* Keeps the old rock's footprint (1024:1033), so the layout maths above is unchanged */}
          <div className="relative w-full aspect-[1024/1033]">
            {/* The 2400x1792 art, placed so the rock lands exactly where the old one sat */}
            <div
              ref={rockRef}
              className="absolute aspect-[2400/1792]"
              style={ROCK_CANVAS}
            >
              <img
                src="/rocks/audit-bare.webp"
                srcSet={artSrcSet("/rocks/audit-bare")}
                sizes={AUDIT_ROCK_SIZES}
                loading="lazy"
                decoding="async"
                alt="Jupitex Foundation Rock"
                draggable={false}
                className="absolute inset-0 w-full h-full select-none"
              />
              <img
                src="/rocks/audit-green.webp"
                srcSet={artSrcSet("/rocks/audit-green")}
                sizes={AUDIT_ROCK_SIZES}
                loading="lazy"
                decoding="async"
                alt=""
                aria-hidden
                draggable={false}
                className="absolute inset-0 w-full h-full select-none"
                style={AUDIT_MASK}
              />
            </div>
          </div>
        </div>

        {/* 10 ROTATING TESTIMONIAL CARDS ON THE CIRCULAR ARC (STRAIGHT, NO TILT) */}
        <div
          className="relative z-20 w-full h-full transition-opacity duration-700"
          style={{ opacity: isVisible ? 1 : 0 }}
        >
          {TESTIMONIALS.map((item, index) => {
            const isHovered = hoveredCard === item.id;

            // transform, opacity, z-index and pointer-events are written by placeCards()
            return (
              <div
                key={item.id}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                data-testimonial-card={item.id}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  width: `${dialConfig.cardWidth}px`,
                  left: "50%",
                  top: "0px",
                }}
                className="
                  absolute min-h-[215px] xl:min-h-[228px] rounded-[20px] bg-card
                  border border-black/[0.06] hover:border-[#FF731E]/50
                  p-4 sm:p-5 flex flex-col justify-between gap-3
                  shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_42px_rgba(0,0,0,0.11)]
                  transition-[border-color,box-shadow] duration-300 will-change-transform
                "
              >
                {/* Top Row: Stars & Outcome Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="flex items-center gap-0.5 text-[12px]"
                      style={{ color: LOGO_ORANGE }}
                      aria-label="5 out of 5 stars"
                    >
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                    </div>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold tracking-[-0.01em] shrink-0"
                      style={{
                        backgroundColor: isHovered
                          ? LOGO_ORANGE
                          : "rgba(255, 115, 30, 0.09)",
                        color: isHovered ? "#ffffff" : LOGO_ORANGE,
                      }}
                    >
                      {item.metric}
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="mt-2.5 text-[12.5px] xl:text-[13px] leading-[1.52] text-[#2c3035] line-clamp-4">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Author Footer */}
                <div className="pt-2.5 border-t border-black/[0.06] flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors duration-300"
                    style={{
                      backgroundColor: isHovered
                        ? LOGO_ORANGE
                        : "rgba(10, 10, 10, 0.07)",
                      color: isHovered ? "#ffffff" : "#0a0a0a",
                    }}
                  >
                    {item.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold tracking-[-0.015em] text-[#090909] truncate">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-[#686c70] truncate">
                      {item.role} · {item.company}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
