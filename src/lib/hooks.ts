"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Flashlight borders: tracks the pointer over a container and gives every
 * `.spot-card` inside it `--mx` / `--my` (pointer position in the card's own
 * coordinates). The CSS in globals.css draws the light. No React re-renders.
 */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover)").matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      raf = 0;
      el.querySelectorAll<HTMLElement>(".spot-card").forEach((card) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${(x - r.left).toFixed(1)}px`);
        card.style.setProperty("--my", `${(y - r.top).toFixed(1)}px`);
      });
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}

/** True once the element has entered the viewport (stays true unless `once` is false). */
export function useInView<T extends HTMLElement>(once = true, rootMargin = "0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { threshold: 0.15, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, rootMargin]);

  return [ref, inView] as const;
}

export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}

/** Eases a displayed number toward `target` whenever the target changes. */
export function useTween(target: number, durationMs = 420) {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);

  useEffect(() => {
    const from = valueRef.current;
    if (from === target) return;
    // Reduced motion: land on the value in a single frame
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 1
      : durationMs;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      valueRef.current = from + (target - from) * eased;
      setValue(valueRef.current);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}
