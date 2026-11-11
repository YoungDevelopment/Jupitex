"use client";

import { useEffect, useRef, useState } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import { useInView, usePrefersReducedMotion, useSpotlight } from "@/lib/hooks";
import { ACCENT, WORKFLOWS, scrollToId } from "@/lib/site";

const STEP_MS = 1000; // time each pipeline step takes to light up
const HOLD_MS = 3200; // pause on a finished pipeline before moving on

export default function AutomationsSection() {
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0); // how many steps are lit
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(true); // off for good once the visitor picks one
  const [viewRef, inView] = useInView<HTMLDivElement>(false);
  const reduce = usePrefersReducedMotion();
  const spotRef = useSpotlight<HTMLDivElement>();
  const tabsRef = useRef<HTMLDivElement>(null);

  const workflow = WORKFLOWS[active];
  const total = workflow.steps.length;
  const litSteps = reduce ? total : step;

  // Lights the steps one at a time, then (while autoplay is on) advances to the next workflow.
  useEffect(() => {
    if (reduce || !inView || paused) return;
    if (step < total) {
      const t = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 450 : STEP_MS);
      return () => window.clearTimeout(t);
    }
    if (!autoplay) return;
    const t = window.setTimeout(() => {
      setActive((a) => (a + 1) % WORKFLOWS.length);
      setStep(0);
    }, HOLD_MS);
    return () => window.clearTimeout(t);
  }, [step, total, inView, paused, autoplay, reduce]);

  // On phones the picker is a horizontal strip: keep the active workflow in view
  // (scrolls the strip only, never the page).
  useEffect(() => {
    const strip = tabsRef.current;
    if (!strip || strip.scrollWidth <= strip.clientWidth) return;
    const tab = strip.querySelectorAll<HTMLElement>("[role=tab]")[active];
    if (!tab) return;
    strip.scrollTo({
      left: tab.offsetLeft - 20,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [active, reduce]);

  const select = (index: number) => {
    setAutoplay(false);
    setActive(index);
    setStep(0);
  };

  const onTabKeyDown = (e: React.KeyboardEvent) => {
    const dir =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? 1
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
        ? -1
        : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + WORKFLOWS.length) % WORKFLOWS.length;
    select(next);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]?.focus();
  };

  return (
    <SectionWrapper
      id="automations"
      ariaLabel="What we automate"
      subject="WHAT WE AUTOMATE"
      title={
        <>
          <span className="text-[#8e9296]">The work your agency repeats</span>
          <span>every single day</span>
        </>
      }
      description={
        <>
          Five places collection agencies lose the most hours. Pick one to see how it runs{" "}
          <span className="text-[#090909] font-medium">once it is automated</span>, and what
          stays with your people.
        </>
      }
      className="!min-h-0"
    >
      <div
        ref={(node) => {
          viewRef.current = node;
          spotRef.current = node;
        }}
        className="spot-group grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left"
      >
        {/* Workflow picker */}
        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Workflows"
          aria-orientation="vertical"
          onKeyDown={onTabKeyDown}
          className="lg:col-span-5 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible -mx-5 px-5 sm:mx-0 sm:px-0 pb-1 lg:pb-0 snap-x scroll-px-5 sm:scroll-px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {WORKFLOWS.map((w, i) => {
            const isActive = i === active;
            return (
              <button
                key={w.id}
                type="button"
                role="tab"
                id={`tab-${w.id}`}
                aria-selected={isActive}
                aria-controls="workflow-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(i)}
                className={`group relative shrink-0 snap-start w-[240px] sm:w-[280px] lg:w-full text-left rounded-[16px] border px-4 py-3.5 lg:px-5 lg:py-4 cursor-pointer transition-[background-color,border-color,box-shadow] duration-300 ${
                  isActive
                    ? "bg-card border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
                    : "bg-transparent border-transparent hover:bg-white/60 hover:border-black/[0.05]"
                }`}
              >
                <div className="flex items-baseline gap-3.5">
                  <span
                    className="text-[12px] font-medium tabular-nums transition-colors duration-300"
                    style={{ color: isActive ? ACCENT : "#a2a6aa" }}
                  >
                    0{i + 1}
                  </span>
                  <div className="min-w-0">
                    <div
                      className={`text-[15px] sm:text-[16px] font-medium tracking-[-0.02em] transition-colors duration-300 ${
                        isActive ? "text-[#090909]" : "text-[#55585c] group-hover:text-[#090909]"
                      }`}
                    >
                      {w.name}
                    </div>
                    <div
                      className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
                      style={{
                        gridTemplateRows: isActive ? "1fr" : "0fr",
                        opacity: isActive ? 1 : 0,
                      }}
                    >
                      <div className="overflow-hidden">
                        <p className="pt-1 text-[13.5px] leading-[1.5] text-[#686c70]">{w.blurb}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Autoplay timer: fills while this workflow is on screen */}
                {isActive && autoplay && !reduce && (
                  <span className="absolute left-5 right-5 bottom-0 h-[1.5px] rounded-full bg-black/[0.06] overflow-hidden">
                    <span
                      className="block h-full origin-left rounded-full transition-transform ease-linear"
                      style={{
                        backgroundColor: ACCENT,
                        transform: `scaleX(${Math.min(1, step / total)})`,
                        transitionDuration: `${STEP_MS}ms`,
                      }}
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Workflow detail */}
        <div
          id="workflow-panel"
          role="tabpanel"
          aria-labelledby={`tab-${workflow.id}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="spot-card lg:col-span-7 rounded-[20px] bg-card border border-black/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.05)] p-5 sm:p-7 lg:p-8 flex flex-col"
        >
          <div key={workflow.id} className="flex flex-col flex-1 animate-[stepIn_0.45s_var(--ease-out)]">
            {/* Today */}
            <div className="rounded-[14px] bg-[#f8f9fa] border border-black/[0.05] px-4 py-3.5">
              <div className="text-[11.5px] font-medium text-[#8e9296]">How it runs today</div>
              <p className="mt-1 text-[14px] leading-[1.55] text-[#3d4044]">{workflow.today}</p>
            </div>

            {/* Automated pipeline */}
            <div className="mt-6 flex items-center gap-3 text-[11.5px] font-medium text-[#8e9296]">
              <span>Once it is automated</span>
              <span className="flex-1 h-px bg-black/[0.07]" />
              <span className="tabular-nums text-[#55585c]">
                {Math.min(litSteps, total)} / {total}
              </span>
            </div>

            <ol className="mt-4 relative">
              {/* Wire behind the nodes, filling as steps complete */}
              <span className="absolute left-[13px] top-3.5 bottom-3.5 w-[1.5px] bg-black/[0.08]" />
              <span
                className="absolute left-[13px] top-3.5 bottom-3.5 w-[1.5px] origin-top transition-transform duration-700 ease-out"
                style={{
                  backgroundColor: ACCENT,
                  transform: `scaleY(${Math.max(0, Math.min(1, (litSteps - 1) / (total - 1)))})`,
                }}
              />

              {workflow.steps.map((s, i) => {
                const lit = i < litSteps;
                const current = i === litSteps - 1 && litSteps < total;
                return (
                  <li key={s.title} className="relative flex gap-4 pb-5 last:pb-0">
                    <span
                      className="relative z-10 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0 transition-[background-color,color,transform] duration-500"
                      style={{
                        backgroundColor: lit ? ACCENT : "#eceeef",
                        color: lit ? "#ffffff" : "#8e9296",
                        transform: current ? "scale(1.12)" : "scale(1)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <div
                      className="min-w-0 transition-opacity duration-500"
                      style={{ opacity: lit ? 1 : 0.42 }}
                    >
                      <div className="text-[15px] sm:text-[16px] font-medium tracking-[-0.02em] text-[#090909]">
                        {s.title}
                      </div>
                      <p className="mt-0.5 text-[13.5px] sm:text-[14px] leading-[1.5] text-[#5c6064]">
                        {s.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* What stays human + proof */}
            <div className="mt-6 pt-5 border-t border-black/[0.06] flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
              <div className="max-w-[360px]">
                <div className="text-[11.5px] font-medium text-[#8e9296]">Stays with your team</div>
                <p className="mt-1 text-[14px] leading-[1.5] text-[#121212]">
                  {workflow.staysWithTeam}
                </p>
              </div>

              {workflow.proof ? (
                <button
                  type="button"
                  onClick={() => scrollToId("our-work")}
                  className="group text-left rounded-[14px] border px-4 py-2.5 cursor-pointer transition-colors duration-200 hover:bg-[#FF731E]/[0.1]"
                  style={{
                    backgroundColor: "rgba(255, 115, 30, 0.06)",
                    borderColor: "rgba(255, 115, 30, 0.22)",
                  }}
                >
                  <div className="text-[18px] font-medium tracking-[-0.02em] text-[#090909] tabular-nums">
                    {workflow.proof.figure}
                  </div>
                  <div className="text-[12px] text-[#5c6064] flex items-center gap-1.5">
                    <span>{workflow.proof.label}</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => scrollToId("contact")}
                  className="group flex items-center gap-1.5 text-[13.5px] font-medium text-[#090909] cursor-pointer"
                >
                  <span className="border-b border-black/25 group-hover:border-black transition-colors duration-200">
                    Scope this in your audit
                  </span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
