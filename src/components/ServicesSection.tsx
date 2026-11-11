"use client";

import SectionWrapper from "@/components/SectionWrapper";
import FeatureCard, { type FeatureCardProps } from "@/components/FeatureCard";
import { useSpotlight } from "@/lib/hooks";

const services: FeatureCardProps[] = [
  {
    tile: "audit",
    title: "AI Transformation Services",
    description:
      "We find the tasks eating your collectors' time, rank them by return, and automate the ones worth it.",
    items: ["Readiness Audit", "AI Reporting", "Governance", "Custom AI"],
  },
  {
    tile: "build",
    title: "Full-Stack Development",
    description:
      "When off-the-shelf tools fall short, we build the tool your agency needs, simple enough to use every day.",
    items: ["AI Integration", "Model Training", "Business Tools", "Web and Mobile"],
  },
  {
    tile: "team",
    title: "Staff Augmentation",
    description:
      "Vetted engineers placed on your team who deliver from day one. Wrong fit? We replace them in 48 hours.",
    items: ["AI Engineers", "Software Engineers", "Virtual Assistants", "IT Support"],
  },
];

export default function ServicesSection() {
  const gridRef = useSpotlight<HTMLDivElement>();
  return (
    <SectionWrapper
      id="services"
      ariaLabel="Our Services"
      subject="OUR SERVICES"
      title={
        <>
          <span className="text-[#8e9296]">Three ways</span>
          <span>we work with you</span>
        </>
      }
      description="Everything an agency needs to put AI to work, from the first audit to the people who keep it running."
      className="!min-h-0"
    >
      <div ref={gridRef} className="spot-group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {services.map((service) => (
          <FeatureCard key={service.tile} {...service} />
        ))}
      </div>
    </SectionWrapper>
  );
}
