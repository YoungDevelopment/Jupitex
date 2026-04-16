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
          "max-w-7xl mx-auto px-5 2xs:px-6 sm:px-8 pt-16 2xs:pt-18 sm:pt-20 md:pt-24 lg:pt-28 ",
          className,
        )}
      >
        {children}
      </div>
    </section>
  );
}
