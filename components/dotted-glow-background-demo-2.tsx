import React from "react";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { CanvasText } from "./ui/canvas-text";

export default function DottedGlowBackgroundDemoSecond() {
  return (
    <div className="relative mx-auto flex w-full max-w-7xl items-center justify-center">
      <DottedGlowBackground
        className="pointer-events-none mask-radial-to-90% mask-radial-at-center opacity-20 dark:opacity-100"
        opacity={1}
        gap={14}
        radius={2}
        color="rgba(255, 140, 0, 0.7)"
        darkColor="rgba(255, 140, 0, 0.7)"
        glowColor="rgba(255, 140, 0, 0.85)"
        darkGlowColor="rgba(255, 140, 0, 0.85)"
        backgroundOpacity={0.1}
        speedMin={0.1}
        speedMax={1.6}
        speedScale={1}
      />

      <div className="relative z-10 flex w-full flex-col items-center justify-between space-y-6 px-8 py-16 text-center md:flex-row">
        <div>
          <h2 className="text-center text-4xl font-normal tracking-tight text-neutral-900 sm:text-5xl md:text-left dark:text-neutral-900">
            Get a free{" "}
            <strong className="text-orange-500">
             AI Audit Report
            </strong>{" "}
            for your business
          </h2>
          <p className="mt-4 max-w-lg text-center md:text-left dark:text-neutral-300">
            We&apos;ll look at how your business runs and show you exactly
            what&apos;s worth automating — how much time and money each change
            saves. We understand your business before recommending a single tool.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <a href="#contact">
            <InteractiveHoverButton className="border-neutral-300 bg-white px-8 py-3 text-sm font-medium text-neutral-700 shadow-sm transition-all duration-200 hover:bg-orange-500 hover:text-white hover:shadow-md dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-orange-500">
              Book a Free Call
            </InteractiveHoverButton>
          </a>
        </div>
      </div>
    </div>
  );
}
//a0cd3c6b-2d97-4504-868a-9e12aa197712