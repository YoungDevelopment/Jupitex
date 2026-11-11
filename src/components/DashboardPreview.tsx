"use client";

import React, { useEffect, useState } from "react";

/**
 * Hero product preview: what an agency's operations look like once the
 * repetitive work is automated. All figures are illustrative sample data.
 */

const REVIEWED = 48216;
const SMS = 27904;
const EMAIL = 20312;
const ROUTED = 1187;

const CLEARED_BARS = 47;
const ROUTED_BARS = 36;
const TOTAL_BARS = CLEARED_BARS + ROUTED_BARS;

const SCHEDULE = [
  { day: "Monday, Nov 9 2026", upper: false, accounts: "1,204 accts", reports: "14 sent" },
  { day: "TUESDAY, NOV 10 2026", upper: true, accounts: "862 accts", reports: "14 sent" },
  { day: "Wednesday, Nov 11 2026", upper: false, accounts: "1,530 accts", reports: "15 sent" },
  { day: "THURSDAY, NOV 12 2026", upper: true, accounts: "Queued", reports: "Queued" },
];

const chevron = (
  <svg width="9" height="9" viewBox="0 0 10 10" fill="none" className="text-white/80" aria-hidden>
    <path
      d="M2 6.5L5 3.5L8 6.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function Stat({
  value,
  label,
  note,
  icon,
}: {
  value: number;
  label: string;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-[7px]">
      <div className="w-[22px] h-[22px] rounded-full bg-[#f4f5f6] flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-[4px]">
          <span className="text-[13px] font-medium text-[#111111] tracking-[-0.02em] leading-none tabular-nums">
            {value.toLocaleString("en-US")}
          </span>
          <span className="px-[4px] py-[1px] rounded-full bg-[#b0b5ad] text-white text-[5.5px] font-semibold leading-none">
            {note}
          </span>
        </div>
        <div className="text-[7.5px] text-[#9fa2a5] mt-[2px] leading-none">{label}</div>
      </div>
    </div>
  );
}

