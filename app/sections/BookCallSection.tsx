"use client";

import { useEffect, useRef } from "react";
import SectionLayout from "../components/SectionLayout";

const CAL_ORIGIN = "https://app.cal.com";
const CAL_EMBED_JS = `${CAL_ORIGIN}/embed/embed.js`;
const CAL_NAMESPACE = "30min";

let calBookingEmbedLock = false;

export default function BookCallSection() {
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calendar = calendarRef.current;
    if (!calendar) return;

    const loadCalendar = () => {
      if (calBookingEmbedLock) return;
      calBookingEmbedLock = true;

      // Cal.com inline embed bootstrap (same as official snippet)
      (function (C: Window, A: string, L: string) {
        const p = (a: { q: unknown[] }, ar: unknown) => {
          a.q.push(ar);
        };
        const d = C.document;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Cal global loader
        const win = C as any;
        win.Cal =
          win.Cal ||
          function () {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cal = win.Cal as any;
            // eslint-disable-next-line prefer-rest-params
            const ar = arguments;
            if (!cal.loaded) {
              cal.ns = {};
              cal.q = cal.q || [];
              const script = d.createElement("script");
              script.async = true;
              script.src = A;
              d.head.appendChild(script);
              cal.loaded = true;
            }
            if (ar[0] === L) {
              const api = function () {
                // eslint-disable-next-line prefer-rest-params
                p(api as unknown as { q: unknown[] }, arguments);
              };
              (api as unknown as { q: unknown[] }).q =
                (api as unknown as { q: unknown[] }).q || [];
              const namespace = ar[1];
              if (typeof namespace === "string") {
                cal.ns[namespace] = cal.ns[namespace] || api;
                p(cal.ns[namespace], ar);
                p(cal, ["initNamespace", namespace]);
              } else p(cal, ar);
              return;
            }
            p(cal, ar);
          };
      })(window, CAL_EMBED_JS, "init");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Cal = (window as any).Cal;
      Cal("init", CAL_NAMESPACE, { origin: CAL_ORIGIN });
      Cal.ns[CAL_NAMESPACE]("inline", {
        elementOrSelector: "#my-cal-inline-30min",
        config: {
          layout: "month_view",
          useSlotsViewOnSmallScreen: "true",
        },
        calLink: "abdulrehman-ibrahim-ut15ub/30min",
      });
      Cal.ns[CAL_NAMESPACE]("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    };

    if (!("IntersectionObserver" in window)) {
      queueMicrotask(loadCalendar);
      return () => {
        calBookingEmbedLock = false;
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        loadCalendar();
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(calendar);

    return () => {
      observer.disconnect();
      calBookingEmbedLock = false;
    };
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
        ref={calendarRef}
        className="w-full min-h-[350px] sm:min-h-[420px] md:min-h-[500px] lg:min-h-[600px] overflow-auto rounded-2xl sm:rounded-3xl border border-border bg-white"
      />
    </SectionLayout>
  );
}
