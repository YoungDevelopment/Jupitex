import React from "react";
import SectionWrapper from "./sectionWrapper";
import { TextAnimate } from "@/components/ui/text-animate";

interface SectionLayoutProps {
  title: string;
  description: string;
  bg?: string;
  /** Sets the section `id` for in-page anchors (footer, nav). */
  sectionId?: string;
  /** Use light text for dark-background sections. */
  dark?: boolean;
  children: React.ReactNode;
}

const SectionLayout = ({
  title,
  description,
  bg,
  sectionId,
  dark = false,
  children,
}: SectionLayoutProps) => {
  const titleColor = dark ? "text-white" : "text-apple-near-black";
  const descColor = dark ? "text-white/70" : "text-apple-text-secondary";

  return (
    <SectionWrapper id={sectionId} bg={bg}>
      <div className="flex items-center">
        <div className="flex items-baseline">
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            accessible={false}
            className="text-display-hero font-title text-orange-500 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
          >
            _
          </TextAnimate>
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            accessible={false}
            className={`text-display-hero font-title ${titleColor} text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold`}
          >
            {title}
          </TextAnimate>
        </div>
   
      </div>
      <TextAnimate
        animation="blurInUp"
        by="word"
        once
        accessible={false}
        className={`text-body-ds mt-5 max-w-xl md:max-w-2xl md:mt-6 lg:mt-8 ${descColor}`}
      >
        {description}
      </TextAnimate>

      <div className="h-12 sm:h-16 md:h-20 lg:h-24" />
      {children}
      <div className="h-12 sm:h-16 md:h-20 lg:h-24" />
    </SectionWrapper>
  );
};

export default SectionLayout;
