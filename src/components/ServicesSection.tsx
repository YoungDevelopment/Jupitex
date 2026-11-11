"use client";

import { useState } from "react";
import Image from "next/image";
import SectionWrapper from "@/components/SectionWrapper";

interface ServiceCardProps {
  cardName: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  subServices: string[];
}

function ServiceCard({
  cardName,
  title,
  description,
  image,
  imageAlt,
  subServices,
}: ServiceCardProps) {
  // Hover flips on desktop; tap or Enter toggles it everywhere else
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${title}: show what is included`}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((f) => !f);
        }
      }}
      onMouseLeave={() => setFlipped(false)}
      className="group h-[400px] perspective-[1000px] cursor-pointer text-left rounded-3xl"
    >
      <div
        className={`relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform-3d will-change-transform [@media(hover:hover)]:group-hover:transform-[rotateY(180deg)] ${
          flipped ? "transform-[rotateY(180deg)]" : ""
        }`}
      >
        {/* Front face */}
        <div className="absolute inset-0 flex flex-col rounded-3xl overflow-hidden bg-card backface-hidden">
          <div className="px-5 sm:px-6 md:px-8 pt-7 sm:pt-8 md:pt-10 pb-0 shrink-0">
            <h3 className="mt-2 text-tile-heading text-apple-near-black">
              {title}
            </h3>
            <p className="mt-4 truncate text-caption-ds text-apple-text-secondary">
              {description}
            </p>
          </div>

          <div className="relative flex-1 min-h-0 flex items-end justify-center">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center"
            />
            <span className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full bg-white/85 backdrop-blur px-3 py-1.5 text-[12px] font-medium text-[#090909] border border-black/[0.06]">
              <span className="[@media(hover:none)]:hidden">Hover for details</span>
              <span className="[@media(hover:hover)]:hidden">Tap for details</span>
            </span>
          </div>
        </div>

        {/* Back face */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-card px-5 sm:px-6 md:px-8 py-8 sm:py-10 backface-hidden transform-[rotateY(180deg)]">
          <p className="text-micro font-semibold uppercase tracking-widest text-apple-text-tertiary mb-2">
            {cardName}
          </p>
          <h3 className="text-tile-heading text-apple-near-black text-center mb-6 sm:mb-8">
            {title}
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {subServices.map((sub) => (
              <span
                key={sub}
                className="rounded-full px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 bg-apple-light-gray text-apple-near-black font-medium text-caption-ds cursor-default transition-colors duration-200 hover:bg-apple-near-black hover:text-white"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const serviceCards: ServiceCardProps[] = [
  {
    cardName: "PUT AI TO WORK IN YOUR BUSINESS",
    title: "AI Transformation Services",
    description: "Automate the work slowing your collectors.",
    image: "/images/ai and automation.png",
    imageAlt: "AI & Automation",
    subServices: [
      "AI Readiness Audit",
      "Data and Reporting with AI",
      "AI Compliance and Governance",
      "Custom AI Solutions and Integrations",
    ],
  },
  {
    cardName: "BUILD EXACTLY WHAT YOUR BUSINESS NEEDS",
    title: "Full-Stack Development",
    description: "Custom tools built around your agency.",
    image: "/images/Development.png",
    imageAlt: "Development",
    subServices: [
      "AI Integration",
      "Model Training",
      "Business Tools & Automation",
      "Web and Mobile Development",
    ],
  },
  {
    cardName: "ADD THE RIGHT PEOPLE, FAST",
    title: "Staff Augmentation",
    description: "Vetted engineers ready from day one.",
    image: "/images/staff augumentation.png",
    imageAlt: "Staff Augmentation",
    subServices: [
      "AI Engineers",
      "Software Engineers",
      "Virtual Assistants",
      "IT Support Specialists",
    ],
  },
];

export default function ServicesSection() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {serviceCards.map((service) => (
          <ServiceCard key={service.cardName} {...service} />
        ))}
      </div>
    </SectionWrapper>
  );
}
