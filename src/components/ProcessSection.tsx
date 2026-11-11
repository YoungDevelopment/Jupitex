"use client";

import { useEffect, useState } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import { useInView, usePrefersReducedMotion } from "@/lib/hooks";
import { ACCENT, scrollToId } from "@/lib/site";

/**
 * How an engagement runs, drawn as a route up the rock from the hero.
 * The rock starts bare; moss spreads up it as each phase is reached, so the
 * finished state (a living, working system) is the picture you are left with.
 */

const PHASES = [
  {
    name: "Audit",
    text: "We map how your agency runs and price every automation before you commit to anything.",
    outcome: "Roadmap, fixed quote, projected ROI",
  },
  {
    name: "Build",
    text: "We build inside the tools you already use, one workflow at a time, starting with the one that pays back first.",
    outcome: "A working pilot in weeks, not months",
  },
  {
    name: "Train",
    text: "Your people learn to run it, adjust it and question it. Sign-offs stay where your compliance team wants them.",
    outcome: "Your team running it day to day",
  },
  {
    name: "Hand over",
    text: "We watch how it is used and refine it until it runs smoothly without us. Then it is yours.",
    outcome: "No dependency on Jupitex",
  },
];

// Waypoints on the rock, as percentages of the image box (4:3)
const WAYPOINTS = [
  { x: 22, y: 80 },
  { x: 47, y: 66 },
  { x: 36, y: 42 },
  { x: 51, y: 13 },
];

// The route through the waypoints, in a 100 x 75 viewBox, and how far along it each one sits
const ROUTE = "M22 60 C32 58 45 56 47 49.5 S33 39 36 31.5 S47 17 51 9.75";
const ROUTE_AT = [0, 0.37, 0.67, 1];

// How far the moss has spread at each phase (radius, as a share of the rock's width)
const MOSS = ["34cqw", "62cqw", "94cqw", "160cqw"];

export default function ProcessSection() {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const [viewRef, inView] = useInView<HTMLDivElement>(true);
  const reduce = usePrefersReducedMotion();
  const phase = reduce && !touched ? PHASES.length - 1 : active;

  // First time on screen: climb the route once, then leave it to the visitor.
  useEffect(() => {
    if (!inView || touched || reduce || active >= PHASES.length - 1) return;
    const t = window.setTimeout(() => setActive((a) => a + 1), active === 0 ? 1100 : 1500);
    return () => window.clearTimeout(t);
  }, [inView, touched, reduce, active]);

  const pick = (i: number) => {
    setTouched(true);
    setActive(i);
  };

  return (
    <SectionWrapper
      id="process"
      ariaLabel="How we work"
      subject="HOW WE WORK"
      title={
        <>
          <span className="text-[#8e9296]">From first call to</span>
          <span>a team that owns it</span>
        </>
      }
      description="Four phases, each with something you can hold at the end of it. You can stop after any of them."
      className="!min-h-0 !pb-0"
    >
      <div
        ref={viewRef}
        className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-2 items-end text-left"
      >
        {/* Phases */}
        <ol className="lg:col-span-5 flex flex-col gap-2 pb-6 lg:pb-20">
          {PHASES.map((p, i) => {
            const isActive = i === phase;
            const reached = i <= phase;
            return (
              <li key={p.name}>
                <button
                  type="button"
                  aria-expanded={isActive}
                  onClick={() => pick(i)}
                  onMouseEnter={() => pick(i)}
                  onFocus={() => pick(i)}
                  className={`group w-full text-left rounded-[16px] border px-4 py-3.5 lg:px-5 lg:py-4 cursor-pointer transition-[background-color,border-color,box-shadow] duration-200 ${
                    isActive
                      ? "bg-card border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
                      : "bg-transparent border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <span
                      className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[11.5px] font-semibold shrink-0 transition-[background-color,color] duration-300"
                      style={{
                        backgroundColor: reached ? ACCENT : "#e6e8ea",
                        color: reached ? "#ffffff" : "#8e9296",
                      }}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div
                        className={`text-[17px] sm:text-[18px] font-medium tracking-[-0.02em] transition-colors duration-200 ${
                          isActive ? "text-[#090909]" : "text-[#686c70] group-hover:text-[#090909]"
                        }`}
                      >
                        {p.name}
                      </div>
                      <div
                        className="grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
                        style={{
                          gridTemplateRows: isActive ? "1fr" : "0fr",
                          opacity: isActive ? 1 : 0,
                        }}
                      >
                        <div className="overflow-hidden">
                          <p className="pt-1.5 text-[14.5px] leading-[1.55] text-[#55585c]">{p.text}</p>
                          <p className="pt-2.5 text-[13px] text-[#090909]">
                            <span className="text-[#8e9296]">You leave with</span>{" "}
                            <span className="font-medium">{p.outcome}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}

          <li className="pt-3 pl-4 lg:pl-5">
            <button
              type="button"
              onClick={() => scrollToId("contact")}
              className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-[#090909] cursor-pointer"
            >
              <span className="border-b border-black/25 group-hover:border-black transition-colors duration-200">
                Start with phase one, free
              </span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
          </li>
        </ol>

        {/* The climb */}
        <div className="lg:col-span-7 relative -mx-5 sm:mx-0" aria-hidden>
          <div className="process-rock relative ml-auto w-full max-w-[660px] aspect-[4/3] -mb-[7%]">
            <div className="process-rock__img absolute inset-0">
            <img
              src="/rocks/rock-right-bare.webp"
              alt=""
              draggable={false}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-contain"
            />
            <img
              src="/rocks/rock-right-green.webp"
              alt=""
              draggable={false}
              loading="lazy"
              className="process-moss absolute inset-0 w-full h-full object-contain"
              style={{ "--moss-r": MOSS[phase] } as React.CSSProperties}
            />
            </div>

            {/* Route */}
            <svg viewBox="0 0 100 75" className="absolute inset-0 w-full h-full" fill="none">
              <path
                d={ROUTE}
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1.5"
                strokeDasharray="1 5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={ROUTE}
                pathLength={1}
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="1"
                className="transition-[stroke-dashoffset] duration-[1100ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
                style={{ strokeDashoffset: 1 - ROUTE_AT[phase] }}
              />
            </svg>

            {/* Waypoints */}
            {WAYPOINTS.map((w, i) => {
              const reached = i <= phase;
              const isActive = i === phase;
              return (
                <div
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center"
                  style={{ left: `${w.x}%`, top: `${w.y}%` }}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold shadow-[0_4px_14px_rgba(0,0,0,0.35)] transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={{
                      backgroundColor: reached ? ACCENT : "#ffffff",
                      color: reached ? "#ffffff" : "#0a0a0a",
                      transform: isActive ? "scale(1.15)" : "scale(1)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="absolute left-full ml-2 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[12px] font-medium text-[#090909] shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateX(0)" : "translateX(-6px)",
                    }}
                  >
                    {PHASES[i].name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
