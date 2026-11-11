"use client";

import { useEffect } from "react";
import SectionWrapper from "@/components/SectionWrapper";

export default function BookCallSection() {
  useEffect(() => {
    /* Cal inline embed — same as Cal.com snippet, run on client after mount */
    (function (C: Window, A: string, L: string) {
      const p = function (a: { q: unknown[] }, ar: unknown) {
        a.q.push(ar);
      };
      const d = C.document;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = C as any;
      win.Cal =
        win.Cal ||
        function () {
          const cal = win.Cal;
          // eslint-disable-next-line prefer-rest-params
          const ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () {
              // eslint-disable-next-line prefer-rest-params
              p(api as unknown as { q: unknown[] }, arguments);
            };
            const namespace = ar[1];
            (api as unknown as { q: unknown[] }).q =
              (api as unknown as { q: unknown[] }).q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    const container = document.getElementById("my-cal-inline-30min");
    if (container) {
      container.innerHTML = "";
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Cal = (window as any).Cal;
    Cal("init", "30min", { origin: "https://app.cal.com" });

    Cal.ns["30min"]("inline", {
      elementOrSelector: "#my-cal-inline-30min",
      config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
      calLink: "abdul-rehman-ibrahim-i6nok1/30min",
    });

    // Match the site's card color (see --card in globals.css)
    const cardColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--card")
        .trim() || "#ffffff";

    Cal.ns["30min"]("ui", {
      hideEventTypeDetails: false,
      layout: "month_view",
      theme: "light",
      cssVarsPerTheme: {
        light: { "cal-bg": cardColor, "cal-bg-muted": cardColor },
        dark: { "cal-bg": cardColor, "cal-bg-muted": cardColor },
      },
    });
  }, []);

  return (
    <SectionWrapper
      id="contact"
      ariaLabel="Book your free audit call"
      subject="BOOK A CALL"
      title={
        <>
          <span className="text-[#8e9296]">Start with</span>
          <span>the free audit</span>
        </>
      }
      description="Pick a time that works for you. Thirty minutes with our team, and you leave knowing what is worth automating first."
    >
      <div
        id="my-cal-inline-30min"
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
      />
    </SectionWrapper>
  );
}
