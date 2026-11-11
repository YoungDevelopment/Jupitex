"use client";

import { useEffect, useRef, useState } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import AutomationStage, { AUTOMATION_SCENES } from "@/components/stageshow/AutomationStage";
import { usePrefersReducedMotion, useSpotlight } from "@/lib/hooks";
import { ACCENT, WORKFLOWS, scrollToId } from "@/lib/site";

const HOLD_MS = 3400; // pause on a finished story before moving to the next workflow

export default function AutomationsSection() {
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0); // which of the four beats the animation has reached
  const [done, setDone] = useState(false);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(true); // off for good once the visitor picks one
  const reduce = usePrefersReducedMotion();
  const spotRef = useSpotlight<HTMLDivElement>();
  const tabsRef = useRef<HTMLDivElement>(null);

  const workflow = WORKFLOWS[active];
  const total = workflow.steps.length;
  const litSteps = reduce ? total : step;

  // Once a story has finished (and nobody is reading it), move to the next workflow.
  useEffect(() => {
    if (!done || !autoplay || paused || reduce) return;
    const t = window.setTimeout(() => {
      setActive((a) => (a + 1) % WORKFLOWS.length);
      setStep(0);
      setDone(false);
    }, HOLD_MS);
    return () => window.clearTimeout(t);
  }, [done, autoplay, paused, reduce]);

  // On phones the picker is a horizontal strip: keep the active workflow in view
  // (scrolls the strip only, never the page).
  useEffect(() => {
    const strip = tabsRef.current;
    if (!strip || strip.scrollWidth <= strip.clientWidth) return;
    const tab = strip.querySelectorAll<HTMLElement>("[role=tab]")[active];
    if (!tab) return;
    strip.scrollTo({ left: tab.offsetLeft - 20, behavior: reduce ? "auto" : "smooth" });
  }, [active, reduce]);

  const select = (index: number) => {
    setAutoplay(false);
    if (index === active) return;
    setActive(index);
    setStep(0);
    setDone(false);
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
          Five places collection agencies lose the most hours. Pick one to watch how it runs{" "}
          <span className="text-[#090909] font-medium">once it is automated</span>, and what
          stays with your people.
        </>
      }
      className="!min-h-0"
    >
      <div
        ref={spotRef}
        className="spot-group grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left"
      >
        {/* Workflow picker */}
        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Workflows"
          aria-orientation="vertical"
          onKeyDown={onTabKeyDown}
          className="lg:col-span-4 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible -mx-5 px-5 sm:mx-0 sm:px-0 pb-1 lg:pb-0 snap-x scroll-px-5 sm:scroll-px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                className={`group relative shrink-0 snap-start w-[240px] sm:w-[280px] lg:w-full text-left rounded-[16px] border px-4 py-3.5 lg:px-5 lg:py-4 cursor-pointer transition-[background-color,border-color,box-shadow] duration-200 ${
                  isActive
                    ? "bg-card border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
                    : "bg-transparent border-transparent hover:bg-white/60 hover:border-black/[0.05]"
                }`}
              >
                <div className="flex items-baseline gap-3.5">
                  <span
                    className="text-[12px] font-medium tabular-nums transition-colors duration-200"
                    style={{ color: isActive ? ACCENT : "#a2a6aa" }}
                  >
                    0{i + 1}
                  </span>
                  <div className="min-w-0">
                    <div
                      className={`text-[15px] sm:text-[16px] font-medium tracking-[-0.02em] transition-colors duration-200 ${
                        isActive ? "text-[#090909]" : "text-[#55585c] group-hover:text-[#090909]"
                      }`}
                    >
                      {w.name}
                    </div>
                    <div
                      className="grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
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

                {/* Autoplay timer: follows the story as it plays */}
                {isActive && autoplay && !reduce && (
                  <span className="absolute left-5 right-5 bottom-0 h-[1.5px] rounded-full bg-black/[0.06] overflow-hidden">
                    <span
                      className="block h-full origin-left rounded-full transition-transform duration-[1300ms] ease-linear"
                      style={{ backgroundColor: ACCENT, transform: `scaleX(${Math.min(1, step / total)})` }}
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
          className="spot-card lg:col-span-8 rounded-[20px] bg-card border border-black/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.05)] p-4 sm:p-5 lg:p-6 flex flex-col"
        >
          {/* The animated story. Remounted per workflow: each one starts from its own first frame. */}
          <div
            key={workflow.id}
            className="animate-[fadeIn_0.35s_ease-out]"
            role="img"
            aria-label={`Animation: ${workflow.steps.map((s) => s.title).join(", then ")}.`}
          >
            <AutomationStage
              scene={AUTOMATION_SCENES[workflow.id]}
              onStep={setStep}
              onDone={() => setDone(true)}
            />
          </div>

          {/* The same four beats, in words */}
          <ol className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-4 gap-x-5 gap-y-4 px-1 sm:px-2">
            {workflow.steps.map((s, i) => {
              const lit = i < litSteps;
              return (
                <li key={s.title} className="relative flex sm:block gap-3.5">
                  <div className="flex sm:items-center gap-2.5 sm:mb-2.5 shrink-0">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[11.5px] font-semibold shrink-0 transition-[background-color,color] duration-300"
                      style={{
                        backgroundColor: lit ? ACCENT : "#eceeef",
                        color: lit ? "#ffffff" : "#8e9296",
                      }}
                    >
                      {i + 1}
                    </span>
                    {/* Wire to the next step */}
                    {i < total - 1 && (
                      <span className="hidden sm:block relative flex-1 h-[1.5px] bg-black/[0.08] overflow-hidden rounded-full">
                        <span
                          className="absolute inset-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                          style={{
                            backgroundColor: ACCENT,
                            transform: `scaleX(${i < litSteps - 1 ? 1 : 0})`,
                          }}
                        />
                      </span>
                    )}
                  </div>
                  <div
                    className="min-w-0 transition-opacity duration-300"
                    style={{ opacity: lit ? 1 : 0.45 }}
                  >
                    <div className="text-[14.5px] font-medium tracking-[-0.015em] text-[#090909]">
                      {s.title}
                    </div>
                    <p className="mt-0.5 text-[13px] leading-[1.5] text-[#5c6064]">{s.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Before, what stays human, and proof */}
          <div className="mt-5 sm:mt-6 pt-5 px-1 sm:px-2 border-t border-black/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <div className="text-[12px] font-medium text-[#8e9296]">How it runs today</div>
              <p className="mt-1 text-[13.5px] leading-[1.55] text-[#3d4044]">{workflow.today}</p>
            </div>
            <div>
              <div className="text-[12px] font-medium text-[#8e9296]">Stays with your team</div>
              <p className="mt-1 text-[13.5px] leading-[1.55] text-[#121212]">
                {workflow.staysWithTeam}
              </p>
              {workflow.proof ? (
                <button
                  type="button"
                  onClick={() => scrollToId("our-work")}
                  className="group mt-3 block text-left text-[13px] leading-[1.5] text-[#3d4044] cursor-pointer"
                >
                  <span className="font-medium text-[#090909] tabular-nums whitespace-nowrap">
                    {workflow.proof.figure}
                  </span>{" "}
                  <span className="border-b border-black/20 group-hover:border-black/60 transition-colors duration-200">
                    {workflow.proof.label}
                  </span>
                  <span className="inline-block ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => scrollToId("contact")}
                  className="group mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#090909] cursor-pointer"
                >
                  <span className="border-b border-black/20 group-hover:border-black/60 transition-colors duration-200">
                    Scope this in your audit
                  </span>
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
