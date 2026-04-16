"use client";
import React from "react";
import Link from "next/link";
import { NotepadTextDashed } from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface FooterProps {
  brandName?: string;
  brandDescription?: string;
  socialLinks?: SocialLink[];
  navLinks?: FooterLink[];
  creatorName?: string;
  creatorUrl?: string;
  brandIcon?: React.ReactNode;
  className?: string;
}

const coralHover =
  "transition-colors duration-200 hover:text-[#ff7950] focus-visible:text-[#ff7950] focus-visible:outline-none";

export const Footer = ({
  brandName = "YourBrand",
  brandDescription = "Your description here",
  socialLinks = [],
  navLinks = [],
  creatorName,
  creatorUrl,
  brandIcon,
  className,
}: FooterProps) => {
  return (
    <section className={cn("relative w-full overflow-hidden", className)}>
      <footer className="relative mt-20 border-t border-white/10 bg-black">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#ff7950]/60 to-transparent"
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
          <div
            className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 select-none text-center font-title text-[clamp(3.5rem,14vw,10rem)] font-extrabold leading-none tracking-tighter text-white/4"
            aria-hidden
          >
            {brandName}
          </div>

          <div className="relative z-1 grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_auto_auto] lg:gap-16">
            <div className="max-w-md">
              <div className="flex items-center">
                {brandIcon || (
                  <span className="font-title text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {brandName}
                  </span>
                )}
              </div>
              <p className="mt-4 sm:mt-5 text-sm sm:text-base font-medium leading-relaxed text-white/70">
                {brandDescription}
              </p>
            </div>

            {navLinks.length > 0 && (
              <nav aria-label="Footer">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#ff7950]">
                  Navigate
                </p>
                <ul className="mt-4 flex flex-col gap-3">
                  {navLinks.map((link, index) => (
                    <li key={`${link.href}-${index}`}>
                      <Link
                        href={link.href}
                        className={cn(
                          "text-sm font-medium text-white/80",
                          coralHover,
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {socialLinks.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#ff7950]">
                  Connect
                </p>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {socialLinks.map((link, index) => (
                    <li key={`${link.href}-${index}`}>
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex text-white/80 [&_svg]:size-5",
                          coralHover,
                        )}
                      >
                        {link.icon}
                        <span className="sr-only">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="relative z-1 mt-14 flex flex-col gap-4  border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-sm text-white/55 sm:text-left">
              © {new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
            {creatorName && creatorUrl ? (
              <Link
                href={creatorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "text-center text-sm text-white/55 sm:text-right",
                  coralHover,
                )}
              >
                Crafted by {creatorName}
              </Link>
            ) : null}
          </div>
        </div>
      </footer>
    </section>
  );
};
