"use client";

import Image from "next/image";
import SectionWrapper from "@/components/SectionWrapper";
import AuditGrid from "@/components/audit/AuditGrid";
import { scrollToId } from "@/lib/site";

const LOGO_ORANGE = "#FF731E";

export default function AuditSection() {
  return (
    <>
      <SectionWrapper
        id="audit"
        ariaLabel="Free AI Automation Audit"
        subject="FREE AI AUTOMATION AUDIT"
        // The snap from the problems slides lands on this section's top, under the floating nav:
        // leave room for the nav, and keep the whole section to one screen on desktop
        className="min-h-screen !pt-[calc(84px*var(--ui))] sm:!pt-[calc(92px*var(--ui))] lg:!pt-[calc(76px*var(--ui))] lg:!pb-7"
        contentClassName="!mt-6 sm:!mt-7 lg:!mt-5"
        title={
          <>
            <span className="text-[#8e9296]">That is why we built</span>
            <span className="inline-flex items-center px-3.5 sm:px-4 py-1.5 rounded-[calc(16px*var(--ui))] bg-white border border-black/[0.07] shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
              <Image
                src="/JupitexLogos/nav_logo_light.png"
                alt="Jupitex"
                width={120}
                height={34}
                className="h-[calc(24px*var(--ui))] sm:h-[calc(30px*var(--ui))] lg:h-[calc(34px*var(--ui))] w-auto object-contain"
              />
            </span>
          </>
        }
        description={
          <span className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {["90 minutes of your time", "No access to your systems", "NDA first"].map((point) => (
              <span key={point} className="inline-flex items-center gap-2 whitespace-nowrap">
                <span
                  aria-hidden
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: LOGO_ORANGE }}
                />
                {point}
              </span>
            ))}
          </span>
        }
      >
        <div className="flex flex-col items-center text-center">
          <button
            type="button"
            onClick={() => scrollToId("contact")}
            className="group relative h-[calc(50px*var(--ui))] sm:h-[calc(52px*var(--ui))] lg:h-[calc(48px*var(--ui))] pl-[calc(11px*var(--ui))] pr-[calc(24px*var(--ui))] sm:pr-[calc(26px*var(--ui))] rounded-full bg-[#0a0a0a] text-white flex items-center gap-3 sm:gap-3.5 text-[0.9062rem] sm:text-[0.9375rem] font-medium tracking-[-0.01em] hover:bg-[#1a1a1a] active:scale-[0.97] transition-[background-color,transform] duration-200 shadow-[0_14px_34px_rgba(10,10,10,0.16)] cursor-pointer"
          >
            <span
              className="w-[calc(30px*var(--ui))] h-[calc(30px*var(--ui))] sm:w-[calc(32px*var(--ui))] sm:h-[calc(32px*var(--ui))] rounded-full flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:rotate-90"
              style={{ backgroundColor: LOGO_ORANGE }}
            >
              <svg width="13" height="13" viewBox="0 0 10 10" fill="none">
                <path
                  d="M5 1L6.1 3.9L9 5L6.1 6.1L5 9L3.9 6.1L1 5L3.9 3.9L5 1Z"
                  fill="#ffffff"
                />
              </svg>
            </span>
            <span>Book your free 90-minute audit</span>
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
        </div>

        <AuditGrid />
      </SectionWrapper>
    </>
  );
}
