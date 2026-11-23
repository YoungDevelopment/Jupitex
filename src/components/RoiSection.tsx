"use client";

import { useEffect, useRef, useState } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import { useTween } from "@/lib/hooks";
import { ACCENT, scrollToId } from "@/lib/site";
import { GRAIN } from "@/lib/textures";

/* ─── Input: a slider for quick guesses, an editable value for exact numbers ─── */
interface SliderProps {
  label: string;
  value: number;
  /** slider range */
  min: number;
  max: number;
  /** what may be typed in, which can go past the slider's range */
  limitMin: number;
  limitMax: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  onChange: (v: number) => void;
}

function Slider({
  label,
  value,
  min,
  max,
  limitMin,
  limitMax,
  step = 1,
  prefix,
  suffix,
  onChange,
}: SliderProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const clamp = (n: number) => Math.min(limitMax, Math.max(limitMin, n));

  const commit = () => {
    if (draft === null) return;
    const n = Number(draft.replace(/[^0-9.]/g, ""));
    if (draft.trim() !== "" && Number.isFinite(n)) onChange(clamp(Math.round(n)));
    setDraft(null);
  };

  const shown = draft ?? String(value);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-[0.875rem] sm:text-[0.9062rem] text-[#3d4044]">{label}</span>
        <label
          className="group/val flex items-baseline rounded-lg border border-transparent bg-[#f1f2f3] px-2.5 py-1 text-[0.9375rem] sm:text-[1rem] font-medium tracking-[-0.02em] text-[#090909] tabular-nums cursor-text transition-colors duration-200 hover:border-black/10 focus-within:border-black/30 focus-within:bg-white"
          title="Type your own value"
        >
          {prefix && <span>{prefix}</span>}
          <input
            type="text"
            inputMode="numeric"
            aria-label={label}
            value={shown}
            size={Math.max(1, shown.length)}
            onFocus={(e) => {
              setDraft(String(value));
              requestAnimationFrame(() => e.target.select());
            }}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
              setDraft(raw);
              const n = Number(raw);
              // live update while typing, as long as it is a usable number
              if (raw !== "" && n >= limitMin && n <= limitMax) onChange(n);
            }}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              if (e.key === "Escape") {
                setDraft(null);
                (e.target as HTMLInputElement).blur();
              }
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
                const next = clamp(value + (e.key === "ArrowUp" ? step : -step));
                onChange(next);
                setDraft(String(next));
              }
            }}
            className="select-text bg-transparent p-0 text-right outline-none [field-sizing:content] min-w-[1ch]"
          />
          {suffix && <span className="ml-1 text-[#686c70] font-normal">{suffix}</span>}
        </label>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        aria-label={`${label} slider`}
        onChange={(e) => onChange(Number(e.target.value))}
        className="jx-range mt-2"
        style={{ "--p": `${pct}%` } as React.CSSProperties}
      />
    </div>
  );
}

const WEEKS = 52;

// Reveal choreography (desktop). Final layout: white 58% wide, black 44% tucked 2% under it.
// At the start both sit on the centre line, the black card hidden under the white one.
const WHITE_START = "translateX(36.2%)"; // (50 - 29) / 58 of its own width
const BLACK_START = "translateX(-63.6%) scale(0.9)"; // (50 - 78) / 44 of its own width
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Result card background: moss-green light blurred across the top, sinking into near-black.
const MOSS_GLOW: React.CSSProperties = {
  background: [
    "radial-gradient(70% 52% at 20% 0%, rgba(150, 186, 92, 0.50) 0%, rgba(150, 186, 92, 0.18) 45%, rgba(150, 186, 92, 0) 78%)",
    "radial-gradient(60% 48% at 90% 6%, rgba(104, 146, 58, 0.48) 0%, rgba(104, 146, 58, 0.14) 50%, rgba(104, 146, 58, 0) 80%)",
    "radial-gradient(45% 34% at 55% 22%, rgba(190, 214, 128, 0.20) 0%, rgba(190, 214, 128, 0) 72%)",
    "radial-gradient(80% 55% at 8% 42%, rgba(62, 92, 34, 0.40) 0%, rgba(62, 92, 34, 0) 78%)",
    "linear-gradient(180deg, #33441f 0%, #222d15 24%, #161d0f 44%, #0f130b 64%, #0b0c0a 82%, #0a0b09 100%)",
  ].join(", "),
};

