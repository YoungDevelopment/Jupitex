import Image from "next/image";
import Link from "next/link";
import { CASE_STUDIES } from "@/lib/case-studies";
import { SlideIn } from "@/components/case-study/motion";
import SectionWrapper from "@/components/SectionWrapper";

/** Fills the graphic column edge-to-edge without block-by-block pixel animation. */
const CaseStudyImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative h-full w-full min-h-[min(22rem,60vw)] aspect-[16/10] lg:aspect-auto min-w-0 overflow-hidden">
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover object-center"
      sizes="(max-width: 1023px) 100vw, 50vw"
    />
  </div>
);

const Tag = ({ label }: { label: string }) => (
  <span
    className="text-xs rounded-full px-3 py-1 whitespace-nowrap"
    style={{
      color: "rgba(0, 0, 0, 0.72)",
      border: "1px solid #000000",
      background: "#ffffff",
    }}
  >
    {label}
  </span>
);

interface CaseStudy {
  category: string;
  brand: string;
  brandItalic?: boolean;
  description: string;
  metric: string;
  metricLabel: string;
  tags?: string[];
  imageSrc: string;
  imageAlt: string;
  imageRight?: boolean;
  /** Link to the full case study page */
  href?: string;
}

const CaseStudyCard = ({
  category,
  brand,
  brandItalic = false,
  description,
  metric,
  metricLabel,
  tags = [],
  imageSrc,
  imageAlt,
  imageRight = false,
  href,
}: CaseStudy) => {
  // Image always leads on phones and tablets; the zigzag only appears once there is room for two columns.
  const graphicPanel = (
    <div
      className={`h-full min-h-0 min-w-0 p-0 border-b border-black/[0.08] lg:border-b-0 ${
        // a light divider where the picture meets the text, whichever side the picture is on
        imageRight ? "lg:order-last lg:border-l" : "lg:border-r"
      }`}
      style={{ background: "var(--card)" }}
    >
      <CaseStudyImage src={imageSrc} alt={imageAlt} />
    </div>
  );

  const copyPanel = (
    <div className="flex flex-col justify-center text-left px-6 py-8 sm:px-12 sm:py-12">
      <p
        className="text-xs uppercase tracking-widest mb-1.5"
        style={{
          color: "var(--color-brand-primary, #f97316)",
        }}
      >
        {category}
      </p>

      <h3
        className={`text-2xl sm:text-3xl font-medium mb-2 leading-tight ${brandItalic ? "italic" : ""}`}
        style={{
          color: "#0a0a0a",
          letterSpacing: brandItalic ? "-0.03em" : "-0.015em",
        }}
      >
        {brand}
      </h3>

      <p
        className="text-sm sm:text-base leading-relaxed mb-5"
        style={{
          color: "#55585c",
        }}
      >
        {description}
      </p>

      <p
        className="font-medium leading-none mb-1"
        style={{
          fontSize: "clamp(2.1rem, 5.5vw, 2.9rem)",
          letterSpacing: "-0.025em",
          color: "#0a0a0a",
        }}
      >
        {metric}
      </p>

      <p
        className="text-sm mb-4"
        style={{
          color: "#55585c",
        }}
      >
        {metricLabel}
      </p>

      <div
        className="mb-3.5"
        style={{
          height: "0.5px",
          background: "rgba(0, 0, 0, 0.1)",
        }}
      />

      {/* Tags and the case-study link share one row, so the card is no taller than before */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
        {href && (
        <Link
          href={href}
          aria-label={`Read the case study: ${brand}`}
          // the ::after layer stretches the link over the whole card, so any click opens it
          className="ml-auto inline-flex items-center gap-1.5 text-[14px] font-medium text-[#0a0a0a] whitespace-nowrap after:absolute after:inset-0 after:z-10 after:rounded-[1.25rem] after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-[#0a0a0a] focus-visible:after:outline-offset-4"
        >
          Read the case study
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden className="transition-transform duration-300 group-hover/card:translate-x-1">
            <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`group/card relative grid grid-cols-1 lg:grid-cols-2 overflow-hidden ${href ? "cs-card cursor-pointer" : ""}`}
      style={{
        border: "0.5px solid rgba(0, 0, 0, 0.08)",
        borderRadius: "1.25rem",
        background: "var(--card)",
      }}
    >
      {graphicPanel}
      {copyPanel}
    </div>
  );
};

// The three collection-agency projects (founder experience), from lib/case-studies
const caseStudies: CaseStudy[] = CASE_STUDIES.map((c, i) => ({
  category: "Founder experience",
  brand: c.card.name,
  description: c.card.description,
  metric: c.card.metric,
  metricLabel: c.card.metricLabel,
  tags: c.card.tags,
  imageSrc: c.image.src,
  imageAlt: c.image.alt,
  imageRight: i % 2 === 1,
  href: `/work/${c.slug}`,
}));

export default function OurWorkSection() {
  return (
    <SectionWrapper
      id="our-work"
      ariaLabel="Our Work"
      subject="OUR WORK"
      // the cards slide in on their own, so only the heading gets the section's blur-fade
      revealContent={false}
      title={
        <>
          <span className="text-[#8e9296]">Built inside</span>
          <span>a collection agency</span>
        </>
      }
      description="Back-office work our founder automated inside a US debt collection agency, before starting Jupitex."
    >
      <div className="flex w-full flex-col gap-6 sm:gap-8">
        {caseStudies.map((cs) => (
          // each card slides in from the side its picture is on
          <SlideIn key={cs.brand} from={cs.imageRight ? "right" : "left"}>
            <CaseStudyCard {...cs} />
          </SlideIn>
        ))}
      </div>
    </SectionWrapper>
  );
}
