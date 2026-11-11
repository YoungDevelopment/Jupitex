"use client";

import React, { useState } from "react";
import Image from "next/image";
import SectionWrapper from "@/components/SectionWrapper";
import { useSpotlight } from "@/lib/hooks";
import { scrollToId } from "@/lib/site";

const LOGO_ORANGE = "#FF731E";

export default function AuditSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const gridRef = useSpotlight<HTMLDivElement>();

  return (
    <>
      <SectionWrapper
        id="audit"
        ariaLabel="Free AI Automation Audit"
        subject="FREE AI AUTOMATION AUDIT"
        title={
          <>
            <span className="text-[#8e9296]">That is why we built</span>
            <span className="inline-flex items-center px-3.5 sm:px-4 py-1.5 rounded-[16px] bg-white border border-black/[0.07] shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
              <Image
                src="/JupitexLogos/nav_logo_light.png"
                alt="Jupitex"
                width={120}
                height={34}
                className="h-[24px] sm:h-[30px] lg:h-[34px] w-auto object-contain"
              />
            </span>
          </>
        }
        description={
          <>
            We&apos;ll look at how your agency runs and show you{" "}
            <span className="text-[#090909] font-medium">
              exactly what&apos;s worth automating
            </span>{" "}
            — and how much time and money each change saves.
          </>
        }
      >
        <div className="flex flex-col items-center text-center">
          <button
            type="button"
            onClick={() => scrollToId("contact")}
            className="group relative h-[50px] sm:h-[52px] pl-[11px] pr-[24px] sm:pr-[26px] rounded-full bg-[#0a0a0a] text-white flex items-center gap-3 sm:gap-3.5 text-[14.5px] sm:text-[15px] font-medium tracking-[-0.01em] hover:bg-[#1a1a1a] active:scale-[0.97] transition-[background-color,transform] duration-200 shadow-[0_14px_34px_rgba(10,10,10,0.16)] cursor-pointer"
          >
            <span
              className="w-[30px] h-[30px] sm:w-[32px] sm:h-[32px] rounded-full flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:rotate-90"
              style={{ backgroundColor: LOGO_ORANGE }}
            >
              <svg width="13" height="13" viewBox="0 0 10 10" fill="none">
                <path
                  d="M5 1L6.1 3.9L9 5L6.1 6.1L5 9L3.9 6.1L1 5L3.9 3.9L5 1Z"
                  fill="#ffffff"
                />
              </svg>
            </span>
            <span>Book your free AI audit</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Lead-in line: "How our AI audit looks like" */}
          <div className="mt-6 sm:mt-7 inline-flex items-center gap-3 text-[13.5px] sm:text-[15px] font-medium tracking-[-0.015em] text-[#090909]">
            <span className="w-6 sm:w-8 h-[1px] bg-black/15" />
            <span>What the audit looks like, step by step</span>
            <span className="w-6 sm:w-8 h-[1px] bg-black/15" />
          </div>
        </div>

        {/* =====================================================================
            2. RESPONSIVE BENTO GRID (ALL WHITE CARDS, 20PX RADIUS, SOFT SHADOW)
           ===================================================================== */}
        <div
          ref={gridRef}
          className="spot-group text-left w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6 mt-6 sm:mt-8"
        >
          {/* -------------------------------------------------------------------
              CARD 01: Scope with Business Owners
             ------------------------------------------------------------------- */}
          <div
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
            className="sm:col-span-1 lg:col-span-2 spot-card rounded-[20px] bg-card border border-black/[0.06] p-5 sm:p-6 lg:p-7 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300"
          >
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-full text-[12px] font-bold flex items-center justify-center transition-colors duration-300 shrink-0"
                  style={{
                    backgroundColor:
                      hoveredCard === 1 ? LOGO_ORANGE : "rgba(10,10,10,0.07)",
                    color: hoveredCard === 1 ? "#ffffff" : "#0a0a0a",
                  }}
                >
                  1
                </span>
                <h3 className="text-[16px] sm:text-[17px] font-semibold tracking-[-0.02em] text-[#090909]">
                  Scope with Owners
                </h3>
              </div>

              <p className="text-[14px] sm:text-[14.5px] leading-[1.6] text-[#5c6064]">
                Align with leadership on core goals, bottlenecks, and target outcomes.
              </p>
            </div>

            {/* Breathable Glanceable Illustration: Priority Alignment */}
            <div className="mt-6 pt-5 border-t border-black/[0.06] flex flex-col gap-2.5">
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#f8f9fa] border border-black/[0.05]">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ backgroundColor: LOGO_ORANGE }}
                >
                  ✓
                </span>
                <span className="text-[13px] font-medium text-[#121212]">
                  Cut manual compliance review
                </span>
              </div>

              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#f8f9fa] border border-black/[0.05]">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors duration-300"
                  style={{
                    backgroundColor:
                      hoveredCard === 1 ? LOGO_ORANGE : "rgba(10,10,10,0.08)",
                    color: hoveredCard === 1 ? "#ffffff" : "#0a0a0a",
                  }}
                >
                  ✓
                </span>
                <span className="text-[13px] font-medium text-[#121212]">
                  Save 15+ hrs every week
                </span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              CARD 02: Document & Build Flowcharts
             ------------------------------------------------------------------- */}
          <div
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
            className="sm:col-span-1 lg:col-span-2 spot-card rounded-[20px] bg-card border border-black/[0.06] p-5 sm:p-6 lg:p-7 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300"
          >
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-full text-[12px] font-bold flex items-center justify-center transition-colors duration-300 shrink-0"
                  style={{
                    backgroundColor:
                      hoveredCard === 2 ? LOGO_ORANGE : "rgba(10,10,10,0.07)",
                    color: hoveredCard === 2 ? "#ffffff" : "#0a0a0a",
                  }}
                >
                  2
                </span>
                <h3 className="text-[16px] sm:text-[17px] font-semibold tracking-[-0.02em] text-[#090909]">
                  Map Process Flowcharts
                </h3>
              </div>

              <p className="text-[14px] sm:text-[14.5px] leading-[1.6] text-[#5c6064]">
                Work with your team to turn daily operations into clear visual flowcharts.
              </p>
            </div>

            {/* Breathable Glanceable Illustration: 3-Node Visual Flowchart */}
            <div className="mt-6 pt-5 border-t border-black/[0.06]">
              <div
                className="rounded-xl bg-[#f8f9fa] border border-black/[0.05] px-3.5 sm:px-4 py-5 flex items-center justify-between gap-2"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(10,10,10,0.07) 1px, transparent 1px)",
                  backgroundSize: "12px 12px",
                }}
              >
                <div className="px-2.5 sm:px-3 py-2 rounded-lg bg-white border border-black/[0.07] text-[12px] font-medium text-[#121212] shrink-0">
                  Reply
                </div>

                <div className="flex-1 h-[1.5px] bg-black/15 relative flex items-center justify-center min-w-[12px]">
                  <span
                    className="wire-dot w-2 h-2 rounded-full"
                    style={{ backgroundColor: LOGO_ORANGE }}
                  />
                </div>

                <div
                  className="px-3 sm:px-3.5 py-2 rounded-lg text-[12px] font-semibold text-white shadow-xs shrink-0"
                  style={{ backgroundColor: LOGO_ORANGE }}
                >
                  AI QA
                </div>

                <div className="flex-1 h-[1.5px] bg-black/15 relative flex items-center justify-center min-w-[12px]">
                  <span className="wire-dot w-1.5 h-1.5 rounded-full bg-black/30" />
                </div>

                <div className="px-2.5 sm:px-3 py-2 rounded-lg bg-[#0a0a0a] text-[12px] font-medium text-white shrink-0">
                  Logged
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              CARD 03: Review Time, Cost & ROI
             ------------------------------------------------------------------- */}
          <div
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
            className="sm:col-span-1 lg:col-span-2 spot-card rounded-[20px] bg-card border border-black/[0.06] p-5 sm:p-6 lg:p-7 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300"
          >
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-full text-[12px] font-bold flex items-center justify-center transition-colors duration-300 shrink-0"
                  style={{
                    backgroundColor:
                      hoveredCard === 3 ? LOGO_ORANGE : "rgba(10,10,10,0.07)",
                    color: hoveredCard === 3 ? "#ffffff" : "#0a0a0a",
                  }}
                >
                  3
                </span>
                <h3 className="text-[16px] sm:text-[17px] font-semibold tracking-[-0.02em] text-[#090909]">
                  Evaluate Cost &amp; ROI
                </h3>
              </div>

              <p className="text-[14px] sm:text-[14.5px] leading-[1.6] text-[#5c6064]">
                See what is worth automating, how long it takes, and the exact ROI.
              </p>
            </div>

            {/* Breathable Glanceable Illustration: Visual Before vs After Bar */}
            <div className="mt-6 pt-5 border-t border-black/[0.06] space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[12px] text-[#7c7f82]">
                  <span>Manual Process</span>
                  <span>14 hrs / wk</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/[0.08]" />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[12.5px] font-semibold">
                  <span className="text-[#090909]">Automated</span>
                  <span style={{ color: LOGO_ORANGE }}>10 mins · 4.8x ROI</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: hoveredCard === 3 ? "22%" : "16%",
                      backgroundColor: LOGO_ORANGE,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              CARD 04: Review with the team and make adjustments
             ------------------------------------------------------------------- */}
          <div
            onMouseEnter={() => setHoveredCard(4)}
            onMouseLeave={() => setHoveredCard(null)}
            className="sm:col-span-1 lg:col-span-3 spot-card rounded-[20px] bg-card border border-black/[0.06] p-5 sm:p-6 lg:p-7 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300"
          >
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-full text-[12px] font-bold flex items-center justify-center transition-colors duration-300 shrink-0"
                  style={{
                    backgroundColor:
                      hoveredCard === 4 ? LOGO_ORANGE : "rgba(10,10,10,0.07)",
                    color: hoveredCard === 4 ? "#ffffff" : "#0a0a0a",
                  }}
                >
                  4
                </span>
                <h3 className="text-[16px] sm:text-[17px] font-semibold tracking-[-0.02em] text-[#090909]">
                  Review &amp; Refine with Your Team
                </h3>
              </div>

              <p className="text-[14px] sm:text-[14.5px] leading-[1.6] text-[#5c6064]">
                Walk through the findings with your team and adjust workflows to fit how they work.
              </p>
            </div>

            {/* Breathable Read-Only Illustration: Team Feedback Applied */}
            <div className="mt-6 pt-5 border-t border-black/[0.06]">
              <div className="rounded-xl bg-[#f8f9fa] border border-black/[0.05] px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-black/[0.06] text-[11px] font-semibold text-[#55585c]">
                    Team Note
                  </span>
                  <span className="text-[13px] font-medium text-[#121212]">
                    &ldquo;Keep manager sign-off before sending&rdquo;
                  </span>
                </div>

                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-semibold text-white shrink-0"
                  style={{ backgroundColor: LOGO_ORANGE }}
                >
                  <span>✓</span>
                  <span>Adjusted</span>
                </span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              CARD 05: Meet with Stakeholders & Team (Final Presentation)
             ------------------------------------------------------------------- */}
          <div
            onMouseEnter={() => setHoveredCard(5)}
            onMouseLeave={() => setHoveredCard(null)}
            className="sm:col-span-2 lg:col-span-3 spot-card rounded-[20px] bg-card border border-black/[0.06] p-5 sm:p-6 lg:p-7 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300"
          >
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-full text-[12px] font-bold flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: LOGO_ORANGE }}
                  >
                    5
                  </span>
                  <h3 className="text-[16px] sm:text-[17px] font-semibold tracking-[-0.02em] text-[#090909]">
                    Stakeholder &amp; Team Presentation
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#f7f8f9] border border-black/[0.06] text-[11px] font-semibold text-[#090909] shrink-0">
                  Final Roadmap
                </span>
              </div>

              <p className="text-[14px] sm:text-[14.5px] leading-[1.6] text-[#5c6064]">
                Present everything that can be automated, the fixed build cost, and your projected ROI.
              </p>
            </div>

            {/* Breathable Glanceable Illustration: 3 Clear Outcomes */}
            <div className="mt-6 pt-5 border-t border-black/[0.06] grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
              <div className="rounded-xl bg-[#f8f9fa] border border-black/[0.05] py-3 px-2">
                <div className="text-[11px] text-[#7c7f82]">Automations</div>
                <div className="text-[13px] sm:text-[14.5px] font-semibold text-[#090909] mt-1">
                  6 Workflows
                </div>
              </div>

              <div className="rounded-xl bg-[#f8f9fa] border border-black/[0.05] py-3 px-2">
                <div className="text-[11px] text-[#7c7f82]">Total Cost</div>
                <div className="text-[13px] sm:text-[14.5px] font-semibold text-[#090909] mt-1">
                  Fixed Quote
                </div>
              </div>

              <div
                className="rounded-xl border py-3 px-2"
                style={{
                  backgroundColor: "rgba(255, 115, 30, 0.06)",
                  borderColor: "rgba(255, 115, 30, 0.22)",
                }}
              >
                <div className="text-[11px] text-[#5c6064]">Expected ROI</div>
                <div
                  className="text-[13px] sm:text-[14.5px] font-semibold mt-1"
                  style={{ color: LOGO_ORANGE }}
                >
                  +$64k / yr
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
