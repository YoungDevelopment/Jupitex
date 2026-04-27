"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "@/components/ui/resizable-navbar";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Problems", link: "#problems" },
  { name: "Services", link: "#services" },
  { name: "Our Work", link: "#our-work" },
  { name: "Why Jupitex", link: "#why-jupitex" },
  { name: "Testimonials", link: "#testimonials" },
  { name: "FAQ", link: "#faq" },
];

export default function SiteNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      <NavBody>
        <Logo />
        <NavItems items={navItems} />
        <a href="#contact" className="relative z-10">
          <InteractiveHoverButton className="border-neutral-300 bg-white px-8 py-3 text-sm font-medium text-neutral-700 shadow-sm transition-all duration-200 hover:bg-orange-500 hover:text-white hover:shadow-md dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-orange-500">
            Book a call
          </InteractiveHoverButton>
        </a>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <Logo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              className="w-full text-neutral-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <a
            href="#contact"
            className="w-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <InteractiveHoverButton className="w-full border-neutral-300 bg-white px-8 py-3 text-sm font-medium text-neutral-700 shadow-sm transition-all duration-200 hover:bg-orange-500 hover:text-white hover:shadow-md dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-orange-500">
              Book a call
            </InteractiveHoverButton>
          </a>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

function useScrolled(threshold = 100) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function Logo() {
  const scrolled = useScrolled();
  return (
    <a href="#top" className="relative z-20 mr-4 flex items-center px-2 py-1">
      <Image
        src="/images/logo/nav_logo_dark.png"
        alt="Jupitex"
        width={140}
        height={36}
        className={cn(
          "h-7 w-auto transition-opacity duration-300",
          scrolled ? "opacity-0 absolute" : "opacity-100",
        )}
      />
      <Image
        src="/images/logo/nav_logo_light.png"
        alt="Jupitex"
        width={140}
        height={36}
        className={cn(
          "h-7 w-auto transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-0 absolute",
        )}
      />
    </a>
  );
}