export default function DashboardPreview() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    // Reduced motion: land on the final numbers in a single frame
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 1500;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const count = (from: number, to: number) => Math.round(from + (to - from) * progress);

  return (
    <div
      aria-hidden
      className="relative flex w-full h-full rounded-t-[16px] overflow-hidden select-none"
      style={{
        boxShadow: "0 -8px 44px rgba(0, 0, 0, 0.045), 0 0 0 1px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Left Frosted Grey Sidebar (206px out of 878px) */}
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
          {/* Top Brand Row */}
          <div className="pt-[20px] px-[16px] flex items-center justify-between">
            <div className="flex items-center gap-[9px]">
              <div className="w-[27px] h-[27px] rounded-full bg-white flex items-center justify-center shadow-xs shrink-0">
                <img src="/JupitexLogos/tab-logo-light.png" alt="" className="w-[15px] h-[15px] object-contain" />
              </div>
              <div className="leading-tight">
                <div className="text-[10.5px] font-semibold text-white tracking-[-0.01em]">
                  Jupitex Ops
                </div>
                <div className="text-[8px] font-normal text-white/60">Agency workspace</div>
              </div>
            </div>

            <div className="w-[14px] h-[13px] rounded-[3px] bg-white/90 flex items-center justify-center">
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <rect x="1.5" y="1.5" width="1.3" height="7" rx="0.5" fill="#555" />
                <path
                  d="M6.5 3.2L4.5 5L6.5 6.8"
                  stroke="#555"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Search Input */}
          <div className="mt-[17px] mx-[16px] h-[26px] rounded-[6px] bg-white/15 px-[6px] flex items-center justify-between">
            <div className="flex items-center gap-[6px]">
              <div className="w-[15px] h-[15px] rounded-[3.5px] bg-white flex items-center justify-center">
                <svg width="8.5" height="8.5" viewBox="0 0 12 12" fill="none">
                  <circle cx="5.2" cy="5.2" r="3.4" stroke="#141414" strokeWidth="1.5" />
                  <path d="M7.8 7.8L10.2 10.2" stroke="#141414" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[7.5px] font-medium text-white/85">Find an account</span>
            </div>
            <span className="text-[7px] font-normal text-white/55 pr-[2px]">ctrl + F</span>
          </div>

          {/* Main Navigation */}
          <div className="mt-[16px] px-[16px] space-y-[9px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <rect x="1.5" y="1.5" width="4.5" height="4.5" rx="1" fill="white" />
                  <rect x="8" y="1.5" width="4.5" height="4.5" rx="1" fill="white" />
                  <rect x="1.5" y="8" width="4.5" height="4.5" rx="1" fill="white" />
                  <rect x="8" y="8" width="4.5" height="4.5" rx="1" fill="white" />
                </svg>
                <span className="text-[10px] font-medium text-white tracking-[-0.01em]">Overview</span>
              </div>
              <span className="w-[14px] h-[14px] rounded-[3.5px] bg-white/22 text-[8px] font-medium text-white flex items-center justify-center">
                2
              </span>
            </div>

            <div className="flex items-center gap-[8px]">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L12 3.4V6.8C12 9.6 9.9 11.8 7 12.6C4.1 11.8 2 9.6 2 6.8V3.4L7 1.5Z" fill="white" />
                <path d="M4.9 7L6.4 8.5L9.2 5.6" stroke="#777" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[10px] font-normal text-white/85 tracking-[-0.01em]">Compliance QA</span>
            </div>

            <div className="flex items-center gap-[8px]">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M4.8 4.2V3.4C4.8 2.5 5.5 1.8 6.4 1.8H7.6C8.5 1.8 9.2 2.5 9.2 3.4V4.2" stroke="white" strokeWidth="1.2" />
                <rect x="2" y="4.2" width="10" height="7.8" rx="1.8" fill="white" />
                <circle cx="7" cy="7.8" r="1" fill="#888" />
              </svg>
              <span className="text-[10px] font-normal text-white/85 tracking-[-0.01em]">Placements</span>
            </div>

            {/* Automations tree */}
            <div className="pt-[1px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.4" fill="white" />
                    <path d="M7.4 3.8L4.8 7.3H6.9L6.5 10.2L9.2 6.7H7.1L7.4 3.8Z" fill="#777" />
                  </svg>
                  <span className="text-[10px] font-medium text-white tracking-[-0.01em]">Automations</span>
                </div>
                <span className="mr-[1px]">{chevron}</span>
              </div>

              <div className="mt-[9px] ml-[5.5px] pl-[13px] border-l border-white/25 space-y-[8px]">
                <div className="text-[8.5px] font-normal text-white/85 leading-none">Message review</div>
                <div className="text-[8.5px] font-normal text-white/85 leading-none">Payment follow-up</div>

                <div>
                  <div className="flex items-center justify-between pr-[22px]">
                    <span className="text-[8.5px] font-medium text-white leading-none">Disputes</span>
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" className="text-white/75">
                      <path d="M2 6.5L5 3.5L8 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <div className="mt-[7px] ml-[2px] pl-[10px] border-l border-white/25 space-y-[7px]">
                    {["Awaiting approval", "Paused accounts", "Validation packets", "Sent this week"].map(
                      (label, i) => (
                        <div key={label} className="relative flex items-center justify-between">
                          <span className="absolute -left-[10px] top-1/2 w-[7px] h-[1px] bg-white/25" />
                          <span className="text-[8px] font-normal text-white/60 leading-none">{label}</span>
                          {i === 0 && (
                            <span className="w-[14px] h-[14px] rounded-[3.5px] bg-white/18 text-[7.5px] font-medium text-white/85 flex items-center justify-center">
                              4
                            </span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Client Reports Section */}
        <div className="px-[16px] pb-[18px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[8px]">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="3" width="7.5" height="9" rx="1.4" fill="white" fillOpacity="0.85" />
                <rect x="4.5" y="1.8" width="7.5" height="9" rx="1.4" fill="white" />
                <path d="M6.2 4.5H10.2M6.2 6.5H10.2M6.2 8.5H8.5" stroke="#555" strokeWidth="1" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] font-medium text-white tracking-[-0.01em]">Client reports</span>
            </div>
            <span className="mr-[16px]">{chevron}</span>
          </div>

          <div className="mt-[8px] pl-[20px] space-y-[7px]">
            <div className="text-[8.5px] font-normal text-white/75 leading-none">Remittance</div>
            <div className="text-[8.5px] font-normal text-white/45 leading-none">Month-end</div>
          </div>
        </div>
      </aside>

      {/* Right White Main Content Area (672px out of 878px) */}
      <div className="flex-1 bg-white h-full pt-[17px] px-[23px] flex flex-col justify-between relative">
        <div>
          {/* Row 1: Workspace & Top Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[9px]">
              <div className="w-[30px] h-[30px] rounded-full bg-[#0a0a0a] flex items-center justify-center shrink-0">
                <img src="/JupitexLogos/tab-logo-dark.png" alt="" className="w-[16px] h-[16px] object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-[5px]">
                  <span className="text-[8px] font-normal text-[#8e9296]">Compliance desk</span>
                  <span className="flex items-center gap-[3px] px-[5px] py-[1.5px] rounded-full bg-[#eef0ee] text-[#4d5249] text-[6px] font-semibold leading-none">
                    <span className="w-[3.5px] h-[3.5px] rounded-full bg-[#FF731E]" />
                    Live
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-[#111111] tracking-[-0.015em] leading-[1.2] mt-[1px]">
                  Message review
                </div>
              </div>
            </div>

            <div className="flex items-center gap-[8px]">
              <div className="flex items-center gap-[6px] mr-[2px]">
                <div className="w-[24px] h-[13.5px] rounded-full bg-[#141414] p-[1.8px] flex items-center justify-end">
                  <div className="w-[10px] h-[10px] rounded-full bg-white flex items-center justify-center">
                    <div className="w-[2.5px] h-[2.5px] rounded-full bg-[#141414]" />
                  </div>
                </div>
                <span className="text-[8.5px] font-medium text-[#1b1b1b]">Auto-route</span>
              </div>

              <div className="h-[24px] px-[10px] rounded-full border border-[#ededed] bg-[#fcfcfc] flex items-center gap-[5px] text-[8.5px] font-medium text-[#1b1b1b]">
                <span>Nov 1 - Nov 30, 2026</span>
                <svg width="6" height="4" viewBox="0 0 6 4" fill="none">
                  <path d="M0.5 0.5L3 3.2L5.5 0.5H0.5Z" fill="#1b1b1b" />
                </svg>
              </div>

              <div className="h-[24px] pl-[8px] pr-[5px] rounded-full border border-[#ededed] bg-[#f7f7f7] flex items-center gap-[6px]">
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2C4.8 2 3.5 3.5 3.5 5.6V8.2L2.3 9.6H11.7L10.5 8.2V5.6C10.5 3.5 9.2 2 7 2Z" stroke="#222" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M5.6 11.2C5.9 11.7 6.4 12 7 12C7.6 12 8.1 11.7 8.4 11.2" stroke="#222" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <span className="text-[8.5px] font-medium text-[#1b1b1b]">Wed, 11 Nov</span>
                <span className="w-[15px] h-[15px] rounded-full bg-[#111111] text-white text-[7.5px] font-semibold flex items-center justify-center">
                  4
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Messages reviewed */}
          <div className="mt-[22px] pb-[14px] border-b border-[#f2f2f2]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[5px]">
                <svg width="9" height="11" viewBox="0 0 10 12" fill="none">
                  <path d="M5.6 0.5L1.2 6.5H5.0L4.4 11.5L8.8 5.5H5.0L5.6 0.5Z" fill="#888b87" />
                </svg>
                <span className="text-[9.5px] font-medium tracking-[0.025em] text-[#888b8e] uppercase">
                  Consumer replies reviewed
                </span>
              </div>

              <div className="flex items-center gap-[7px] text-[8.5px] font-medium pr-[2px]">
                <span className="text-[#9fa2a5]">D</span>
                <span className="text-[#9fa2a5]">W</span>
                <span className="text-[#111111] font-semibold">M</span>
                <span className="text-[#e2e4e6] font-light">|</span>
                <span className="text-[#9fa2a5]">All</span>
              </div>
            </div>

            <div className="mt-[3px] flex items-baseline justify-between">
              <div className="flex items-baseline">
                <span className="text-[31.5px] font-medium tracking-[-0.03em] text-[#0c0c0c] leading-none tabular-nums">
                  {count(46950, REVIEWED).toLocaleString("en-US")}
                </span>

                <span className="ml-[8px] h-[15.5px] px-[6px] rounded-full bg-[#92978e] text-white text-[7.5px] font-medium inline-flex items-center gap-[2.5px] self-center translate-y-[2px]">
                  <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                    <path d="M1.2 4.2L3.1 6L6.8 2" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Every reply read
                </span>

                <span className="ml-[4px] h-[15.5px] px-[6px] rounded-full bg-[#a2a79e] text-white text-[7.5px] font-medium inline-flex items-center self-center translate-y-[2px]">
                  0 skipped
                </span>
              </div>

              <div className="text-[9.5px] text-[#8d9093] font-normal">
                before automation: a 5% manual sample
              </div>
            </div>
          </div>

          {/* Row 3: Channel breakdown */}
          <div className="mt-[14px] flex items-center justify-between">
            <div className="flex items-center gap-[20px]">
              <Stat
                value={count(1389, SMS)}
                label="SMS replies"
                note="58%"
                icon={
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.6C2 2.7 2.7 2 3.6 2H10.4C11.3 2 12 2.7 12 3.6V8.4C12 9.3 11.3 10 10.4 10H6.2L3.6 12V10C2.7 10 2 9.3 2 8.4V3.6Z" fill="#141414" />
                  </svg>
                }
              />
              <Stat
                value={count(1140, EMAIL)}
                label="Email replies"
                note="42%"
                icon={
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <rect x="1.8" y="3" width="10.4" height="8" rx="1.6" fill="#141414" />
                    <path d="M3 4.6L7 7.6L11 4.6" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              />
              <Stat
                value={count(40, ROUTED)}
                label="Routed to a person"
                note="2.5%"
                icon={
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="4.6" r="2.4" fill="#141414" />
                    <path d="M2.6 12C2.9 9.7 4.7 8.2 7 8.2C9.3 8.2 11.1 9.7 11.4 12H2.6Z" fill="#141414" />
                  </svg>
                }
              />
            </div>

            <div className="flex items-center gap-[9px] text-[8.5px] font-medium text-[#1e1e1e] pr-[4px]">
              <span>median review 1.8s</span>
              <span className="text-[#e8e8e8]">|</span>
              <span>audit trail on</span>
            </div>
          </div>

          {/* Row 4: Fine Vertical Bar Chart */}
          <div className="mt-[18px] relative">
            <div className="flex items-start">
              <div className="relative flex flex-col">
                <div className="flex items-end h-[64px] gap-[2.6px] border-b border-[#f4f4f4]">
                  <div className="w-[1px] h-[64px] bg-[#dcdedc] shrink-0" />
                  {Array.from({ length: CLEARED_BARS }).map((_, i) => {
                    const threshold = i / TOTAL_BARS;
                    const p = Math.max(0, Math.min(1, (progress - threshold * 0.7) / 0.3));
                    return (
                      <div
                        key={`c-${i}`}
                        className="w-[1.25px] h-[64px] bg-[#e1e3e1] shrink-0 origin-bottom"
                        style={{ transform: `scaleY(${p})` }}
                      />
                    );
                  })}
                </div>
                <div className="relative h-[38px] border-l border-[#dcdedc] pl-[9px] pt-[12px]">
                  <div className="text-[6.8px] font-medium text-[#333333] leading-[1.35]">
                    Cleared automatically
                  </div>
                  <div className="text-[6.8px] font-normal text-[#8e9194] leading-[1.35]">47,029</div>
                </div>
              </div>

              <div className="relative flex flex-col ml-[2.6px]">
                <div className="flex items-end h-[64px] gap-[2.6px] border-b border-[#f4f4f4]">
                  <div className="w-[1.25px] h-[64px] bg-[#888e84] shrink-0" />
                  {Array.from({ length: ROUTED_BARS }).map((_, i) => {
                    // First 19 bars are full height; the rest curve down
                    let target = 64;
                    if (i >= 19) {
                      const t = (i - 19) / (ROUTED_BARS - 19);
                      target = Math.max(5, 64 * Math.pow(Math.cos(t * (Math.PI / 2)), 1.35));
                    }
                    const threshold = (CLEARED_BARS + i) / TOTAL_BARS;
                    const p = Math.max(0, Math.min(1, (progress - threshold * 0.75) / 0.25));
                    return (
                      <div
                        key={`r-${i}`}
                        className="w-[1.25px] bg-[#8d9389] shrink-0 origin-bottom"
                        style={{ height: `${target.toFixed(2)}px`, transform: `scaleY(${p})` }}
                      />
                    );
                  })}
                </div>
                <div className="relative h-[38px] border-l-[1.25px] border-[#888e84] pl-[9px] pt-[12px]">
                  <div className="text-[6.8px] font-medium text-[#333333] leading-[1.35]">
                    Opt-outs, disputes and cease requests
                  </div>
                  <div className="text-[6.8px] font-normal text-[#8e9194] leading-[1.35]">1,187</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 5: Scheduled automations */}
        <div className="pt-[10px] pb-[14px] border-t border-[#f4f4f4] grid grid-cols-4 gap-[22px]">
          {SCHEDULE.map((col) => (
            <div key={col.day}>
              <div
                className={`text-[7.5px] font-normal text-[#b0b3b5] ${
                  col.upper ? "tracking-[0.01em]" : "tracking-[-0.01em]"
                }`}
              >
                {col.day}
              </div>
              {[
                { title: "Placement import", time: "7 AM", value: col.accounts },
                { title: "Client remittance", time: "6 PM", value: col.reports },
              ].map((row, i) => (
                <div
                  key={row.title}
                  className={`${i === 0 ? "mt-[10px]" : "mt-[8px]"} flex items-baseline justify-between`}
                >
                  <div>
                    <div className="text-[8.5px] font-medium text-[#1b1b1b] leading-none">{row.title}</div>
                    <div className="text-[6.8px] text-[#b5b8ba] mt-[3px] leading-none">{row.time}</div>
                  </div>
                  <div className="text-[8.5px] font-medium text-[#1b1b1b] tabular-nums">{row.value}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
