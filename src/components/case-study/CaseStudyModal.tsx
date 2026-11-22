"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Overlay for a case study opened from the homepage. Closing goes back in history, so the
 * browser's back button closes it too and the homepage stays where the visitor left it.
 */
export default function CaseStudyModal({
  titleId,
  children,
}: {
  titleId: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => router.back(), [router]);

  useEffect(() => {
    // Lock the page behind the modal, and give focus to the panel for keyboard and screen readers
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    const opener = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [close]);

  return (
    <div
      className="case-modal fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain bg-black/45 backdrop-blur-[3px] px-3 py-6 sm:px-6 sm:py-12"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="case-modal__panel relative w-full max-w-[860px] rounded-[24px] bg-background shadow-[0_30px_80px_rgba(0,0,0,0.25)] px-5 py-8 sm:px-10 sm:py-10 outline-none"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close case study"
          className="absolute right-4 top-4 sm:right-5 sm:top-5 w-9 h-9 rounded-full bg-white border border-black/[0.08] flex items-center justify-center text-[#0a0a0a] hover:bg-[#f4f4f4] transition-colors cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
