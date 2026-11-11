"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS, scrollToId } from "@/lib/site";

/**
 * A pill nav that drops in once the hero (which has its own nav) and the
 * full-screen problems slides have scrolled away.
 * Highlights the section currently on screen.
 */
export default function FloatingNav() {
  const [shown, setShown] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      // Stay out of the way through the hero and the full-screen problems slides
      setShown(window.scrollY > window.innerHeight * 1.5);

      // The active link is the last section whose top has passed the upper third of the screen
      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el && el.getBoundingClientRect().top <= line) current = link.id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="fixed top-3 sm:top-4 inset-x-0 z-40 flex justify-center px-3 pointer-events-none transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(-16px)",
      }}
      aria-hidden={!shown}
    >
      <nav
        aria-label="Sections"
        className="flex items-center gap-1 p-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-black/[0.07] shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
        style={{ pointerEvents: shown ? "auto" : "none" }}
      >
        <button
          type="button"
          tabIndex={shown ? 0 : -1}
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-8 h-8 rounded-full bg-[#0a0a0a] flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-transform duration-150"
        >
          <img src="/JupitexLogos/tab-logo-dark.png" alt="" className="w-[17px] h-[17px] object-contain" />
        </button>

        <div className="hidden md:flex items-center">
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                tabIndex={shown ? 0 : -1}
                aria-current={isActive ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(link.id);
                }}
                className={`px-3.5 h-8 rounded-full flex items-center text-[13px] font-medium tracking-[-0.01em] transition-colors duration-200 ${
                  isActive
                    ? "bg-black/[0.06] text-[#090909]"
                    : "text-[#686c70] hover:text-[#090909]"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        <a
          href="#contact"
          tabIndex={shown ? 0 : -1}
          onClick={(e) => {
            e.preventDefault();
            scrollToId("contact");
          }}
          className="group h-8 pl-3.5 pr-3 rounded-full bg-[#0a0a0a] text-white flex items-center gap-2 text-[13px] font-medium tracking-[-0.01em] hover:bg-[#1e1e1e] active:scale-[0.97] transition-[background-color,transform] duration-200"
        >
          <span>Book free audit</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF731E] transition-transform duration-300 group-hover:scale-150" />
        </a>
      </nav>
    </div>
  );
}
