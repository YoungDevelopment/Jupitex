import Image from "next/image";
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
}: CaseStudy) => {
  // Image always leads on phones and tablets; the zigzag only appears once there is room for two columns.
  const graphicPanel = (
    <div
      className={`h-full min-h-0 min-w-0 p-0 border-b border-black/[0.08] lg:border-b-0 ${
        imageRight ? "lg:order-last lg:border-l" : ""
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

      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
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

const caseStudies: CaseStudy[] = [
  {
    category: "Debt Collection Agency",
    brand: "Compliance Ops",
    description:
      "Automated QA for SMS and email replies, so every message is checked and manual compliance review is no longer the bottleneck.",
    metric: "$7,500 / mo",
    metricLabel: "Saved in legal fees every month",
    tags: ["Compliance", "AI QA", "Automation"],
    imageSrc: "/images/our-work/Debt Collection.png",
    imageAlt: "Compliance Ops — debt collection and QA automation",
  },
  {
    category: "Labeling Company",
    brand: "Label Works",
    description:
      "Internal tool to manage orders and AI-optimize production queues — enabling expansion to 2 new factories.",
    metric: "25 hrs / week",
    metricLabel: "Saved + scaled to 2 new factories",
    tags: ["Internal Tool", "AI Ops", "Manufacturing"],
    imageSrc: "/images/our-work/Nova Labeling.png",
    imageAlt: "Label Works — manufacturing and order operations",
    imageRight: true,
  },
  {
    category: "Professional Services",
    brand: "MaxHP LLC",
    description:
      "Built their website and 3 automated lead generation processes to reach new clients at scale.",
    metric: "$5,000",
    metricLabel: "Generated from automated pipeline",
    tags: ["Web Dev", "Lead Gen", "Automation"],
    imageSrc: "/images/our-work/Maxhpllc.png",
    imageAlt: "MaxHP LLC — lead generation and web",
  },
];

export default function OurWorkSection() {
  return (
    <SectionWrapper
      id="our-work"
      ariaLabel="Our Work"
      subject="OUR WORK"
      title={
        <>
          <span className="text-[#8e9296]">Results we have</span>
          <span>already delivered</span>
        </>
      }
      className="!min-h-0"
      description="Selected projects, starting with a collection agency that stopped reviewing replies by hand."
    >
      <div className="flex w-full flex-col gap-6 sm:gap-8">
        {caseStudies.map((cs) => (
          <CaseStudyCard key={cs.brand} {...cs} />
        ))}
      </div>
    </SectionWrapper>
  );
}
