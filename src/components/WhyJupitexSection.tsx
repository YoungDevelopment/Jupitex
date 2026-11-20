"use client";

import SectionWrapper from "@/components/SectionWrapper";
import FeatureCard, { type FeatureCardProps } from "@/components/FeatureCard";
import { useCardThrow } from "@/lib/useCardThrow";

const cards: FeatureCardProps[] = [
  {
    image: "/images/Why Jupitex/Integrations.png",
    imageAlt: "Jupitex integrations with the tools agencies already use",
    imageWidth: 800,
    imageHeight: 720,
    title: "No need to change your systems",
    description:
      "We build around the collection software you already run. No migrations, no new system to learn, and your vendor stays your vendor.",
  },
  {
    image: "/images/Why Jupitex/ROI.png",
    imageAlt: "Dashboard showing measurable ROI",
    imageWidth: 800,
    imageHeight: 720,
    title: "You see the numbers before you spend a dollar",
    description:
      "Every task in your roadmap comes with a fixed price, the hours it saves each month and the payback. No hourly billing, no vague promises.",
  },
  {
    image: "/images/Why Jupitex/team.png",
    imageAlt: "A team reviewing the automations they run",
    imageWidth: 800,
    imageHeight: 720,
    title: "Your team owns it, not us",
    description:
      "You own what we build, with full documentation. We train your team to run it, so you are never stuck if we are not around.",
  },
];

export default function WhyJupitexSection() {
  // Thrown onto the table one by one, then snapped out into place together
  const { containerRef, cardRef, cardStyle } = useCardThrow();

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
      description="Three things agencies ask before they let anyone near their collection system."
    >
      <div ref={containerRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {cards.map((card, i) => (
            <div
              key={card.title}
              ref={cardRef(i)}
              className="relative flex rounded-3xl shadow-[0_18px_50px_rgba(0,0,0,0)] hover:shadow-[0_18px_50px_rgba(0,0,0,0.12)] origin-[50%_80%] will-change-transform motion-reduce:!opacity-100 motion-reduce:!transform-none"
              style={cardStyle(i)}
            >
              <FeatureCard {...card} className="flex-1" />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
