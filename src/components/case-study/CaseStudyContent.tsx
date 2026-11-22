import Image from "next/image";
import Link from "next/link";
import { FOUNDER_NOTE, type CaseStudy } from "@/lib/case-studies";

const ACCENT = "#FF731E";

/** A case study's full story, as shown on its /work/[slug] page. */
export default function CaseStudyContent({
  study,
  headingLevel = "h1",
  titleId,
}: {
  study: CaseStudy;
  headingLevel?: "h1" | "h2";
  titleId?: string;
}) {
  const Heading = headingLevel;

  return (
    <article className="text-left">
      <p className="text-xs uppercase tracking-widest font-medium" style={{ color: ACCENT }}>
        Founder experience
      </p>
      <Heading
        id={titleId}
        className="mt-2 text-[28px] sm:text-[36px] font-medium leading-[1.1] tracking-[-0.025em] text-[#0a0a0a]"
      >
        {study.title}
      </Heading>
      <p className="mt-4 text-[15px] sm:text-[16.5px] leading-[1.6] text-[#55585c] max-w-[640px]">
        {study.summary}
      </p>
      <p className="mt-4 text-[12.5px] leading-[1.55] text-[#8e9296] max-w-[640px]">{FOUNDER_NOTE}</p>

      {/* The numbers first: what a skeptical reader looks for */}
      <dl className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {study.stats.map((s) => (
          <div key={s.value} className="rounded-2xl border border-black/[0.07] bg-white px-5 py-4">
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span className="block text-[24px] sm:text-[28px] font-medium leading-none tracking-[-0.025em] text-[#0a0a0a]">
                {s.value}
              </span>
              <span className="mt-2 block text-[13px] leading-[1.45] text-[#55585c]">{s.label}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="relative mt-7 aspect-[16/10] overflow-hidden rounded-2xl border border-black/[0.06] bg-[var(--card)]">
        <Image
          src={study.image.src}
          alt={study.image.alt}
          fill
          className="object-cover"
          sizes="(max-width: 860px) 100vw, 820px"
        />
      </div>

      <div className="mt-8 space-y-8">
        {study.sections.map((section) => (
          <section key={section.heading}>
            <h3 className="text-[18px] sm:text-[20px] font-medium tracking-[-0.015em] text-[#0a0a0a]">
              {section.heading}
            </h3>
            {section.body?.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-[15.5px] leading-[1.7] text-[#3d4044]">
                {paragraph}
              </p>
            ))}
            {section.points && (
              <ul className="mt-3 space-y-2.5">
                {section.points.map((point) => (
                  <li key={point} className="flex gap-3 text-[15px] leading-[1.6] text-[#3d4044]">
                    <span
                      aria-hidden
                      className="mt-[9px] w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: ACCENT }}
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {study.tools.length > 0 && (
        <div className="mt-8">
          <h3 className="text-[13px] uppercase tracking-widest text-[#8e9296]">Tools</h3>
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
        </div>
      )}

      {/* Next step */}
      <div className="mt-10 rounded-2xl bg-[#0a0a0a] px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <p className="text-white text-[16px] sm:text-[17px] font-medium leading-snug max-w-[420px]">
          Want the same for your agency? Start with a free 90-minute audit.
        </p>
        <Link
          href="/#contact"
          className="inline-flex items-center justify-center h-[42px] px-5 rounded-full text-[14px] font-medium text-white shrink-0 transition-opacity hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          Book the free audit
        </Link>
      </div>
    </article>
  );
}
