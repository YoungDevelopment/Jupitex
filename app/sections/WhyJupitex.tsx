import Image from "next/image";
import SectionLayout from "../components/SectionLayout";

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
    <div className="flex flex-col rounded-3xl overflow-hidden bg-white h-auto hover:scale-[1.017] hover:shadow-xl transition-all duration-300">
      <div className="relative h-[220px] xs:h-[260px] sm:h-[280px] md:h-[300px] lg:h-[360px] shrink-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover object-center"
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
      "We build AI that works with systems you already have. No migrations, no starting from scratch. Everything we build plugs into how your business runs today.",
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
    imageAlt: "Jupitex project timeline with detailed milestones",
  },
];

export default function WhyJupitex() {
  return (
    <SectionLayout
      sectionId="why-jupitex"
      bg="bg-apple-light-gray"
      title="Why Jupitex?"
      description="Discover why businesses trust Jupitex to power their growth and innovation."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {cards.map((card) => (
          <WhyJupitexCard key={card.cardName} {...card} />
        ))}
      </div>

      {/* <div className="mt-10 sm:mt-12 md:mt-16 flex flex-col items-center">
        <h3 className="text-tile-heading text-apple-near-black text-center">
          Achievements & Awards
        </h3>
        <div className="mt-6 sm:mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16">
          {awards.map((award) => (
            <Image
              key={award.alt}
              src={award.src}
              alt={award.alt}
              width={award.width}
              height={award.height}
              className="object-contain w-16 h-16 sm:w-auto sm:h-auto"
            />
          ))}
        </div>
      </div> */}
    </SectionLayout>
  );
}
