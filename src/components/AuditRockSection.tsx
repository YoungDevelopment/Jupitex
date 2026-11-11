"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SectionWrapper from "@/components/SectionWrapper";

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

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    quote:
      "Their AI audit gave us a clear roadmap in week one. We automated compliance checks and cut manual review time by 70%.",
    name: "Ayesha Khan",
    role: "Head of Operations",
    company: "NexaLedger",
    metric: "70% Faster QA",
    initials: "AK",
  },
  {
    id: 2,
    quote:
      "We hired Jupitex to fix our order bottleneck. Their custom internal tool saved 25 hours a week and helped us scale to 2 new factories.",
    name: "Marcus Lee",
    role: "VP of Manufacturing",
    company: "Label Works",
    metric: "25 hrs/wk Saved",
    initials: "ML",
  },
  {
    id: 3,
    quote:
      "Instead of generic chatbots, they built automations that plugged straight into our existing CRM with zero downtime for our team.",
    name: "Nadia Fernandes",
    role: "VP of Product",
    company: "OrbitDesk",
    metric: "4.8x First-Year ROI",
    initials: "NF",
  },
  {
    id: 4,
    quote:
      "Automated QA for our SMS and email workflows eliminated manual compliance bottlenecks and saves us $7,500 every single month.",
    name: "Omar Siddiqui",
    role: "Managing Director",
    company: "Compliance Ops",
    metric: "$7,500/mo Saved",
    initials: "OS",
  },
  {
    id: 5,
    quote:
      "We saw the exact numbers before spending a dollar. Every workflow was scoped, flow-charted, and delivered on a fixed quote.",
    name: "Priya Menon",
    role: "Director of CX",
    company: "BrightCart",
    metric: "38% Fewer Tickets",
    initials: "PM",
  },
  {
    id: 6,
    quote:
      "Jupitex didn't just build the system and vanish — they trained our whole staff so we own and run every automation internally.",
    name: "Daniel Ross",
    role: "Chief Operating Officer",
    company: "RoutePilot",
    metric: "100% Team Adoption",
    initials: "DR",
  },
  {
    id: 7,
    quote:
      "Within three weeks of launching our new site and automated lead-gen workflows, we closed $5,000 in new pipeline automatically.",
    name: "Hina Patel",
    role: "Managing Partner",
    company: "MaxHP LLC",
    metric: "+$5k New Pipeline",
    initials: "HP",
  },
  {
    id: 8,
    quote:
      "We needed vetted AI engineers fast. Jupitex placed two senior specialists on our team who shipped production code from day one.",
    name: "Ryan Cooper",
    role: "VP of Engineering",
    company: "SentraPay",
    metric: "48hr Onboarding",
    initials: "RC",
  },
  {
    id: 9,
    quote:
      "Weekly executive reporting used to take our analysts 14 hours. Now it runs in 10 minutes with higher accuracy and zero manual copy-paste.",
    name: "Sara Ahmed",
    role: "Head of Analytics",
    company: "MetricLoop",
    metric: "14 hrs → 10 mins",
    initials: "SA",
  },
  {
    id: 10,
    quote:
      "If you want AI that actually ships and delivers measurable ROI instead of staying stuck in pilot mode, Jupitex is the team to call.",
    name: "Victor Chen",
    role: "Founder & CEO",
    company: "SignalForge",
    metric: "+$64k/yr Saved",
    initials: "VC",
  },
];

const CARD_COUNT = TESTIMONIALS.length; // 10 cards
const ANGLE_STEP = 360 / CARD_COUNT; // 36 degrees between cards

function normalizeAngle(deg: number): number {
  return ((((deg + 180) % 360) + 360) % 360) - 180;
}

