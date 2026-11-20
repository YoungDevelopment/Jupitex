"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  Check,
  Clock3,
  FileSpreadsheet,
  NotebookPen,
  ShieldAlert,
  Forward,
  UserRound,
} from "lucide-react";
import "./audit.css";

/* ───────────────────────── helpers ───────────────────────── */

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Tweens a number into place whenever `value` changes, writing straight to the DOM. */
function Tween({
  value,
  decimals = 0,
  duration = 900,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const write = (v: number) => (el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`);
    const from = shown.current;
    if (from === value || reducedMotion()) {
      shown.current = value;
      write(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      shown.current = from + (value - from) * e;
      write(shown.current);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, decimals, duration, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {`${prefix}${value.toFixed(decimals)}${suffix}`}
    </span>
  );
}

/** Timeouts that are all cleared together (on replay and on unmount). */
function useTimers() {
  const timers = useRef<number[]>([]);
  const clear = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);
  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  useEffect(() => clear, [clear]);
  return { after, clear };
}

/* ───────────────────────── tile shell ───────────────────────── */

type Tone = "sage" | "blue" | "moss" | "teal" | "amber";

function Tile({
  index,
  step,
  title,
  body,
  tone,
  className = "",
  pictureClassName = "",
  onEnter,
  children,
}: {
  index: number;
  step: number;
  title: string;
  body: string;
  tone: Tone;
  className?: string;
  pictureClassName?: string;
  onEnter?: () => void;
  children: ReactNode;
}) {
  return (
    <article
      onMouseEnter={onEnter}
      data-tone={tone}
      className={`ax-tile relative flex flex-col min-h-0 rounded-3xl bg-card border border-black/[0.06] p-2 ${className}`}
      style={{ "--i": index } as React.CSSProperties}
    >
      <div
        className={`ax-picture relative isolate overflow-hidden rounded-[18px] bg-[#f5f6f7] xl:flex-1 xl:min-h-0 ${pictureClassName}`}
      >
        <div className="ax-art relative h-full">{children}</div>
      </div>
      <div className="ax-copy px-3.5 sm:px-4 pt-4 pb-2 lg:pt-3 lg:pb-1">
        <div className="flex items-center gap-2.5">
          <span className="ax-step w-6 h-6 rounded-full text-[12px] font-semibold flex items-center justify-center shrink-0">
            {step}
          </span>
          <h3 className="text-[18px] sm:text-[19px] lg:text-[17.5px] font-semibold leading-[1.3] tracking-[-0.02em] text-[#090909]">
            {title}
          </h3>
        </div>
        <p className="ax-body mt-1.5 lg:mt-0.5 text-[14px] lg:text-[13.5px] leading-[1.5] text-[#5c6064]">{body}</p>
      </div>
    </article>
  );
}

/* ───────────────────────── 1 · goals ───────────────────────── */

const GOALS = [
  { label: "Send client reports on time", hours: 7 },
  { label: "Stop re-keying payments", hours: 5 },
  { label: "Speed up placement intake", hours: 4 },
];

function GoalsPicture({ start }: { start: boolean }) {
  const [checked, setChecked] = useState([false, false, false]);
  const touched = useRef(false);
  const { after } = useTimers();

  // The owners agree on the first two; the third is left for the visitor to tick
  useEffect(() => {
    if (!start) return;
    const set = (i: number) => () => {
      if (!touched.current) setChecked((c) => c.map((v, j) => (j === i ? true : v)));
    };
    after(reducedMotion() ? 0 : 1100, set(0));
    after(reducedMotion() ? 0 : 1550, set(1));
  }, [start, after]);

  const toggle = (i: number) => {
    touched.current = true;
    setChecked((c) => c.map((v, j) => (j === i ? !v : v)));
  };
  const hours = GOALS.reduce((sum, g, i) => sum + (checked[i] ? g.hours : 0), 0);
  const count = checked.filter(Boolean).length;

  return (
    <div className="h-full flex items-center justify-center px-4 sm:px-5 py-4">
      <div className="ax-goals w-full max-w-[330px] rounded-2xl bg-white border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between gap-3 pl-3.5 pr-2.5 pt-2.5 pb-1.5">
          <span className="text-[13px] font-semibold text-[#090909]">What matters most</span>
          {/* What the ticked goals are worth, adding up as they are ticked */}
          <span
            className="ax-goals__chip h-6 pl-1 pr-2.5 rounded-full bg-[var(--ax-deep)] text-white flex items-center gap-1.5 text-[11.5px] font-medium whitespace-nowrap"
            data-on={count > 0 || undefined}
          >
            <span className="w-4 h-4 rounded-full bg-[var(--ax-accent)] flex items-center justify-center text-[10px] font-semibold tabular-nums">
              {count}
            </span>
            <span>
              Save <Tween value={hours} duration={600} className="tabular-nums" /> h/wk
            </span>
          </span>
        </div>
        <ul className="px-1.5 pb-1.5">
          {GOALS.map((g, i) => (
            <li key={g.label} className="ax-goal" style={{ "--r": i } as React.CSSProperties}>
              <button
                type="button"
                aria-pressed={checked[i]}
                onClick={() => toggle(i)}
                className="ax-goal__row w-full flex items-center gap-2.5 rounded-xl px-2 py-[7px] text-left cursor-pointer"
                data-on={checked[i] || undefined}
              >
                <span className="ax-check w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0">
                  <Check className="ax-check__mark w-[11px] h-[11px] text-white" strokeWidth={3.5} />
                </span>
                <span className="flex-1 min-w-0 truncate text-[13px] font-medium text-[#121212]">
                  {g.label}
                </span>
                <span className="text-[11.5px] tabular-nums text-[#8e9296] shrink-0">{g.hours} h/wk</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ───────────────────────── 2 · flowchart ───────────────────────── */

const NODES = [
  { icon: FileSpreadsheet, label: "Exports payments", meta: "10 min each" },
  { icon: UserRound, label: "Rebuilds statement", meta: "35 min each", slow: true },
  { icon: ShieldAlert, label: "Checks the totals", meta: "15 min each" },
  { icon: NotebookPen, label: "Emails the client", meta: "5 min each" },
];

function FlowPicture() {
  return (
    <div className="ax-flow relative h-full flex flex-col lg:block">
      <div className="flex-1 flex items-center px-4 sm:px-6 pt-5 pb-4 lg:h-full lg:pt-[30px] lg:pb-[50px]">
        <ol className="w-full flex flex-col lg:flex-row lg:items-center">
          {NODES.map((n, i) => {
            const Icon = n.icon;
            return (
              <li
                key={n.label}
                className="contents"
              >
                {i > 0 && (
                  <span
                    aria-hidden
                    className="ax-wire relative self-start ml-[27px] lg:ml-0 lg:self-auto w-px h-5 lg:h-px lg:w-auto lg:flex-1 lg:min-w-[18px]"
                    style={{ "--w": i - 1 } as React.CSSProperties}
                  >
                    <span className="ax-wire__line absolute inset-0" />
                    <span className="ax-wire__dot absolute w-[7px] h-[7px] rounded-full bg-[var(--ax-accent)]" />
                  </span>
                )}
                <div
                  className="ax-node relative flex items-center gap-2.5 rounded-xl bg-white border border-black/[0.07] pl-2 pr-3 py-2 lg:min-w-0 xl:shrink-0 xl:whitespace-nowrap"
                  style={{ "--n": i } as React.CSSProperties}
                  data-slow={n.slow || undefined}
                >
                  <span className="ax-node__icon w-7 h-7 rounded-lg bg-[#f2f3f4] flex items-center justify-center shrink-0">
                    <Icon className="w-[15px] h-[15px]" strokeWidth={2} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12.5px] font-semibold leading-[1.3] text-[#121212]">
                      {n.label}
                    </span>
                    <span className="ax-node__meta block text-[11px] leading-[1.3] text-[#8e9296] mt-0.5">
                      {n.meta}
                    </span>
                  </span>
                  {n.slow && (
                    <>
                    <span aria-hidden className="ax-branch hidden lg:flex absolute left-1/2 top-full flex-col items-center">
                      <span className="ax-wire ax-wire--branch relative w-px h-4" style={{ "--w": 3 } as React.CSSProperties}>
                        <span className="ax-wire__line absolute inset-0" />
                        <span className="ax-wire__dot absolute w-[7px] h-[7px] rounded-full bg-[var(--ax-accent)]" />
                      </span>
                      <span className="ax-branch__node flex items-center gap-2 rounded-xl bg-white border border-black/[0.07] pl-2 pr-3 py-1.5 whitespace-nowrap shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
                        <span className="w-6 h-6 rounded-md bg-[#f2f3f4] text-[#55585c] flex items-center justify-center">
                          <Forward className="w-3.5 h-3.5" strokeWidth={2} />
                        </span>
                        <span>
                          <span className="block text-[12px] font-semibold leading-[1.3] text-[#121212]">Totals off? Starts again</span>
                          <span className="block text-[11px] leading-[1.3] text-[#8e9296]">1 in 8 statements</span>
                        </span>
                      </span>
                    </span>
                    <span className="ax-flag-pos absolute">
                      <span className="ax-flag relative h-6 px-2.5 rounded-full bg-[var(--ax-accent)] text-white text-[11px] font-semibold flex items-center whitespace-nowrap shadow-[0_6px_16px_var(--ax-glow)]">
                        Worth automating
                      </span>
                    </span>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="ax-flow__foot flex items-center gap-2 px-4 sm:px-6 pb-4 lg:absolute lg:left-0 lg:bottom-0 lg:pb-3.5 text-[11.5px] text-[#5c6064]">
        <Clock3 className="w-3.5 h-3.5" strokeWidth={2} />
        <span>
          Example: <span className="font-semibold text-[#121212]">65 min</span> per client · 40 clients a month
        </span>
      </div>
    </div>
  );
}

/* ───────────────────────── 3 · return ───────────────────────── */

function ReturnPicture({ start, run }: { start: boolean; run: number }) {
  const [shrunk, setShrunk] = useState(false);
  const [roi, setRoi] = useState(1);
  const { after, clear } = useTimers();

  useEffect(() => {
    if (!start) return;
    clear();
    const instant = reducedMotion();
    after(0, () => {
      setShrunk(false);
      setRoi(1);
    });
    after(instant ? 0 : 450, () => {
      setShrunk(true);
      setRoi(4.8);
    });
  }, [start, run, after, clear]);

  return (
    <div className="h-full flex flex-col justify-center px-5 sm:px-6 py-4">
      <div className="flex items-start flex-wrap justify-between gap-x-3 gap-y-2">
        <div>
          <div className="text-[12.5px] text-[#7c7f82]">Example: return in year one</div>
          <div className="mt-1 text-[46px] xl:text-[40px] font-semibold leading-none tracking-[-0.04em] text-[#090909] whitespace-nowrap">
            <Tween value={roi} decimals={1} duration={1300} suffix="×" className="tabular-nums" />
          </div>
        </div>
        <span
          className="ax-payback mt-1 h-7 px-2.5 rounded-full bg-white/90 border border-black/[0.07] text-[11.5px] font-medium text-[#121212] flex items-center gap-1.5 whitespace-nowrap"
          data-on={shrunk || undefined}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--ax-accent)]" />
          Pays back in 7 weeks
        </span>
      </div>

      <div className="mt-4 xl:mt-3 space-y-2.5 xl:space-y-2">
        <div>
          <div className="flex justify-between text-[12px] text-[#7c7f82]">
            <span>Done by hand</span>
            <span className="tabular-nums">14 hrs / wk</span>
          </div>
          <div className="mt-1 h-[7px] rounded-full bg-black/[0.1]" />
        </div>
        <div>
          <div className="flex justify-between text-[12px] font-semibold">
            <span className="text-[#090909]">Automated</span>
            <span className="text-[var(--ax-accent)] tabular-nums">10 min / wk</span>
          </div>
          <div className="mt-1 h-[7px] rounded-full bg-white/80">
            <div className="ax-bar h-full rounded-full bg-[var(--ax-accent)]" data-on={shrunk || undefined} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── 4 · team review ───────────────────────── */

function ReviewPicture({ start, run }: { start: boolean; run: number }) {
  // 0 hidden · 1 typing · 2 comment · 3 change applied
  const [phase, setPhase] = useState(0);
  const { after, clear } = useTimers();

  useEffect(() => {
    if (!start) return;
    clear();
    if (reducedMotion()) {
      after(0, () => setPhase(3));
      return;
    }
    after(0, () => setPhase(1));
    after(900, () => setPhase(2));
    after(1700, () => setPhase(3));
  }, [start, run, after, clear]);

  return (
    <div className="h-full flex flex-col justify-center gap-3 px-4 sm:px-5 py-4">
      {/* The comment */}
      <div className="flex items-start gap-2.5">
        <span className="w-7 h-7 rounded-full bg-[#d9f2ea] text-[#1c7a5a] text-[10.5px] font-semibold flex items-center justify-center shrink-0">
          SR
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5 text-[12px]">
            <span className="font-semibold text-[#121212]">Sara</span>
            <span className="text-[#8e9296]">Finance lead</span>
          </div>
          <div className="ax-bubble mt-1.5 inline-grid rounded-2xl rounded-tl-md bg-white border border-black/[0.06] shadow-[0_6px_18px_rgba(0,0,0,0.05)]" data-phase={phase}>
            <span className="ax-bubble__typing col-start-1 row-start-1 flex items-center gap-1 px-3.5 py-3">
              <i /> <i /> <i />
            </span>
            <span className="ax-bubble__text col-start-1 row-start-1 px-3.5 py-2.5 text-[13px] leading-[1.45] text-[#121212]">
              Keep a finance sign-off before statements go out.
            </span>
          </div>
        </div>
      </div>

      {/* The flow, adjusted to it */}
      <div className="ax-mini flex items-center rounded-2xl bg-white/75 border border-black/[0.05] p-2" data-on={phase >= 3 || undefined}>
        <span className="ax-pill">Draft</span>
        <span className="ax-mini__wire" />
        <span className="ax-mini__insert">
          <span className="ax-mini__inner">
            <span className="ax-pill ax-pill--new">
              <Check className="w-3 h-3" strokeWidth={3} />
              Manager sign-off
            </span>
            <span className="ax-mini__wire" />
          </span>
        </span>
        <span className="ax-pill ax-pill--dark">Send</span>
      </div>
    </div>
  );
}

/* ───────────────────────── 5 · roadmap ───────────────────────── */

function RoadmapPicture({ start, run }: { start: boolean; run: number }) {
  const [value, setValue] = useState(0);
  const { after, clear } = useTimers();

  useEffect(() => {
    if (!start) return;
    clear();
    after(0, () => setValue(0));
    after(reducedMotion() ? 0 : 900, () => setValue(64));
  }, [start, run, after, clear]);

  const rows: [string, ReactNode][] = [
    ["Workflows to automate", "6"],
    ["Build cost", "Fixed quote"],
    [
      "Expected return",
      <Tween key="v" value={value} duration={1100} prefix="+$" suffix="k / yr" className="tabular-nums text-[var(--ax-accent)]" />,
    ],
  ];

  return (
    <div className="ax-stack relative h-full flex items-center justify-center px-6 py-4">
      <div className="relative w-full max-w-[290px]">
        <div className="ax-page ax-page--b2 absolute inset-0"><div className="ax-page__face" /></div>
        <div className="ax-page ax-page--b1 absolute inset-0"><div className="ax-page__face" /></div>
        <div className="ax-page ax-page--top relative">
          <div className="ax-page__face px-4 pt-2.5 pb-0.5">
            <div className="flex items-center gap-2">
              <span className="w-[22px] h-[22px] rounded-full bg-[#0a0a0a] flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/JupitexLogos/tab-logo-dark.png" alt="" className="w-[11px] h-[11px] object-contain" />
              </span>
              <span className="text-[13px] font-semibold text-[#090909]">Example roadmap</span>
            </div>
            <ul className="mt-2">
              {rows.map(([label, v], i) => (
                <li
                  key={label}
                  className="ax-page__row flex items-center justify-between gap-3 py-[7px] border-t border-black/[0.06] text-[12.5px]"
                  style={{ "--r": i } as React.CSSProperties}
                >
                  <span className="text-[#5c6064]">{label}</span>
                  <span className="font-semibold text-[#090909] whitespace-nowrap">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── the grid ───────────────────────── */

export default function AuditGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [runs, setRuns] = useState([0, 0, 0]);
  const last = useRef([0, 0, 0]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Hovering a tile that has finished its story plays it again
  const replay = (k: number) => () => {
    const now = performance.now();
    if (!inView || now - last.current[k] < 2600) return;
    last.current[k] = now;
    setRuns((r) => r.map((v, j) => (j === k ? v + 1 : v)));
  };

  // Each tile's story starts once the tile itself has risen in (staggered by --i)
  const [started, setStarted] = useState([false, false, false, false, false]);
  useEffect(() => {
    if (!inView) return;
    const ts = [0, 1, 2, 3, 4].map((i) =>
      window.setTimeout(
        () => setStarted((s) => s.map((v, j) => (j === i ? true : v))),
        reducedMotion() ? 0 : 800 + i * 170
      )
    );
    return () => ts.forEach((t) => window.clearTimeout(t));
  }, [inView]);

  useEffect(() => {
    const now = performance.now();
    last.current = [now, now, now];
  }, [inView]);

  return (
    <div
      ref={ref}
      data-in={inView || undefined}
      className="ax-grid text-left w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 xl:grid-rows-2 gap-4 mt-6 lg:mt-5 xl:h-[clamp(446px,calc(100svh-369px),680px)]"
    >
      <Tile
        index={0}
        step={1}
        title="A 30-minute intro with you"
        body="We agree on which back-office work costs you the most time, and what a good result looks like."
        tone="sage"
        className="lg:col-span-2"
        pictureClassName="h-[210px] lg:h-[180px] xl:h-auto"
      >
        <GoalsPicture start={started[0]} />
      </Tile>

      <Tile
        index={1}
        step={2}
        title="A 60-minute walkthrough"
        body="The person who does the work shows us how it runs today. Test or masked accounts are fine, and we never log in to your systems."
        tone="blue"
        className="lg:col-span-4"
        pictureClassName="ax-dots lg:h-[180px] xl:h-auto"
      >
        <FlowPicture />
      </Tile>

      <Tile
        index={2}
        step={3}
        title="Every task priced and measured"
        body="Each idea gets a fixed price, the hours it saves each month and the payback, so you only pick what pays."
        tone="moss"
        className="lg:col-span-2"
        pictureClassName="h-[210px] lg:h-[180px] xl:h-auto"
        onEnter={replay(0)}
      >
        <ReturnPicture start={started[2]} run={runs[0]} />
      </Tile>

      <Tile
        index={3}
        step={4}
        title="Checked by your team"
        body="Your finance and compliance leads review the plan before anything is built, and we adjust it to how they work."
        tone="teal"
        className="lg:col-span-2"
        pictureClassName="h-[210px] lg:h-[180px] xl:h-auto"
        onEnter={replay(1)}
      >
        <ReviewPicture start={started[3]} run={runs[1]} />
      </Tile>

      <Tile
        index={4}
        step={5}
        title="Your roadmap in 10 business days"
        body="A written plan: what to automate first, the fixed price and the return to expect. The process map is yours, even if you never hire us."
        tone="amber"
        className="sm:col-span-2 lg:col-span-2"
        pictureClassName="h-[210px] lg:h-[180px] xl:h-auto"
        onEnter={replay(2)}
      >
        <RoadmapPicture start={started[4]} run={runs[2]} />
      </Tile>
    </div>
  );
}
