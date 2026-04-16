import Image from "next/image";
import SectionLayout from "../components/SectionLayout";

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
  return (
    <div className="group h-[480px] xs:h-[520px] sm:h-[540px] md:h-[560px] lg:h-[620px] perspective-[1000px]">
      <div className="relative h-full w-full transition-transform duration-600 transform-3d will-change-transform group-hover:transform-[rotateY(180deg)]">
        {/* Front face */}
        <div className="absolute inset-0 flex flex-col rounded-3xl overflow-hidden bg-white backface-hidden">
          <div className="px-5 sm:px-6 md:px-8 pt-7 sm:pt-8 md:pt-10 pb-2 shrink-0">
            <p className="text-micro font-semibold uppercase tracking-widest text-apple-text-tertiary">
              {cardName}
            </p>
            <h3 className="mt-2 text-tile-heading text-apple-near-black">
              {title}
            </h3>
            <p className="mt-2 text-caption-ds text-apple-text-secondary">
              {description}
            </p>
          </div>
          <div className="relative flex-1 min-h-0 flex items-end justify-center">
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover object-bottom"
            />
          </div>
        </div>

        {/* Back face */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-white px-5 sm:px-6 md:px-8 py-8 sm:py-10 backface-hidden transform-[rotateY(180deg)]">
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

const services: ServiceCardProps[] = [
  {
    cardName: "AI & Automation",
    title: "AI & Automation",
    description:
      "We integrate cutting-edge AI into your operations and build custom automation solutions that streamline workflows, so your team can focus on high-value work.",
    image: "/images/ai and automation.png",
    imageAlt: "AI & Automation",
    subServices: [
      "LLM Implementation",
      "AI Strategy",
      "Prompt Engineering",
      "Data Analysis",
      "Workflow Design",
      "Process Mining",
      "RPA Solutions",
      "API Integration",
    ],
  },

  {
    cardName: "Staffing",
    title: "Staff Augmentation",
    description:
      "Scale your team on demand with vetted, expert engineers who integrate seamlessly into your workflow and hit the ground running.",
    image: "/images/staff augumentation.png",
    imageAlt: "Staff Augmentation",
    subServices: [
      "Dedicated Teams",
      "Talent Vetting",
      "Rapid Onboarding",
      "Flexible Scaling",
    ],
  },

  {
    cardName: "Development",
    title: "Development",
    description:
      "Our team crafts bespoke software solutions tailored to your unique requirements, prioritizing performance, security, and exceptional UX.",
    image: "/images/Development.png",
    imageAlt: "Development",
    subServices: [
      "Full-Stack Dev",
      "Cloud Architecture",
      "UI/UX Design",
      "Mobile Optimization",
    ],
  },
];

export default function Services() {
  return (
    <SectionLayout
      sectionId="services"
      bg="bg-apple-light-gray"
      title="Our Services"
      description="We deliver end-to-end technology solutions that transform how businesses operate, innovate, and scale."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {services.map((service) => (
          <ServiceCard key={service.cardName} {...service} />
        ))}
      </div>
    </SectionLayout>
  );
}