export default function RoiSection() {
  const [people, setPeople] = useState(8);
  const [hours, setHours] = useState(10);
  const [rate, setRate] = useState(28);
  const [share, setShare] = useState(50);

  const stageRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Play once the user is actually on the section
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let t = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || reduce) {
          // a beat to register the white card on its own before the black one slides out
          t = window.setTimeout(() => setRevealed(true), reduce ? 0 : 450);
          observer.disconnect();
        }
      },
      { threshold: 0.55 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  const manualHours = people * hours;
  const hoursBack = manualHours * (share / 100);
  const yearly = hoursBack * rate * WEEKS;

  const shownHours = useTween(hoursBack);
  const shownYearly = useTween(yearly);
  const remaining = manualHours - hoursBack;

  const whiteStyle: React.CSSProperties = {
    transform: revealed ? "none" : isDesktop ? WHITE_START : "none",
    transition: `transform 1100ms ${EASE}`,
  };
  const blackStyle: React.CSSProperties = {
    transform: revealed
      ? "none"
      : isDesktop
        ? BLACK_START
        : "translateY(-55%) scale(0.92)",
    opacity: revealed ? 1 : 0,
    transition: `transform 1100ms ${EASE}, opacity 500ms ${EASE}`,
  };
  // Content inside the black card arrives just after the card itself
  const blackContent: React.CSSProperties = {
    opacity: revealed ? 1 : 0,
    transform: revealed ? "none" : "translateY(10px)",
    transition: `opacity 600ms ${EASE} 650ms, transform 700ms ${EASE} 650ms`,
  };

  return (
    <SectionWrapper
      id="estimate"
      ariaLabel="Estimate what manual work costs"
      subject="RUN THE NUMBERS"
      title={
        <>
          <span className="text-[#8e9296]">What is the manual work</span>
          <span>costing you?</span>
        </>
      }
      description="Move the sliders, or type your own numbers. The audit replaces these guesses with numbers measured from your own workflows."
    >
      <div
        ref={stageRef}
        className="relative flex flex-col lg:flex-row lg:items-center text-left"
      >
        {/* White: inputs. The bigger card, on top. */}
        <div
          className="relative z-10 w-full lg:w-[58%] rounded-[calc(22*var(--u))] border border-black/[0.06] bg-card shadow-[0_18px_50px_rgba(0,0,0,0.08)] p-5 sm:p-8 lg:p-10 lg:min-h-[calc(520*var(--u))] flex flex-col justify-center gap-6 sm:gap-8 will-change-transform"
          style={whiteStyle}
        >
          <Slider
            label="People doing repetitive back-office work"
            value={people}
            min={1}
            max={60}
            limitMin={1}
            limitMax={10000}
            onChange={setPeople}
          />
          <Slider
            label="Hours each spends on it per week"
            value={hours}
            min={1}
            max={30}
            limitMin={1}
            limitMax={80}
            suffix="hrs"
            onChange={setHours}
          />
          <Slider
            label="Loaded cost per hour"
            value={rate}
            min={15}
            max={90}
            limitMin={1}
            limitMax={1000}
            prefix="$"
            onChange={setRate}
          />
          <Slider
            label="Share of that work automation takes over"
            value={share}
            min={10}
            max={90}
            step={5}
            limitMin={0}
            limitMax={100}
            suffix="%"
            onChange={setShare}
          />
          <p className="-mt-1 sm:-mt-2 text-[0.75rem] text-[#8e9296]">
            Tap any number to type your own.
          </p>
        </div>

        {/* Black: result. Slightly smaller, tucked under the white card's edge. */}
        <div
          className="relative z-0 -mt-4 lg:mt-0 lg:-ml-[2%] w-full lg:w-[44%] rounded-b-[calc(22*var(--u))] lg:rounded-[calc(22*var(--u))] overflow-hidden isolate bg-[#0a0b09] text-white pt-9 px-5 pb-5 sm:pt-11 sm:px-8 sm:pb-8 lg:py-9 lg:pl-[calc(2.25rem+2%)] lg:pr-9 lg:min-h-[calc(460*var(--u))] flex will-change-transform"
          style={blackStyle}
        >
          {/* Moss light: soft, out-of-focus green glow falling from the top, grain on top */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={MOSS_GLOW} />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] mix-blend-overlay"
            style={GRAIN}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.10),inset_0_0_0_1px_rgba(255,255,255,0.05)]"
          />

          <div className="relative flex w-full flex-col justify-between gap-8" style={blackContent}>
            <div>
              <div className="text-[0.8125rem] text-white/55">Hours handed back every week</div>
              <div className="mt-1 text-[clamp(2.75rem,6vw,4rem)] font-medium tracking-[-0.04em] leading-none tabular-nums">
                {Math.round(revealed ? shownHours : 0).toLocaleString("en-US")}
              </div>

              {/* Before / after week */}
              <div className="mt-6 space-y-2.5" aria-hidden>
                <div>
                  <div className="flex justify-between text-[0.75rem] text-white/50">
                    <span>Manual today</span>
                    <span className="tabular-nums">
                      {manualHours.toLocaleString("en-US")} hrs / wk
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
                <div>
                  <div className="flex justify-between text-[0.75rem]">
                    <span className="text-white/85">After automation</span>
                    <span className="tabular-nums" style={{ color: ACCENT }}>
                      {Math.round(remaining).toLocaleString("en-US")} hrs / wk
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full w-full origin-left rounded-full transition-transform duration-500 ease-out"
                      style={{
                        backgroundColor: ACCENT,
                        transform: `scaleX(${revealed ? 1 - share / 100 : 0})`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="pt-5 border-t border-dashed border-white/15 flex items-baseline justify-between gap-4">
                <span className="text-[0.8125rem] text-white/55">Worth per year</span>
                <span className="text-[1.5rem] sm:text-[1.75rem] font-medium tracking-[-0.03em] tabular-nums">
                  ${Math.round(revealed ? shownYearly : 0).toLocaleString("en-US")}
                </span>
              </div>
              <p className="mt-3 text-[0.75rem] leading-[1.5] text-white/45">
                An estimate from your inputs over {WEEKS} weeks, not a quote. Build cost is not
                included.
              </p>
              <button
                type="button"
                onClick={() => scrollToId("contact")}
                className="group mt-5 h-[calc(46*var(--u))] w-full rounded-full bg-white text-[#0a0a0a] flex items-center justify-center gap-2.5 text-[0.875rem] font-medium tracking-[-0.01em] cursor-pointer hover:bg-[#f1f2f3] active:scale-[0.98] transition-[background-color,transform] duration-200"
              >
                <span>Get the measured version</span>
                <svg
                  width="14"
                  height="14"
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
