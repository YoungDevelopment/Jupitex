"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { GRAIN, STAGE_LIGHT } from "@/lib/textures";

/**
 * Living backdrop for the workflow stage. Every workflow's light is stacked so a switch
 * crossfades. Blobs drift on their own; the pointer pulls them by depth and carries a
 * soft light of its own across the stage.
 */
export default function StageLight({
  active,
  order,
  className = "",
  children,
}: {
  active: string;
  order: string[];
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Pointer position, normalised to -0.5..0.5, eased so the light lags behind the hand
    const target = { x: 0, y: 0, h: 0, cx: 0, cy: 0 };
    const cur = { x: 0, y: 0, h: 0, cx: 0, cy: 0 };
    let raf = 0;

    const paint = () => {
      el.style.setProperty("--px", cur.x.toFixed(4));
      el.style.setProperty("--py", cur.y.toFixed(4));
      el.style.setProperty("--hover", cur.h.toFixed(3));
      el.style.setProperty("--cx", `${cur.cx.toFixed(1)}px`);
      el.style.setProperty("--cy", `${cur.cy.toFixed(1)}px`);
    };

    const tick = () => {
      let moving = false;
      for (const k of ["x", "y", "h", "cx", "cy"] as const) {
        const d = target[k] - cur[k];
        const ease = k === "cx" || k === "cy" ? 0.14 : 0.06;
        if (Math.abs(d) > (k === "cx" || k === "cy" ? 0.2 : 0.0005)) {
          cur[k] += d * ease;
          moving = true;
        } else cur[k] = target[k];
      }
      paint();
      raf = moving ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // the light is drawn in the element's own pixels; inside .site-scale those differ from screen pixels
      const k = el.offsetWidth / Math.max(1, r.width);
      const lx = (e.clientX - r.left) * k;
      const ly = (e.clientY - r.top) * k;
      if (target.h === 0) {
        // start the cursor light where the pointer entered, not where it last left
        cur.cx = lx;
        cur.cy = ly;
      }
      target.x = lx / Math.max(1, el.offsetWidth) - 0.5;
      target.y = ly / Math.max(1, el.offsetHeight) - 0.5;
      target.cx = lx;
      target.cy = ly;
      target.h = 1;
      kick();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      target.h = 0;
      kick();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={`jx-light relative isolate overflow-hidden ${className}`}>
      {order.map((id) => {
        const light = STAGE_LIGHT[id];
        const on = id === active;
        return (
          <div
            key={id}
            aria-hidden
            className="jx-light__layer pointer-events-none absolute -inset-[10%] -z-10 transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ opacity: on ? 1 : 0, background: light.base }}
            data-on={on || undefined}
          >
            {/* the second wash, lit from another side: crossfades in and out so the light turns */}
            <div className="jx-light__alt absolute inset-0" style={{ background: light.alt }} />
            {light.blobs.map((b, i) => (
              // outer: leans toward the pointer by depth · inner: drifts on its own path
              <div
                key={i}
                className="jx-light__lean absolute"
                style={
                  {
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    width: `${b.w}%`,
                    height: `${b.h}%`,
                    "--d": b.depth,
                  } as React.CSSProperties
                }
              >
                <div
                  className={`jx-light__blob jx-light__blob--${b.path}`}
                  style={{
                    background: `radial-gradient(closest-side, ${b.color}, transparent)`,
                    // drift on its path, and breathe (swell + brighten) on its own rhythm
                    animationDuration: `${b.dur}s, ${4.5 + ((i * 0.8) % 2)}s`,
                    animationDelay: `${-i * 3.7}s, ${-i * 1.7}s`,
                  }}
                />
              </div>
            ))}
            {/* the pointer's own light, tinted per workflow */}
            <div
              className="jx-light__cursor"
              style={{ "--glow": light.glow } as React.CSSProperties}
            />
          </div>
        );
      })}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14] mix-blend-overlay"
        style={GRAIN}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.25)]"
      />
      {children}
    </div>
  );
}
