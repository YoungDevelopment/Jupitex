"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { Particles } from "@/components/ui/particles";
import { GlowingButton } from "@/components/ui/glowing-button";

const lines = [
  "You want to implement AI but You're not sure where AI actually fits in your business .",
  "You bought the AI tools, but months later they're stuck in pilot, never scaled and no one on your team can explain the ROI.",
  "One size fits all AI solutions, Compatibility Issues, Chatgpt wrappers labeled as custom AI solutions.",
  "SOUNDS FAMILIAR?",

];

const TOTAL_STEPS = lines.length + 1;

interface ScrollState {
  progress: number;
  activeStep: number;
  opacities: number[];
}

const INITIAL_STATE: ScrollState = {
  progress: 0,
  activeStep: 0,
  opacities: Array(TOTAL_STEPS).fill(0) as number[],
};

function computeOpacities(p: number): number[] {
  const stepSize = 1 / TOTAL_STEPS;
  const result = Array(TOTAL_STEPS).fill(0) as number[];

  for (let i = 0; i < TOTAL_STEPS; i++) {
    const stepStart = i * stepSize;
    const stepEnd = (i + 1) * stepSize;
    const fadeInEnd = stepStart + stepSize * 0.2;
    const fadeOutStart = stepEnd - stepSize * 0.2;

    if (p >= stepStart && p <= stepEnd) {
      if (p < fadeInEnd) {
        result[i] = (p - stepStart) / (fadeInEnd - stepStart);
      } else if (p > fadeOutStart && i < TOTAL_STEPS - 1) {
        result[i] = 1 - (p - fadeOutStart) / (stepEnd - fadeOutStart);
      } else {
        result[i] = 1;
      }
    }
  }

  return result;
}

export default function Problems() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [scrollState, setScrollState] = useState<ScrollState>(INITIAL_STATE);

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;

      if (scrolled < 0 || sectionHeight <= 0) {
        setScrollState(INITIAL_STATE);
        return;
      }

      const p = Math.min(Math.max(scrolled / sectionHeight, 0), 1);
      const stepSize = 1 / TOTAL_STEPS;

      setScrollState({
        progress: p,
        activeStep: Math.min(Math.floor(p / stepSize), TOTAL_STEPS - 1),
        opacities: computeOpacities(p),
      });
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  const { progress, activeStep, opacities } = scrollState;

  return (
    <section
      id="problems"
      ref={sectionRef}
      className="relative bg-apple-light-gray"
      style={{ height: "450vh" }}
    >
      <div className="sticky top-0 z-2 flex h-screen flex-col items-center justify-center overflow-hidden bg-apple-light-gray">
        {/* Problem text lines */}
        <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-12 md:px-20">
          {lines.map((line, i) => (
            <h2
              key={i}
              className="absolute inset-0 flex items-center justify-center px-6 sm:px-12 md:px-20"
              style={{
                opacity: opacities[i],
                transform: `translateY(${(1 - opacities[i]) * 20}px)`,
                transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                pointerEvents: activeStep === i ? "auto" : "none",
              }}
            >
              <span className="block max-w-5xl text-center font-title text-section-heading text-apple-near-black">
                {line}
              </span>
            </h2>
          ))}
        </div>

        {/* Final sequence background */}
        <div
          className="absolute inset-0 bg-black transition-opacity duration-700 ease-out"
          style={{ opacity: opacities[TOTAL_STEPS - 1] }}
        />

        {/* Particle starfield — z-[5] keeps it above the dark bg but below final text (z-10) */}
        <div
          className="pointer-events-none absolute inset-0 z-5"
          style={{
            maskImage:
              "radial-gradient(ellipse 50% 40% at 50% 50%, transparent 30%, black 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 50% 40% at 50% 50%, transparent 30%, black 80%)",
          }}
        >
          <Particles
            className="absolute inset-0"
            quantity={150}
            ease={100}
            size={0.3}
            color={activeStep === TOTAL_STEPS - 1 ? "#ffffff" : "#000000"}
            refresh
          />
        </div>

        {/* Final sequence */}
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 px-6 sm:px-12 md:px-20"
          style={{
            opacity: opacities[TOTAL_STEPS - 1],
            transform: `translateY(${(1 - opacities[TOTAL_STEPS - 1]) * 30}px)`,
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            pointerEvents: activeStep === TOTAL_STEPS - 1 ? "auto" : "none",
          }}
        >
          <h2 className="problems-gradient-heading mx-auto max-w-5xl text-center font-title text-section-heading">
            That&apos;s why we built Jupitex.
          </h2>

          <div className="flex max-w-5xl flex-col gap-8 text-center">
            <p className="text-body-ds font-semibold text-white">
              Engineering that actually moves the needle.
            </p>
            <p className="text-body-ds text-white/70">
              Jupitex defines what&apos;s worth building, builds it for you,
              then trains your people to make it stick.
            </p>
            <p className="text-body-ds text-white/70">
              Stop paying to experiment.{" "}
              <span className="font-semibold text-white">
                Start paying for results.
              </span>
            </p>
          </div>

          <div className="mt-4 flex justify-center">
            <GlowingButton href="#contact" className="h-11 px-16 text-[13px]">
              Free AI Audit Report
            </GlowingButton>
          </div>
        </div>

        {/* Progress bar — hidden on final slide */}
        <div
          className="absolute inset-x-0 bottom-0 flex h-[5px] items-center transition-opacity duration-500 ease-out"
          style={{ opacity: activeStep === TOTAL_STEPS - 1 ? 0 : 1 }}
        >
          <div
            className="problems-progress-bar h-1 transition-[width] duration-100 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Radial gradient background — hidden on final slide */}
        <div
          className="problems-radial-bg absolute inset-0 -z-10 transition-opacity duration-500 ease-out"
          style={{ opacity: activeStep === TOTAL_STEPS - 1 ? 0 : 1 }}
        />

        {/* Grainy overlay — hidden on final slide */}
        <div
          className="pointer-events-none absolute inset-0 -z-5 mix-blend-multiply transition-opacity duration-500 ease-out"
          style={{ opacity: activeStep === TOTAL_STEPS - 1 ? 0 : 0.03 }}
        >
          <div className="problems-grain absolute inset-0" />
        </div>
      </div>
    </section>
  );
}
