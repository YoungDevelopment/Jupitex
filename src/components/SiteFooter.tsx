"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { CONTACT_EMAIL, NAV_LINKS, scrollToId } from "@/lib/site";

/**
 * The footer is one composition: a centred column that sits down in the open sky of the
 * shoreline, framed by the two rock clusters, with the copyright resting just above the water.
 */
export default function SiteFooter() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Zoom-out reveal: the shoreline starts close and pulled in, then widens to the full scene
  // as the footer scrolls in, finishing exactly when the page reaches its end.
  useEffect(() => {
    const scene = sceneRef.current;
    const img = imgRef.current;
    if (!scene || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ZOOM = 1.5; // how close the scene starts
    let target = 0;
    let current = -1;
    let raf = 0;

    const measure = () => {
      const r = scene.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 as the scene's top edge comes into view, 1 when the page bottom is reached.
      // On short pages, where it can never scroll fully into view, finish at the end of the page.
      const remaining = document.documentElement.scrollHeight - vh - window.scrollY;
      const travel = Math.max(1, r.height);
      const p = (vh - r.top) / travel;
      target = remaining <= 1 ? 1 : Math.min(1, Math.max(0, p));
    };

    const paint = (p: number) => {
      // ease-out quad: the zoom leads, then settles gently into the full scene
      const e = 1 - Math.pow(1 - p, 2);
      const scale = ZOOM - (ZOOM - 1) * e;
      const lift = (1 - e) * 6; // a touch lower while close, so the water leads
      img.style.transform = `translate3d(0, ${lift.toFixed(2)}%, 0) scale(${scale.toFixed(4)})`;
      img.style.opacity = `${Math.min(1, p * 2.2).toFixed(3)}`;
    };

    const tick = () => {
      const d = target - current;
      if (Math.abs(d) > 0.0005) {
        current += d * 0.12;
        paint(current);
        raf = requestAnimationFrame(tick);
      } else {
        current = target;
        paint(current);
        raf = 0;
      }
    };

    const onScroll = () => {
      measure();
      // far from the footer the target sits at 0: nothing to repaint
      if (!raf && target !== current) raf = requestAnimationFrame(tick);
    };

    measure();
    current = target; // no fly-in on load if the footer is already on screen
    paint(current);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const linkClass =
    "text-[0.875rem] text-[#3d4044] hover:text-[#090909] transition-colors duration-200";

  const backToTop = (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group inline-flex items-center gap-1.5 hover:text-[#090909] transition-colors duration-200 cursor-pointer"
    >
      <span>Back to top</span>
      <span className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
    </button>
  );

  return (
    <footer className="relative w-full overflow-hidden bg-background">
      {/* ── Centred column, sinking into the sky of the scene below ── */}
      {/* No top padding: the last section's bottom space is the gap, same as between sections */}
      <div className="relative z-10 px-5 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1140px] border-t border-black/[0.08] pt-14 sm:pt-16 flex flex-col items-center text-center">
          <Image
            src="/JupitexLogos/nav_logo_light.png"
            alt="Jupitex"
            width={240}
            height={72}
            className="h-[28px] w-auto object-contain"
          />
          <p className="mt-4 max-w-[400px] text-[0.875rem] leading-[1.6] text-[#686c70]">
            AI and automation for debt collection agencies. We find what is worth building,
            build it, and train your team to run it.
          </p>

          <nav aria-label="Footer" className="mt-8">
            <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(link.id);
                    }}
                    className={linkClass}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[0.875rem]">
            <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
              {CONTACT_EMAIL}
            </a>
            <span aria-hidden className="h-1 w-1 rounded-full bg-[#b9bcbf]" />
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("contact");
              }}
              className={`group inline-flex items-center gap-1.5 font-medium !text-[#090909]`}
            >
              <span>Book a 30-minute call</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>

          {/* Phones: the scene is cropped, so the copyright stays in the column */}
          <div className="sm:hidden mt-10 flex items-center justify-center gap-4 text-[0.7812rem] text-[#8e9296]">
            <span>© 2026 Jupitex</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-[#c4c7ca]" />
            {backToTop}
          </div>
        </div>
      </div>

      {/* ── The shoreline: sky keyed out, pulled up under the column ── */}
      <div
        ref={sceneRef}
        className="relative z-0 -mt-16 sm:-mt-[7vw] w-full h-[260px] sm:h-[max(23vw,220px)]"
      >
        <img
          ref={imgRef}
          src="/footer/footer-landscape.webp"
          srcSet="/footer/footer-landscape-sm.webp 1440w, /footer/footer-landscape.webp 2880w"
          sizes="max(100vw, 830px)"
          alt=""
          aria-hidden
          draggable={false}
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[74%_100%] sm:object-bottom origin-[50%_100%] will-change-[transform,opacity]"
        />

        {/* Copyright rests in the gap between the rocks, just above the far shore */}
        <div className="hidden sm:flex absolute inset-x-0 top-[44%] z-10 items-center justify-center gap-4 text-[0.7812rem] text-[#8e9296]">
          <span>© 2026 Jupitex</span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-[#c4c7ca]" />
          {backToTop}
        </div>
      </div>
    </footer>
  );
}
