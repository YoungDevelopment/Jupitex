"use client";

import Image from "next/image";
import { CONTACT_EMAIL, NAV_LINKS, scrollToId } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="relative w-full bg-background px-5 sm:px-8 lg:px-14 pt-4 pb-8 sm:pb-10">
      <div className="max-w-[1140px] mx-auto">
        <div className="pt-8 border-t border-black/[0.08] flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="max-w-[340px]">
            <Image
              src="/JupitexLogos/nav_logo_light.png"
              alt="Jupitex"
              width={240}
              height={72}
              className="h-[26px] w-auto object-contain"
            />
            <p className="mt-4 text-[14px] leading-[1.6] text-[#686c70]">
              AI and automation for debt collection agencies. We find what is worth building,
              build it, and train your team to run it.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-14 gap-y-8">
            <div>
              <div className="text-[12px] font-medium text-[#8e9296]">Explore</div>
              <ul className="mt-3 space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToId(link.id);
                      }}
                      className="text-[14px] text-[#3d4044] hover:text-[#090909] transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[12px] font-medium text-[#8e9296]">Talk to us</div>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-[14px] text-[#3d4044] hover:text-[#090909] transition-colors duration-200"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId("contact");
                    }}
                    className="group inline-flex items-center gap-1.5 text-[14px] text-[#3d4044] hover:text-[#090909] transition-colors duration-200"
                  >
                    <span>Book a 30-minute call</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-[12.5px] text-[#8e9296]">
          <span>© 2026 Jupitex</span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-1.5 hover:text-[#090909] transition-colors duration-200 cursor-pointer"
          >
            <span>Back to top</span>
            <span className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
