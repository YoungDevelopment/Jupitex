"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import {
  Banknote,
  Bell,
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
  Handshake,
  LayoutGrid,
  PanelLeftClose,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  UserRound,
  Users,
  Zap,
} from "lucide-react";

/**
 * Hero product preview: an agency's revenue once the repetitive work is automated.
 * The story: automations act on accounts (the live feed), payments land, and the month's
 * collections roll up. All figures are illustrative sample data.
 */

const ACCENT = "#FF731E";
const TODAY = 11; // Wed, 11 Nov 2026
const DAYS = 30;
const ROW_H = 37; // feed row pitch
const FEED_ROWS = 7; // rows kept mounted; the bottom ones fade out under the mask
const TICK_MS = 2800; // one automation event every few seconds: readable, never busy

// Daily collections for November: [automated, by staff], in dollars. Sundays run lighter.
const DAILY: [number, number][] = Array.from({ length: DAYS }, (_, i) => {
  const day = i + 1;
  const weekday = (day - 1) % 7; // Nov 1 2026 is a Sunday
  const weekend = weekday === 0 || weekday === 6;
  const wave = Math.sin(day * 1.7) * 0.5 + Math.cos(day * 0.9) * 0.5; // steady, never random-looking
  const base = weekend ? 21000 : 46000;
  const total = base + wave * 6500 + day * 380; // grows through the month as plans mature
  const auto = total * (0.52 + day * 0.006); // the automated share keeps climbing
  return [Math.round(auto), Math.round(total - auto)];
});
const TODAY_START = 18420; // collected so far today, before the feed starts adding to it
const PAST_TOTAL = DAILY.slice(0, TODAY - 1).reduce((s, [a, b]) => s + a + b, 0);
const MAX_DAY = Math.max(...DAILY.map(([a, b]) => a + b));

type Kind = "payment" | "plan" | "reminder" | "retry" | "settled" | "routed";

type FeedEvent = {
  kind: Kind;
  title: string;
  detail: string;
  amount?: number; // dollars that land in today's collections
  value?: string; // what the row shows when it isn't money
};

// The loop the feed cycles through: mostly money, with the work that produces it in between
const EVENTS: FeedEvent[] = [
  { kind: "payment", title: "Payment received", detail: "Acct 4821 · text-to-pay link", amount: 1250 },
  { kind: "plan", title: "Payment plan agreed", detail: "Acct 7710 · over SMS, no agent", value: "$420/mo" },
  { kind: "retry", title: "Failed card retried", detail: "Acct 3092 · recovered", amount: 310 },
  { kind: "reminder", title: "Reminder batch sent", detail: "Within calling hours", value: "412 accts" },
  { kind: "settled", title: "Settled in full", detail: "Acct 6655 · offer accepted", amount: 2880 },
  { kind: "routed", title: "Dispute sent to an agent", detail: "Acct 1184 · outreach paused", value: "Paused" },
  { kind: "payment", title: "Payment received", detail: "Acct 2207 · client portal", amount: 640 },
  { kind: "plan", title: "Payment plan agreed", detail: "Acct 9034 · by email reply", value: "$180/mo" },
];

const ICONS: Record<Kind, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  payment: Banknote,
  plan: Handshake,
  retry: RefreshCw,
  reminder: Send,
  settled: Banknote,
  routed: UserRound,
};

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

type Row = FeedEvent & { id: number };

// What the feed shows before the first new event arrives (newest first): earlier accounts,
// so nothing on screen repeats when the loop starts
const SEED: Row[] = (
  [
    { kind: "payment", title: "Payment received", detail: "Acct 5560 · text-to-pay link", amount: 860 },
    { kind: "reminder", title: "Reminder batch sent", detail: "Within calling hours", value: "388 accts" },
    { kind: "plan", title: "Payment plan agreed", detail: "Acct 3318 · over SMS, no agent", value: "$250/mo" },
    { kind: "retry", title: "Failed card retried", detail: "Acct 8841 · recovered", amount: 195 },
    { kind: "settled", title: "Settled in full", detail: "Acct 2479 · offer accepted", amount: 1940 },
    { kind: "routed", title: "Cease request honored", detail: "Acct 6102 · outreach stopped", value: "Stopped" },
    { kind: "payment", title: "Payment received", detail: "Acct 7395 · client portal", amount: 525 },
  ] as FeedEvent[]
).map((e, i) => ({ ...e, id: -1 - i }));

