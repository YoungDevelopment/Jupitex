import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/lib/case-studies";
import { CountUp, Reveal } from "./motion";

const ACCENT = "#FF731E";

/**
 * Text in the case-study data can mark key phrases as ==like this==. They render as a
 * highlighter stroke that draws itself in when the paragraph scrolls into view.
 */
function Rich({ text }: { text: string }) {
  const parts = text.split(/==(.+?)==/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="cs-mark">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

/** A case study's full story, as shown on its /work/[slug] page. */
export default function CaseStudyContent({ study }: { study: CaseStudy }) {
  return (
    // cs-article sets a soft selection colour (see globals.css)
    <article className="cs-article text-left">
      <Reveal>
        <p className="text-xs uppercase tracking-widest font-medium" style={{ color: ACCENT }}>
          Case study
        </p>
        <h1 className="mt-2 text-[1.875rem] sm:text-[2.5rem] font-medium leading-[1.08] tracking-[-0.03em] text-[#0a0a0a]">
          {study.title}
        </h1>
        <p className="mt-4 text-[1rem] sm:text-[1.0938rem] leading-[1.6] text-[#55585c] max-w-[640px]">
          <Rich text={study.summary} />
        </p>
      </Reveal>

      {/* The numbers first: what a skeptical reader looks for */}
      <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {study.stats.map((s, i) => (
          <Reveal key={s.value} delay={i * 90}>
            <div className="cs-stat h-full rounded-2xl border border-black/[0.07] bg-white px-5 py-4">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block text-[1.625rem] sm:text-[1.875rem] font-medium leading-none tracking-[-0.025em] text-[#0a0a0a]">
                  <CountUp value={s.value} />
                </span>
                <span className="mt-2 block text-[0.8438rem] leading-[1.45] text-[#55585c]">{s.label}</span>
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>

      <Reveal className="mt-8">
        <div className="cs-image relative aspect-[16/10] overflow-hidden rounded-2xl border border-black/[0.06] bg-[var(--card)]">
          <Image
            src={study.image.src}
            alt={study.image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 860px) 100vw, 820px"
          />
        </div>
      </Reveal>

      <div className="mt-10 space-y-10">
        {study.sections.map((section) => (
          <Reveal key={section.heading}>
            <section>
              <h2 className="text-[1.25rem] sm:text-[1.4375rem] font-medium tracking-[-0.02em] text-[#0a0a0a]">
                {section.heading}
              </h2>
              {section.body?.map((paragraph) => (
                <p key={paragraph} className="mt-3.5 text-[1rem] leading-[1.75] text-[#3d4044]">
                  <Rich text={paragraph} />
                </p>
              ))}
              {section.points && (
                <ul className="mt-4 space-y-3">
                  {section.points.map((point) => (
                    <li key={point} className="flex gap-3 text-[1rem] leading-[1.7] text-[#3d4044]">
                      <span
                        aria-hidden
                        className="mt-[11px] w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: ACCENT }}
                      />
                      <span>
                        <Rich text={point} />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </Reveal>
        ))}
      </div>

      {study.tools.length > 0 && (
        <Reveal className="mt-10">
          <h2 className="text-[0.8125rem] uppercase tracking-widest text-[#8e9296]">Tools</h2>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {study.tools.map((tool) => (
              <li
                key={tool}
                className="text-xs rounded-full px-3 py-1 border border-black/80 bg-white text-black/70"
              >
                {tool}
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {/* Next step */}
      <Reveal className="mt-12">
        <div className="rounded-2xl bg-[#0a0a0a] px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between cs-dark">
          <p className="text-white text-[1rem] sm:text-[1.0625rem] font-medium leading-snug max-w-[420px]">
            Want the same for your agency? Start with a free 90-minute audit.
          </p>
          <Link
            href="/#contact"
            className="group inline-flex items-center justify-center gap-1.5 h-[42px] px-5 rounded-full text-[0.875rem] font-medium text-white shrink-0 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{ backgroundColor: ACCENT }}
          >
            Book the free audit
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </Reveal>
    </article>
  );
}
