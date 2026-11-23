"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import AutomationStage, {
  AUTOMATION_SCENES,
} from "@/components/stageshow/AutomationStage";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ACCENT, WORKFLOWS } from "@/lib/site";
import StageLight from "@/components/StageLight";

const HOLD_MS = 4000; // the timer's last stretch: time to read the finished story, then move on

export default function AutomationsSection() {
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0); // which of the four beats the animation has reached
  const [done, setDone] = useState(false);
  const [paused, setPaused] = useState(false);
  const [frozen, setFrozen] = useState<number | null>(null); // timer position held while paused
  const [holdMs, setHoldMs] = useState(HOLD_MS); // what is left of the hold after a resume
  const timerRef = useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion();
  const tabsRef = useRef<HTMLDivElement>(null);

  const workflow = WORKFLOWS[active];
  const total = workflow.steps.length;
  const litSteps = reduce ? total : step;

  // Once a story has finished and its timer has run out, move to the next workflow.
  useEffect(() => {
    if (!done || reduce || paused) return;
    const t = window.setTimeout(() => {
      setActive((a) => (a + 1) % WORKFLOWS.length);
      setStep(0);
      setDone(false);
      setHoldMs(HOLD_MS);
    }, holdMs);
    return () => window.clearTimeout(t);
  }, [done, reduce, paused, holdMs]);

  // Pause holds the timer exactly where it is; play carries on from there.
  const togglePause = () => {
    if (!paused) {
      const m = timerRef.current
        ? new DOMMatrixReadOnly(getComputedStyle(timerRef.current).transform)
        : null;
      setFrozen(m ? m.a : 0);
      setPaused(true);
      return;
    }
    if (done && frozen !== null) {
      // the hold covers the last quarter of the bar: only the part still unfilled is left
      setHoldMs(Math.max(500, ((1 - frozen) / 0.25) * HOLD_MS));
    }
    setFrozen(null);
    setPaused(false);
  };

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
    // Picking a card always hands control back to the normal switching
    setPaused(false);
    setFrozen(null);
    if (index === active) return;
    setHoldMs(HOLD_MS);
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
    tabsRef.current
      ?.querySelectorAll<HTMLButtonElement>("[role=tab]")
      [next]?.focus();
  };

  return (
    <SectionWrapper
      id="automations"
      ariaLabel="What we automate"
      subject="WHAT WE AUTOMATE"
      title={
        <>
          <span className="text-[#8e9296]">The back-office work</span>
          <span>your team repeats every week</span>
        </>
      }
      description={
        <>
          Five jobs where collection agencies lose the most staff hours. Pick
          one to see how it runs{" "}
          <span className="text-[#090909] font-medium">
            once it is automated
          </span>
          , and how we set it up.
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 text-left">
        {/* Workflow picker, with the autoplay control under it */}
        <div className="lg:col-span-4 min-w-0">
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Workflows"
            aria-orientation="vertical"
            onKeyDown={onTabKeyDown}
            className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible -mx-5 px-5 sm:mx-0 sm:px-0 pb-1 lg:pb-0 snap-x scroll-px-5 sm:scroll-px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                          isActive
                            ? "text-[#090909]"
                            : "text-[#55585c] group-hover:text-[#090909]"
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
                          <p className="pt-1 text-[13.5px] leading-[1.5] text-[#686c70]">
                            {w.blurb}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timer: follows the story as it plays, then runs out during the hold */}
                  {isActive && !reduce && (
                    <span className="absolute left-5 right-5 bottom-0 h-[1.5px] rounded-full bg-black/[0.06] overflow-hidden">
                      <span
                        key={w.id}
                        ref={timerRef}
                        className="block h-full origin-left rounded-full ease-linear"
                        style={{
                          backgroundColor: ACCENT,
                          opacity: paused ? 0.45 : 1,
                          transform: `scaleX(${
                            frozen !== null
                              ? frozen
                              : done
                                ? 1
                                : (Math.min(step, total) / total) * 0.75
                          })`,
                          transitionProperty: "transform, opacity",
                          transitionDuration: `${
                            frozen !== null ? 0 : done ? holdMs : 1300
                          }ms, 200ms`,
                        }}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {!reduce && (
            <button
              type="button"
              onClick={togglePause}
              aria-pressed={paused}
              aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
              className="group mt-3 lg:mt-4 lg:ml-5 inline-flex h-8 items-center gap-2 rounded-full border border-black/[0.08] bg-white/70 pl-2.5 pr-3.5 text-[12.5px] font-medium text-[#3d4044] cursor-pointer transition-[background-color,border-color,color,transform] duration-200 hover:bg-white hover:border-black/[0.14] hover:text-[#090909] active:scale-[0.97]"
            >
              <span className="relative grid h-4 w-4 place-items-center">
                <Pause
                  size={13}
                  strokeWidth={2.25}
                  aria-hidden
                  className={`absolute transition-[opacity,transform] duration-200 ${paused ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}
                />
                <Play
                  size={13}
                  strokeWidth={2.25}
                  aria-hidden
                  className={`absolute translate-x-[1px] transition-[opacity,transform] duration-200 ${paused ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                />
              </span>
              <span>{paused ? "Play" : "Pause"}</span>
            </button>
          )}
        </div>

        {/* Workflow detail */}
        <div
          id="workflow-panel"
          role="tabpanel"
          aria-labelledby={`tab-${workflow.id}`}
          className="lg:col-span-8 rounded-[20px] bg-card border border-black/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.05)] p-4 sm:p-5 lg:p-6 flex flex-col"
        >
          <StageLight
            active={workflow.id}
            order={WORKFLOWS.map((w) => w.id)}
            className="rounded-t-[14px] [clip-path:inset(0_round_14px_14px_0_0)]"
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
          </StageLight>

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
                    <p className="mt-0.5 text-[13px] leading-[1.5] text-[#5c6064]">
                      {s.detail}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* How we automate it, in plain words */}
          <div className="mt-5 sm:mt-6 pt-5 px-1 sm:px-2 border-t border-black/[0.06]">
            <div className="text-[12px] font-medium text-[#8e9296]">
              How we automate it
            </div>
            <ul
              key={workflow.id}
              className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3"
            >
              {workflow.howWeAutomate.map((line, i) => (
                <li
                  key={line}
                  className="flex gap-2.5 text-[13.5px] leading-[1.55] text-[#3d4044] animate-[fadeIn_0.4s_ease-out_both]"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <span
                    aria-hidden
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: ACCENT }}
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