/** Eases a displayed number toward its target, so totals roll instead of jumping. */
function useRolling(target: number, from: number, ms: number) {
  const [shown, setShown] = useState(from);
  const shownRef = useRef(from);
  useEffect(() => {
    const start = performance.now();
    const origin = shownRef.current;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const v = origin + (target - origin) * (1 - Math.pow(1 - t, 3));
      shownRef.current = v;
      setShown(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return shown;
}

function NavItem({
  icon: I,
  label,
  active,
  badge,
  trailing,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  active?: boolean;
  badge?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div
      className={`-mx-[7px] px-[7px] h-[24px] rounded-[6px] flex items-center justify-between ${
        active ? "bg-white/[0.16]" : ""
      }`}
    >
      <div className="flex items-center gap-[8px]">
        <span className={active ? "text-white" : "text-white/80"}>
          <I size={12} strokeWidth={2.1} />
        </span>
        <span
          className={`text-[10px] tracking-[-0.01em] ${active ? "font-medium text-white" : "text-white/85"}`}
        >
          {label}
        </span>
      </div>
      {badge && (
        <span className="h-[14px] min-w-[14px] px-[4px] rounded-[3.5px] bg-white/20 text-[7.5px] font-medium text-white flex items-center justify-center tabular-nums">
          {badge}
        </span>
      )}
      {trailing}
    </div>
  );
}

export default function DashboardPreview() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<Row[]>(SEED);
  const [today, setToday] = useState(TODAY_START);
  const [lastGain, setLastGain] = useState<{ id: number; amount: number } | null>(null);
  const reduce = usePrefersReducedMotion();
  const live = !reduce; // under reduced motion everything rests on its final state

  const collected = PAST_TOTAL + today;
  // On load the month total and KPIs count up once; after that only payments move them
  const shownTotal = useRolling(collected, collected * 0.93, 1400);
  const shownToday = useRolling(today, 0, 900);

  useEffect(() => {
    if (reduce) return;
    let next = 0;
    let id = 1;
    let onScreen = true;
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
    if (rootRef.current) io.observe(rootRef.current);

    const timer = window.setInterval(() => {
      if (!onScreen || document.hidden) return; // nobody watching: don't pile up events
      const ev = EVENTS[next];
      next = (next + 1) % EVENTS.length;
      const row = { ...ev, id: id++ };
      setRows((r) => [row, ...r].slice(0, FEED_ROWS));
      if (ev.amount) {
        const amount = ev.amount;
        setToday((t) => t + amount);
        setLastGain({ id: row.id, amount });
      }
    }, TICK_MS);

    return () => {
      window.clearInterval(timer);
      io.disconnect();
    };
  }, [reduce]);

  // Count-up for the KPIs, once on load
  const [kpi, setKpi] = useState(0);
  useEffect(() => {
    const ms = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      setKpi(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="relative flex w-full h-full rounded-t-[16px] overflow-hidden select-none"
      style={{
        boxShadow: "0 -8px 44px rgba(0, 0, 0, 0.045), 0 0 0 1px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Sidebar: frosted, as before; the nav now follows the money */}
      <aside
        className="relative w-[206px] shrink-0 h-full flex flex-col justify-between text-white overflow-hidden"
        style={{
          background:
            "radial-gradient(125% 95% at 12% 92%, rgba(22, 22, 18, 0.94) 0%, rgba(58, 58, 54, 0.88) 36%, rgba(132, 132, 130, 0.86) 72%, rgba(149, 149, 148, 0.88) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div>
          <div className="pt-[20px] px-[16px] flex items-center justify-between">
            <div className="flex items-center gap-[9px]">
              <div className="w-[27px] h-[27px] rounded-full bg-white flex items-center justify-center shadow-xs shrink-0">
                <img src="/JupitexLogos/tab-logo-light.png" alt="" className="w-[15px] h-[15px] object-contain" />
              </div>
              <div className="leading-tight">
                <div className="text-[10.5px] font-semibold text-white tracking-[-0.01em]">Jupitex Ops</div>
                <div className="text-[8px] font-normal text-white/60">Agency workspace</div>
              </div>
            </div>
            <span className="text-white/80">
              <PanelLeftClose size={12} strokeWidth={2} />
            </span>
          </div>

          <div className="mt-[17px] mx-[16px] h-[26px] rounded-[6px] bg-white/15 px-[7px] flex items-center justify-between">
            <div className="flex items-center gap-[6px] text-white/85">
              <Search size={10} strokeWidth={2.2} />
              <span className="text-[8px] font-medium">Find an account</span>
            </div>
            <span className="text-[7.5px] font-normal text-white/55">ctrl F</span>
          </div>

          <div className="mt-[14px] px-[16px] space-y-[3px]">
            <NavItem icon={LayoutGrid} label="Revenue" active />
            <NavItem icon={Users} label="Accounts" badge="18.9k" />
            <NavItem icon={CreditCard} label="Payments" />
            <NavItem
              icon={Zap}
              label="Automations"
              trailing={
                <span className="text-white/75">
                  <ChevronUp size={10} strokeWidth={2.2} />
                </span>
              }
            />

            {/* What is running right now; the feed on the right is these at work */}
            <div className="ml-[5.5px] pl-[13px] border-l border-white/25 space-y-[9px] py-[5px]">
              {[
                ["Payment reminders", true],
                ["Payment plans", true],
                ["Card retries", true],
                ["Dispute routing", true],
                ["Skip tracing", false],
              ].map(([label, on]) => (
                <div key={label as string} className="flex items-center justify-between pr-[1px]">
                  <span className={`text-[8.5px] leading-none ${on ? "text-white/85" : "text-white/45"}`}>
                    {label}
                  </span>
                  <span
                    className={`w-[5px] h-[5px] rounded-full ${on && live ? "dash-run" : ""}`}
                    style={{ background: on ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.3)" }}
                  />
                </div>
              ))}
            </div>

            <NavItem icon={ShieldCheck} label="Compliance" />
          </div>
        </div>

        <div className="px-[16px] pb-[18px]">
          <NavItem
            icon={FileText}
            label="Client reports"
            trailing={
              <span className="text-white/75">
                <ChevronDown size={10} strokeWidth={2.2} />
              </span>
            }
          />
          <div className="mt-[6px] pl-[20px] space-y-[7px]">
            <div className="text-[8.5px] font-normal text-white/75 leading-none">Remittance</div>
            <div className="text-[8.5px] font-normal text-white/45 leading-none">Month-end</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 bg-white h-full pt-[17px] px-[23px] flex flex-col relative min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[9px]">
            <div className="w-[30px] h-[30px] rounded-full bg-[#0a0a0a] flex items-center justify-center shrink-0">
              <img src="/JupitexLogos/tab-logo-dark.png" alt="" className="w-[16px] h-[16px] object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-[5px]">
                <span className="text-[8px] font-normal text-[#8e9296]">Collections</span>
                <span className="flex items-center gap-[3px] px-[5px] py-[1.5px] rounded-full bg-[#eef0ee] text-[#4d5249] text-[6.5px] font-semibold leading-none">
                  <span
                    className={`w-[3.5px] h-[3.5px] rounded-full ${live ? "dash-run" : ""}`}
                    style={{ background: ACCENT }}
                  />
                  Live
                </span>
              </div>
              <div className="text-[11px] font-semibold text-[#111111] tracking-[-0.015em] leading-[1.2] mt-[1px]">
                Revenue overview
              </div>
            </div>
          </div>

          <div className="flex items-center gap-[8px]">
            <div className="flex items-center gap-[6px] mr-[2px]">
              <div className="w-[24px] h-[13.5px] rounded-full bg-[#141414] p-[1.8px] flex items-center justify-end">
                <div className="w-[10px] h-[10px] rounded-full bg-white" />
              </div>
              <span className="text-[8.5px] font-medium text-[#1b1b1b]">Autopilot</span>
            </div>
            <div className="h-[24px] px-[10px] rounded-full border border-[#ededed] bg-[#fcfcfc] flex items-center gap-[5px] text-[8.5px] font-medium text-[#1b1b1b]">
              <span>November 2026</span>
              <ChevronDown size={9} strokeWidth={2.4} />
            </div>
            <div className="h-[24px] pl-[8px] pr-[5px] rounded-full border border-[#ededed] bg-[#f7f7f7] flex items-center gap-[6px] text-[#1b1b1b]">
              <Bell size={10} strokeWidth={2.2} />
              <span className="text-[8.5px] font-medium">Wed, 11 Nov</span>
              <span className="w-[15px] h-[15px] rounded-full bg-[#111111] text-white text-[7.5px] font-semibold flex items-center justify-center">
                3
              </span>
            </div>
          </div>
        </div>

        {/* The payoff: collected this month */}
        <div className="mt-[20px] pb-[15px] border-b border-[#f2f2f2] flex items-end justify-between">
          <div>
            <div className="text-[9.5px] font-medium tracking-[0.025em] text-[#888b8e] uppercase">
              Collected this month
            </div>
            <div className="mt-[5px] flex items-center">
              <span className="relative text-[32px] font-medium tracking-[-0.035em] text-[#0c0c0c] leading-none tabular-nums">
                {money(shownTotal)}
                {/* each payment floats up off the total as it lands */}
                {lastGain && (
                  <span
                    key={lastGain.id}
                    className="dash-gain absolute left-full top-0 ml-[8px] text-[10px] font-semibold tracking-[-0.01em] whitespace-nowrap"
                    style={{ color: ACCENT }}
                  >
                    +{money(lastGain.amount)}
                  </span>
                )}
              </span>
            </div>
            <div className="mt-[8px] flex items-center gap-[6px] text-[8.5px] text-[#8d9093]">
              <span className="h-[15px] px-[6px] rounded-full bg-[#92978e] text-white text-[7.5px] font-medium inline-flex items-center">
                +18.4% vs October
              </span>
              <span>
                <span className="text-[#1b1b1b] font-medium">61%</span> collected with no agent on the account
              </span>
            </div>
          </div>

          <div className="flex items-end gap-[22px] pb-[2px]">
            {[
              { label: "Recovery rate", value: `${(19.7 + 4.1 * kpi).toFixed(1)}%`, note: "+4.1 pts" },
              { label: "Promises to pay", value: Math.round(1942 * kpi).toLocaleString("en-US"), note: "87% kept" },
              { label: "Staff hours saved", value: Math.round(1240 * kpi).toLocaleString("en-US"), note: "this month" },
            ].map((k) => (
              <div key={k.label}>
                <div className="text-[7.5px] text-[#9fa2a5] leading-none">{k.label}</div>
                <div className="mt-[5px] text-[14px] font-medium tracking-[-0.025em] text-[#111111] leading-none tabular-nums">
                  {k.value}
                </div>
                <div className="mt-[4px] text-[7.5px] font-medium text-[#6f736c] leading-none">{k.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* The cause: automations at work, and the days they add up to */}
        <div className="mt-[14px] flex gap-[24px] flex-1 min-h-0">
          {/* Live feed */}
          <div className="w-[338px] shrink-0 flex flex-col min-h-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[6px]">
                <span className="text-[#888b87]">
                  <Zap size={10} strokeWidth={2.4} />
                </span>
                <span className="text-[9.5px] font-medium tracking-[0.025em] text-[#888b8e] uppercase">
                  Live automations
                </span>
              </div>
              <span className="text-[8px] text-[#9fa2a5]">
                <span className="text-[#1b1b1b] font-medium">4</span> running
              </span>
            </div>

            <div
              className="relative mt-[8px] flex-1 overflow-hidden"
              style={{
                maskImage: "linear-gradient(to bottom, #000 0%, #000 62%, transparent 96%)",
                WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 62%, transparent 96%)",
              }}
            >
              {rows.map((r, i) => {
                const I = ICONS[r.kind];
                const isMoney = r.amount !== undefined;
                const fresh = r.id > 0 && i === 0;
                return (
                  <div
                    key={r.id}
                    className="absolute inset-x-0 top-0 transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ transform: `translateY(${i * ROW_H}px)` }}
                  >
                    <div
                      className={`-mx-[8px] px-[8px] h-[33px] rounded-[8px] flex items-center gap-[9px] ${
                        fresh ? (isMoney ? "dash-in-money" : "dash-in") : ""
                      }`}
                    >
                      <span
                        className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: isMoney ? "#fff1e6" : "#f4f5f6",
                          color: isMoney ? ACCENT : "#3a3d40",
                        }}
                      >
                        <I size={11} strokeWidth={2.2} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[9px] font-medium text-[#141414] leading-[1.25] tracking-[-0.01em] truncate">
                          {r.title}
                        </div>
                        <div className="text-[7.5px] text-[#9a9da0] leading-[1.3] truncate">{r.detail}</div>
                      </div>
                      <div
                        className="text-[9px] font-medium tabular-nums shrink-0 tracking-[-0.01em]"
                        style={{ color: isMoney ? "#141414" : "#8d9093" }}
                      >
                        {isMoney ? `+${money(r.amount!)}` : r.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily collections */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-medium tracking-[0.025em] text-[#888b8e] uppercase">
                Daily
              </span>
              <div className="flex items-center gap-[8px] text-[7.5px] text-[#8d9093]">
                <span className="flex items-center gap-[3px]">
                  <span className="w-[6px] h-[6px] rounded-[1.5px] bg-[#8d9389]" />
                  Automated
                </span>
                <span className="flex items-center gap-[3px]">
                  <span className="w-[6px] h-[6px] rounded-[1.5px] bg-[#dfe1df]" />
                  Staff
                </span>
              </div>
            </div>

            <div className="mt-[8px] text-[8px] text-[#9a9da0] leading-none">
              Today <span className="text-[#141414] font-medium tabular-nums">{money(shownToday)}</span>
            </div>

            <div className="relative mt-[10px] h-[164px] flex items-end gap-[3px] border-b border-[#efefef]">
              {DAILY.map(([auto, staff], i) => {
                const day = i + 1;
                const isToday = day === TODAY;
                const future = day > TODAY;
                const H = 158;
                if (future) {
                  // the forecast: an outline of where the month is heading
                  return (
                    <div
                      key={day}
                      className="flex-1 rounded-t-[2px] border border-dashed border-b-0 border-[#e3e5e3]"
                      style={{ height: `${((auto + staff) / MAX_DAY) * H}px` }}
                    />
                  );
                }
                if (isToday) {
                  const autoToday = shownToday * 0.68;
                  const staffToday = shownToday - autoToday;
                  return (
                    <div key={day} className="flex-1 flex flex-col justify-end">
                      <div
                        className="rounded-t-[2px] transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{ height: `${(staffToday / MAX_DAY) * H}px`, background: "#ffd9bf" }}
                      />
                      <div
                        className="transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{ height: `${(autoToday / MAX_DAY) * H}px`, background: ACCENT }}
                      />
                    </div>
                  );
                }
                return (
                  <div
                    key={day}
                    className="flex-1 flex flex-col justify-end origin-bottom"
                    style={{
                      transform: `scaleY(${Math.max(0, Math.min(1, kpi * 1.6 - (i / TODAY) * 0.6))})`,
                    }}
                  >
                    <div
                      className="rounded-t-[2px] bg-[#dfe1df]"
                      style={{ height: `${(staff / MAX_DAY) * H}px` }}
                    />
                    <div className="bg-[#8d9389]" style={{ height: `${(auto / MAX_DAY) * H}px` }} />
                  </div>
                );
              })}
            </div>
            <div className="mt-[5px] flex justify-between text-[7px] text-[#a6a9ab]">
              <span>Nov 1</span>
              <span>Nov 30</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
