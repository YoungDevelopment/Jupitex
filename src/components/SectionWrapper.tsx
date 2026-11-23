"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const ACCENT = "#FF731E";

export interface SectionWrapperProps {
  id: string;
  ariaLabel: string;
  subject?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  background?: ReactNode;
  className?: string;
  containerClassName?: string;
  contentClassName?: string;
  /** Blur-fade the content in with the heading (default). Off when the content has its own entrance. */
  revealContent?: boolean;
}

export default function SectionWrapper({
  id,
  ariaLabel,
  subject,
  eyebrow,
  title,
  description,
  children,
  background,
  className,
  containerClassName,
  contentClassName,
  revealContent = true,
}: SectionWrapperProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const resolvedSubject = subject ?? eyebrow;
  const reveal = {
    opacity: isVisible ? 1 : 0,
    filter: isVisible ? "none" : "blur(10px)",
    transform: isVisible ? "none" : "translateY(14px)",
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label={ariaLabel}
      className={cn(
        // One rhythm for every section: the same side gutters and the same top/bottom space,
        // so the gap between any two sections (and before the footer) is identical.
        // Sections size to their content; full-screen ones opt in with min-h-screen.
        "relative w-full overflow-hidden bg-background select-none flex flex-col items-center justify-start px-5 sm:px-8 lg:px-14 py-16 sm:py-20",
        className
      )}
    >
      {background}

      <div
        className={cn(
          "relative z-10 w-full max-w-[1140px] mx-auto flex flex-col items-center transition-all duration-700",
          containerClassName
        )}
        style={revealContent ? reveal : undefined}
      >
        <header
          className={cn("flex flex-col items-center text-center", !revealContent && "transition-all duration-700")}
          style={revealContent ? undefined : reveal}
        >
          {resolvedSubject && (
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 border border-black/[0.06] text-[11px] sm:text-[11.5px] font-semibold tracking-[0.06em] text-[#0a0a0a] uppercase shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: ACCENT }}
              />
              <span>{resolvedSubject}</span>
            </div>
          )}

          <h2 className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-3.5 gap-y-2 text-[clamp(1.85rem,4vw,3.1rem)] font-medium tracking-[-0.038em] leading-[1.14] text-[#0a0a0a]">
            {title}
          </h2>

          {description && (
            <p className="mt-3.5 sm:mt-4 max-w-[650px] text-[15px] sm:text-[16.5px] font-normal leading-[1.6] tracking-[-0.01em] text-[#55585c] px-2">
              {description}
            </p>
          )}
        </header>

        {children && (
          <div className={cn("mt-8 sm:mt-10 lg:mt-12 w-full", contentClassName)}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
