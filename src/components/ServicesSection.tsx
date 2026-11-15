"use client";

import SectionWrapper from "@/components/SectionWrapper";
import FeatureCard, { type FeatureCardProps } from "@/components/FeatureCard";
import { useCardThrow } from "@/lib/useCardThrow";

const services: FeatureCardProps[] = [
  {
    image: "/images/ai and automation.png",
    imageAlt: "AI and automation",
    imageWidth: 800,
    imageHeight: 760,
    title: "AI Transformation Services",
    description:
      "We find the tasks eating your collectors' time, rank them by return, and automate the ones worth it.",
    items: ["Readiness Audit", "AI Reporting", "Governance", "Custom AI"],
  },
  {
    image: "/images/Development.png",
    imageAlt: "Development",
    imageWidth: 800,
    imageHeight: 760,
    title: "Full-Stack Development",
    description:
      "When off-the-shelf tools fall short, we build the tool your agency needs, simple enough to use every day.",
    items: ["AI Integration", "Model Training", "Business Tools", "Web and Mobile"],
  },
  {
    image: "/images/staff augumentation.png",
    imageAlt: "Staff augmentation",
    imageWidth: 800,
    imageHeight: 760,
    title: "Staff Augmentation",
    description:
      "Vetted engineers placed on your team who deliver from day one. Wrong fit? We replace them in 48 hours.",
    items: ["AI Engineers", "Software Engineers", "Virtual Assistants", "IT Support"],
  },
];

export default function ServicesSection() {
  // Each card is thrown straight to its own spot, landing crooked, then they all straighten together
  const { containerRef, cardRef, cardStyle } = useCardThrow({ mode: "place" });

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
    >
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {services.map((service, i) => (
          <div
            key={service.title}
            ref={cardRef(i)}
            className={`${
              // 2-column tablets: centre the odd card out instead of leaving it stranded on the left
              i === services.length - 1 && services.length % 2 === 1
                ? "md:max-lg:col-span-2 md:max-lg:justify-self-center md:max-lg:w-[calc(50%-10px)]"
                : ""
            } relative rounded-3xl shadow-[0_18px_50px_rgba(0,0,0,0)] hover:shadow-[0_18px_50px_rgba(0,0,0,0.12)] origin-[50%_80%] will-change-transform motion-reduce:!opacity-100 motion-reduce:!transform-none`}
            style={cardStyle(i)}
          >
            <FeatureCard {...service} imagePosition="bottom" className="h-full" />
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