export default function AuditRockSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [dialAngle, setDialAngle] = useState(0);
  const [stageScale, setStageScale] = useState(1);
  const [stageOffsetY, setStageOffsetY] = useState(0);
  const [dialConfig, setDialConfig] = useState({
    radiusX: 540,
    radiusY: 390,
    cardWidth: 252,
    fadeStartAngle: 74,
    fadeEndAngle: 96,
  });

  const hoveredRef = useRef<number | null>(null);
  const onScreenRef = useRef(false);
  useEffect(() => {
    hoveredRef.current = hoveredCard;
  }, [hoveredCard]);

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

      setDialConfig({
        radiusX,
        radiusY,
        cardWidth,
        fadeStartAngle,
        fadeEndAngle,
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

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      onScreenRef.current = entry.isIntersecting;
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Continuous circular rotation loop
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();
    let currentSpeed = 5.5; // degrees per second
    const targetBaseSpeed = 5.5;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Don't spin (or re-render) while the section is off screen
      if (!onScreenRef.current) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const targetSpeed = hoveredRef.current !== null ? 0 : targetBaseSpeed;
      currentSpeed += (targetSpeed - currentSpeed) * Math.min(1, dt * 6);

      if (Math.abs(currentSpeed) > 0.01) {
        setDialAngle((prev) => (prev + currentSpeed * dt) % 360);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const stepDial = (direction: -1 | 1) => {
    setDialAngle((prev) => (prev + direction * ANGLE_STEP) % 360);
  };

  return (
    <SectionWrapper
      id="testimonials"
      ariaLabel="Client Testimonials"
      subject="CLIENT TESTIMONIALS"
      className="h-screen min-h-screen max-h-screen !pb-0"
      containerClassName="h-full"
      contentClassName="flex-1 flex flex-col items-center !mt-4"
      background={
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 0%, rgba(255, 255, 255, 0.7) 0%, rgba(241, 242, 243, 0) 100%), radial-gradient(42% 48% at 92% 78%, rgba(255, 115, 30, 0.04) 0%, rgba(241, 242, 243, 0) 100%)",
          }}
        />
      }
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
          Real outcomes from teams that partnered with us to{" "}
          <span className="text-[#090909] font-medium">
            automate operations and put AI to work
          </span>{" "}
          — delivered with measurable ROI.
        </>
      }
    >
      {/* Subtle Dial Controls */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          aria-label="Rotate testimonials counter-clockwise"
          onClick={() => stepDial(-1)}
          className="w-8 h-8 rounded-full bg-white border border-black/[0.08] hover:border-[#FF731E]/50 flex items-center justify-center text-[#0a0a0a] text-xs shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          ←
        </button>
        <span className="text-[12.5px] font-medium tracking-[-0.01em] text-[#55585c]">
          <span className="[@media(hover:none)]:hidden">Hover any card to pause</span>
          <span className="[@media(hover:hover)]:hidden">Use the arrows to browse</span>
        </span>
        <button
          type="button"
          aria-label="Rotate testimonials clockwise"
          onClick={() => stepDial(1)}
          className="w-8 h-8 rounded-full bg-white border border-black/[0.08] hover:border-[#FF731E]/50 flex items-center justify-center text-[#0a0a0a] text-xs shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          →
        </button>
      </div>

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
          <Image
            src="/Audit-bare.png"
            alt="Jupitex Foundation Rock"
            width={1024}
            height={1033}
            className="w-full h-auto object-contain select-none"
            sizes="(max-width: 640px) 340px, (max-width: 1024px) 440px, 600px"
          />
        </div>

        {/* 10 ROTATING TESTIMONIAL CARDS ON THE CIRCULAR ARC (STRAIGHT, NO TILT) */}
        <div
          className="relative z-20 w-full h-full transition-opacity duration-700"
          style={{ opacity: isVisible ? 1 : 0 }}
        >
          {TESTIMONIALS.map((item, index) => {
            const rawAngle = index * ANGLE_STEP + dialAngle;
            const angle = normalizeAngle(rawAngle); // [-180, 180]
            const absAngle = Math.abs(angle);
            const rad = (angle * Math.PI) / 180;

            // Circular dial coordinates relative to top peak center
            const x = dialConfig.radiusX * Math.sin(rad);
            const y = dialConfig.radiusY * (1 - Math.cos(rad));

            // Cards within the active arc window are visible; cards cycling underneath fade out smoothly
            let cardOpacity = 0;
            if (absAngle <= dialConfig.fadeStartAngle) {
              cardOpacity = 1;
            } else if (absAngle <= dialConfig.fadeEndAngle) {
              cardOpacity = Math.max(
                0,
                1 -
                  (absAngle - dialConfig.fadeStartAngle) /
                    Math.max(1, dialConfig.fadeEndAngle - dialConfig.fadeStartAngle)
              );
            }

            const isHovered = hoveredCard === item.id;
            const scale = isHovered
              ? 1.05
              : Math.max(0.9, 1.02 - (absAngle / 180) * 0.14);
            const zIndex = isHovered
              ? 50
              : Math.max(1, Math.round(35 - absAngle / 5));

            return (
              <div
                key={item.id}
                data-testimonial-card={item.id}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  width: `${dialConfig.cardWidth}px`,
                  left: "50%",
                  top: "0px",
                  transform: `translate3d(calc(-50% + ${x.toFixed(1)}px), ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
                  opacity: cardOpacity,
                  zIndex,
                  pointerEvents: cardOpacity > 0.15 ? "auto" : "none",
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
