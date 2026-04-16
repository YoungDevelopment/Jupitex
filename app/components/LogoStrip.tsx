"use client";

import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import ScrollReveal from "./ScrollReveal";

const PARTNERS = [
  { name: "Microsoft", logo: "/images/logos/microsoft.svg" },
  { name: "GitHub", logo: "/images/logos/github.svg" },
  { name: "Google Gemini", logo: "/images/logos/gemini.svg" },
  { name: "n8n", logo: "/images/logos/n8n.svg" },
  { name: "Webflow", logo: "/images/logos/webflow.svg" },
  { name: "Figma", logo: "/images/logos/figma.svg" },
  { name: "Supabase", logo: "/images/logos/supabase.svg" },
];

export default function LogoStrip() {
  return (
    <section className="bg-apple-light-gray py-8 sm:py-10 md:py-12">
    <ScrollReveal>
      <div className="mb-4 sm:mb-6 flex items-center justify-center gap-2 sm:gap-3">
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-neutral-400"
        >
          <path
            d="M4.5 6.75L9 11.25L13.5 6.75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="font-title text-micro font-semibold uppercase tracking-widest text-apple-text-tertiary">
          We partner with
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <Marquee pauseOnHover className="[--duration:30s] [--gap:1.5rem] sm:[--gap:2rem] md:[--gap:3rem]">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-2.5"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={28}
                height={28}
                className="shrink-0"
              />
              <span className="whitespace-nowrap text-caption-ds font-medium text-apple-near-black">
                {partner.name}
              </span>
            </div>
          ))}
        </Marquee>

        <ProgressiveBlur
          direction="left"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/6"
        />
        <ProgressiveBlur
          direction="right"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-1/6"
        />
      </div>
    </ScrollReveal>
    </section>
  );
}
