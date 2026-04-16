"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  bg?: string;
  id?: string;
}

export default function SectionWrapper({
  children,
  className,
  bg = "bg-apple-light-gray",
  id,
}: SectionWrapperProps) {
  return (
    <section id={id} className={cn("relative z-10 w-full", bg)}>
      <div
        className={cn(
          "max-w-7xl mx-auto px-5 2xs:px-6 sm:px-8 pt-16 2xs:pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-24 2xs:pb-28 sm:pb-32 md:pb-36 lg:pb-40",
          className,
        )}
      >
        {children}
      </div>
    </section>
  );
}
