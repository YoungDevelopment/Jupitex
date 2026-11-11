"use client";

import SectionWrapper from "@/components/SectionWrapper";
import FeatureCard, { type FeatureCardProps } from "@/components/FeatureCard";
import { useSpotlight } from "@/lib/hooks";

const cards: FeatureCardProps[] = [
  {
    tile: "integrations",
    title: "No need to change your systems",
    description:
      "We build around the collection software, dialer and messaging tools you already run. No migrations, no starting from scratch.",
  },
  {
    tile: "numbers",
    title: "You see the numbers before you spend a dollar",
    description:
      "Before any work begins, you get a clear breakdown: what it costs, what it saves, and how long it takes. No vague promises.",
  },
  {
    tile: "handover",
    title: "Your team owns it, not us",
    description:
      "We don't build something and disappear. We train your team to run it, manage it, and grow with it. You're never dependent on us.",
  },
];

export default function WhyJupitexSection() {
  const gridRef = useSpotlight<HTMLDivElement>();
  return (
    <SectionWrapper
      id="why-jupitex"
      ariaLabel="Why Jupitex?"
      subject="WHY JUPITEX"
      title={
        <>
          <span className="text-[#8e9296]">Why agencies</span>
          <span>choose Jupitex</span>
        </>
      }
      className="!min-h-0"
      description="Three things agencies ask before they let anyone near their collection system."
    >
      <div ref={gridRef} className="spot-group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {cards.map((card) => (
          <FeatureCard key={card.tile} {...card} />
        ))}
      </div>
    </SectionWrapper>
  );
}
