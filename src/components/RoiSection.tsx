"use client";

import { useState } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import { useTween } from "@/lib/hooks";
import { ACCENT, scrollToId } from "@/lib/site";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, step = 1, format, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[14px] sm:text-[14.5px] text-[#3d4044]">{label}</span>
        <span className="text-[15px] sm:text-[16px] font-medium tracking-[-0.02em] text-[#090909] tabular-nums">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="jx-range mt-2"
        style={{ "--p": `${pct}%` } as React.CSSProperties}
      />
    </label>
  );
}

const WEEKS = 52;

export default function RoiSection() {
  const [people, setPeople] = useState(8);
  const [hours, setHours] = useState(10);
  const [rate, setRate] = useState(28);
  const [share, setShare] = useState(50);

  const manualHours = people * hours;
  const hoursBack = manualHours * (share / 100);
  const yearly = hoursBack * rate * WEEKS;

  const shownHours = useTween(hoursBack);
  const shownYearly = useTween(yearly);
  const remaining = manualHours - hoursBack;

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
      description="Move the sliders to match your shop. The audit replaces these guesses with numbers measured from your own workflows."
      className="!min-h-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-[20px] overflow-hidden border border-black/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.05)] text-left">
        {/* Inputs */}
        <div className="lg:col-span-7 bg-card p-5 sm:p-7 lg:p-9 flex flex-col justify-center gap-6 sm:gap-8">
          <Slider
            label="People doing repetitive work"
            value={people}
            min={1}
            max={60}
            format={(v) => `${v}`}
            onChange={setPeople}
          />
          <Slider
            label="Hours each spends on it per week"
            value={hours}
            min={1}
            max={30}
            format={(v) => `${v} hrs`}
            onChange={setHours}
          />
          <Slider
            label="Loaded cost per hour"
            value={rate}
            min={15}
            max={90}
            format={(v) => `$${v}`}
            onChange={setRate}
          />
          <Slider
            label="Share of that work automation takes over"
            value={share}
            min={10}
            max={90}
            step={5}
            format={(v) => `${v}%`}
            onChange={setShare}
          />
        </div>

        {/* Result */}
        <div className="lg:col-span-5 bg-[#0a0a0a] text-white p-5 sm:p-7 lg:p-9 flex flex-col justify-between gap-8">
          <div>
            <div className="text-[13px] text-white/55">Hours handed back every week</div>
            <div className="mt-1 text-[clamp(2.75rem,6vw,4rem)] font-medium tracking-[-0.04em] leading-none tabular-nums">
              {Math.round(shownHours).toLocaleString("en-US")}
            </div>

            {/* Before / after week */}
            <div className="mt-6 space-y-2.5" aria-hidden>
              <div>
                <div className="flex justify-between text-[12px] text-white/50">
                  <span>Manual today</span>
                  <span className="tabular-nums">{manualHours.toLocaleString("en-US")} hrs / wk</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
              <div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-white/85">After automation</span>
                  <span className="tabular-nums" style={{ color: ACCENT }}>
                    {Math.round(remaining).toLocaleString("en-US")} hrs / wk
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full w-full origin-left rounded-full transition-transform duration-500 ease-out"
                    style={{ backgroundColor: ACCENT, transform: `scaleX(${1 - share / 100})` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="pt-5 border-t border-white/10 flex items-baseline justify-between gap-4">
              <span className="text-[13px] text-white/55">Worth per year</span>
              <span className="text-[24px] sm:text-[28px] font-medium tracking-[-0.03em] tabular-nums">
                ${Math.round(shownYearly).toLocaleString("en-US")}
              </span>
            </div>
            <p className="mt-3 text-[12px] leading-[1.5] text-white/45">
              An estimate from your inputs over {WEEKS} weeks, not a quote. Build cost is not
              included.
            </p>
            <button
              type="button"
              onClick={() => scrollToId("contact")}
              className="group mt-5 h-[46px] w-full rounded-full bg-white text-[#0a0a0a] flex items-center justify-center gap-2.5 text-[14px] font-medium tracking-[-0.01em] cursor-pointer hover:bg-[#f1f2f3] active:scale-[0.98] transition-[background-color,transform] duration-200"
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
    </SectionWrapper>
  );
}
