"use client";

import { useEffect } from "react";
import SectionLayout from "../components/SectionLayout";

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Cal = (window as any).Cal;
    Cal("init", "30min", { origin: "https://app.cal.com" });

    Cal.ns["30min"]("inline", {
      elementOrSelector: "#my-cal-inline-30min",
      config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
      calLink: "abdul-rehman-ibrahim-i6nok1/30min",
    });

    Cal.ns["30min"]("ui", {
      hideEventTypeDetails: false,
      layout: "month_view",
    });
  }, []);

  return (
    <SectionLayout
      sectionId="contact"
      bg="bg-apple-light-gray"
      title="Lets get started"
      description="Pick a time that works for you — 30 minutes with our team."
    >
      <div
        id="my-cal-inline-30min"
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
      />
    </SectionLayout>
  );
}
