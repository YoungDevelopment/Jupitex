"use client";

import { PixelImage } from "@/components/ui/pixel-image";

import SectionLayout from "../components/SectionLayout";

/** Fills the graphic column edge-to-edge; use wide assets (7:5 works well). */
const CaseStudyImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative h-full w-full min-h-[min(22rem,60vw)] min-w-0">
    <PixelImage
      src={src}
      alt={alt}
      customGrid={{ rows: 5, cols: 7 }}
      className="h-full w-full"
    />
  </div>
);

const Tag = ({ label }: { label: string }) => (
  <span
    className="text-xs rounded-full px-3 py-1 whitespace-nowrap"
    style={{
      color:
        "var(--color-text-secondary, hsl(var(--muted-foreground, 220 8.9% 46.1%)))",
      border:
        "1px solid #000000",
      background:
        "var(--color-background-primary, hsl(var(--background, 0 0% 100%)))",
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
  const graphicPanel = (
    <div
      className="h-full min-h-0 min-w-0 p-0"
      style={{
        background: "#ffffff",
        borderRight: imageRight ? "none" : "0.5px solid #fff",
        borderLeft: imageRight
          ? "0.5px solid var(--color-border-tertiary, hsl(var(--border, 220 13% 91%)))"
          : "none",
      }}
    >
      <CaseStudyImage src={imageSrc} alt={imageAlt} />
    </div>
  );

  const copyPanel = (
    <div className="flex flex-col justify-center px-10 py-10 sm:px-12 sm:py-12">
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
          color:
            "var(--color-text-primary, hsl(var(--foreground, 224 71.4% 4.1%)))",
          letterSpacing: brandItalic ? "-0.03em" : "-0.015em",
        }}
      >
        {brand}
      </h3>

      <p
        className="text-sm sm:text-base leading-relaxed mb-5"
        style={{
          color:
            "var(--color-text-secondary, hsl(var(--muted-foreground, 220 8.9% 46.1%)))",
        }}
      >
        {description}
      </p>

      <p
        className="font-medium leading-none mb-1"
        style={{
          fontSize: "clamp(2.1rem, 5.5vw, 2.9rem)",
          letterSpacing: "-0.025em",
          color:
            "var(--color-text-primary, hsl(var(--foreground, 224 71.4% 4.1%)))",
        }}
      >
        {metric}
      </p>

      <p
        className="text-sm mb-4"
        style={{
          color:
            "var(--color-text-secondary, hsl(var(--muted-foreground, 220 8.9% 46.1%)))",
        }}
      >
        {metricLabel}
      </p>

      <div
        className="mb-3.5"
        style={{
          height: "0.5px",
          background:
            "var(--color-border-tertiary, hsl(var(--border, 220 13% 91%)))",
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
      className="grid overflow-hidden"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        border:
          "0.5px solid var(--color-border-tertiary, hsl(var(--border, 220 13% 91%)))",
        borderRadius: "var(--border-radius-2xl, 1.25rem)",
        background: "#ffffff",
      }}
    >
      {imageRight ? (
        <>
          {copyPanel}
          {graphicPanel}
        </>
      ) : (
        <>
          {graphicPanel}
          {copyPanel}
        </>
      )}
    </div>
  );
};

const caseStudies: CaseStudy[] = [
  {
    category: "Debt Collection Agency",
    brand: "Compliance Ops",
    description:
      "Automated QA for SMS and email replies — eliminating manual compliance review and legal risk entirely.",
    metric: "$7,500 / mo",
    metricLabel: "Saved in legal fees every month",
    tags: ["Compliance", "AI QA", "Automation"],
    imageSrc: "/images/our-work/Debt%20Collection.png",
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
    imageSrc: "/images/our-work/Nova%20Labeling.png",
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

export default function OurWork() {
  return (
    <SectionLayout
      sectionId="our-work"
      bg="bg-apple-light-gray"
      title="Our Work"
      description="Selected projects and client outcomes."
    >
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:gap-8">
        {caseStudies.map((cs, i) => (
          <CaseStudyCard key={i} {...cs} />
        ))}
      </section>
    </SectionLayout>
  );
}
