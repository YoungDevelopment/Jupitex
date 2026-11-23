"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV_LINKS, scrollToId } from "@/lib/site";

const DROP = 44; // the droplet: the logo button (32px) plus the pill's 6px padding each side
const EXPAND_MS = 1000;

/** A damped spring as a CSS linear() easing, so the pill overshoots and settles like a liquid. */
function springEasing(damping = 0.5, samples = 64) {
  const end = Math.log(400) / damping; // time for the wobble to die out (unit frequency)
  const wd = Math.sqrt(1 - damping * damping);
  const pts: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * end;
    const x = 1 - Math.exp(-damping * t) * (Math.cos(wd * t) + (damping / wd) * Math.sin(wd * t));
    pts.push(x.toFixed(4));
  }
  pts[samples] = "1";
  return `linear(${pts.join(", ")})`;
}
const SPRING = springEasing(0.5);
const SPRING_FALLBACK = "cubic-bezier(0.34, 1.56, 0.64, 1)";

/**
 * The site nav: a pill that arrives on load as a droplet holding just the logo, splats, and
 * spreads into the full bar. Highlights the section currently on screen.
 */
export default function FloatingNav() {
  const [shown, setShown] = useState(false);
  const [visible, setVisible] = useState(false); // the droplet is on screen
  const [open, setOpen] = useState(false); // the droplet has spread into the bar
  const [activeId, setActiveId] = useState<string | null>(null);
  const [navW, setNavW] = useState(0);
  const [spring, setSpring] = useState(SPRING_FALLBACK);

  const dropRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let raf = 0;
    let isShown = false;
    const timers: number[] = [];
    const clearTimers = () => timers.splice(0).forEach((t) => window.clearTimeout(t));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsSpring = CSS.supports("transition-timing-function", SPRING);

    // Choreography: fall as a droplet → splat → spread into the bar. Reversed on the way out.
    const show = () => {
      clearTimers();
      setShown(true);
      setVisible(true);
      setSpring(supportsSpring ? SPRING : SPRING_FALLBACK);
      if (reduce) {
        setOpen(true);
        return;
      }
      // The fall: stretched tall while it drops, squashed flat on impact, wobbling back to round
      dropRef.current?.animate(
        [
          { transform: "translate3d(0,-120px,0) scale(0.72,1.3)", opacity: 0, easing: "cubic-bezier(0.55,0,0.9,0.55)" },
          { transform: "translate3d(0,-36px,0) scale(0.84,1.2)", opacity: 1, offset: 0.42, easing: "cubic-bezier(0.55,0,0.9,0.55)" },
          { transform: "translate3d(0,5px,0) scale(1.26,0.74)", offset: 0.66, easing: "cubic-bezier(0.2,0.8,0.3,1)" },
          { transform: "translate3d(0,-4px,0) scale(0.9,1.1)", offset: 0.8, easing: "ease-in-out" },
          { transform: "translate3d(0,1px,0) scale(1.05,0.96)", offset: 0.91, easing: "ease-in-out" },
          { transform: "translate3d(0,0,0) scale(1,1)", opacity: 1 },
        ],
        { duration: 820, fill: "backwards" }
      );
      // A teardrop while falling (narrow top, full bottom), round again by the moment it spreads.
      // Pixel radii, so the shape stays a pill once it starts to widen.
      bgRef.current?.animate(
        [
          { borderRadius: "22px 22px 22px 22px / 30px 30px 14px 14px" },
          { borderRadius: "22px 22px 22px 22px / 28px 28px 16px 16px", offset: 0.64 },
          { borderRadius: "22px 22px 22px 22px / 16px 16px 28px 28px", offset: 0.9 },
          { borderRadius: "22px" },
        ],
        { duration: 560, easing: "ease-out" }
      );
      // Spread at the moment of impact
      timers.push(window.setTimeout(() => setOpen(true), 560));
    };
    const hide = () => {
      clearTimers();
      setShown(false);
      setOpen(false);
      // Pull back into the droplet, then lift away
      timers.push(window.setTimeout(() => setVisible(false), reduce ? 0 : 380));
    };

    const update = () => {
      raf = 0;
      // This is the site's only nav, so it is up from the first screen (the hero included)
      const next = true;
      if (next !== isShown) {
        isShown = next;
        if (next) show();
        else hide();
      }

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
      clearTimers();
    };
  }, []);

  // The bar's natural width: the background pill grows to it
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const measure = () => setNavW(nav.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);


  const logoShift = open || !navW ? 0 : navW / 2 - DROP / 2;
  const width = open ? navW || "auto" : DROP;
  const tab = shown ? 0 : -1;

  // Links and the call to action arrive one after another as the bar spreads under them
  const itemStyle = (i: number): React.CSSProperties => ({
    opacity: open ? 1 : 0,
    transform: open ? "none" : "translate3d(0, 4px, 0) scale(0.96)",
    transition: open
      ? `opacity 380ms ease ${200 + i * 45}ms, transform 520ms cubic-bezier(0.22,1,0.36,1) ${200 + i * 45}ms`
      : "opacity 160ms ease, transform 200ms ease",
  });

  return (
    <div
      className="fixed top-3 sm:top-4 inset-x-0 z-40 flex justify-center px-3 pointer-events-none"
      aria-hidden={!shown}
    >
      <div
        ref={dropRef}
        className="site-scale relative transition-[opacity,transform] duration-300 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translate3d(0,-28px,0) scale(0.8)",
        }}
      >
        {/* The liquid: one pill that starts as a droplet and spreads, centred, to the bar's width */}
        <div
          ref={bgRef}
          aria-hidden
          className="absolute inset-y-0 left-1/2 rounded-full bg-white/80 backdrop-blur-xl border border-black/[0.07] shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
          style={{
            width,
            transform: "translateX(-50%)",
            transition: open ? `width ${EXPAND_MS}ms ${spring}` : "width 420ms cubic-bezier(0.5,0,0.2,1)",
          }}
        />

        <nav
          ref={navRef}
          aria-label="Sections"
          className="relative flex items-center gap-1 p-1.5"
          style={{ pointerEvents: shown && open ? "auto" : "none" }}
        >
          {/* The logo rides the droplet's centre out to its place at the start of the bar */}
          <button
            type="button"
            tabIndex={tab}
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="relative z-10 w-8 h-8 rounded-full bg-[#0a0a0a] flex items-center justify-center shrink-0 cursor-pointer active:scale-95"
            style={{
              transform: `translateX(${logoShift}px)`,
              transition: open
                ? `transform ${EXPAND_MS}ms ${spring}`
                : "transform 420ms cubic-bezier(0.5,0,0.2,1)",
              pointerEvents: shown ? "auto" : "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/JupitexLogos/tab-logo-dark.png" alt="" className="w-[17px] h-[17px] object-contain" />
          </button>

          <div className="hidden md:flex items-center">
            {NAV_LINKS.map((link, i) => {
              const isActive = activeId === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  tabIndex={tab}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(link.id);
                  }}
                  className={`px-3.5 h-8 rounded-full flex items-center text-[13px] font-medium tracking-[-0.01em] ${
                    isActive ? "bg-black/[0.06] text-[#090909]" : "text-[#686c70] hover:text-[#090909]"
                  }`}
                  style={itemStyle(i)}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <a
            href="#contact"
            tabIndex={tab}
            onClick={(e) => {
              e.preventDefault();
              scrollToId("contact");
            }}
            className="group h-8 pl-3.5 pr-3 rounded-full bg-[#0a0a0a] text-white flex items-center gap-2 text-[13px] font-medium tracking-[-0.01em] hover:bg-[#1e1e1e]"
            style={itemStyle(NAV_LINKS.length)}
          >
            <span>Book free audit</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF731E] transition-transform duration-300 group-hover:scale-150" />
          </a>
        </nav>
      </div>
    </div>
  );
}
