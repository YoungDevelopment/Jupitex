import Image from "next/image";
import SectionWrapper from "@/components/SectionWrapper";

interface WhyJupitexCardProps {
  cardName: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

function WhyJupitexCard({
  title,
  description,
  image,
  imageAlt,
}: WhyJupitexCardProps) {
  return (
    <div className="group flex flex-col rounded-3xl overflow-hidden bg-card h-auto text-left hover:shadow-[0_18px_42px_rgba(0,0,0,0.09)] hover:-translate-y-1 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
      <div className="relative h-[220px] xs:h-[260px] sm:h-[280px] md:h-[300px] lg:h-[360px] shrink-0 overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="px-5 sm:px-6 md:px-8 pt-5 sm:pt-6 pb-6 sm:pb-8 flex-1">
        <h3 className="text-tile-heading text-apple-near-black">{title}</h3>
        <p className="mt-4 text-caption-ds text-apple-text-secondary">
          {description}
        </p>
      </div>
    </div>
  );
}

const cards: WhyJupitexCardProps[] = [
  {
    cardName: "Integrations",
    title: "No need to change your systems",
    description:
      "We build around the collection software, dialer and messaging tools you already run. No migrations, no starting from scratch.",
    image: "/images/Why Jupitex/Integrations.png",
    imageAlt: "Jupitex seamless integrations with popular tools",
  },
  {
    cardName: "ROI",
    title: "You see the numbers before you spend a dollar",
    description:
      "Before any work begins, you get a clear breakdown — what it costs, what it saves, and how long it takes. No vague promises.",
    image: "/images/Why Jupitex/ROI.png",
    imageAlt: "Jupitex AI performance dashboard showing measurable ROI",
  },
  {
    cardName: "Timeline",
    title: "Your team owns it, not us",
    description:
      "We don't build something and disappear. We train your team to run it, manage it, and grow with it. You're never dependent on us to keep things running.",
    image: "/images/Why Jupitex/team.png",
    imageAlt: "A team reviewing the automations they run",
  },
];

export default function WhyJupitexSection() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {cards.map((card) => (
          <WhyJupitexCard key={card.cardName} {...card} />
        ))}
      </div>
    </SectionWrapper>
  );
}
