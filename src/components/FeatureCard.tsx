import Image from "next/image";
import { cn } from "@/lib/utils";

export interface FeatureCardProps {
  image: string;
  imageAlt: string;
  /** The image's pixel size, so the frame matches it and nothing is cropped. */
  imageWidth: number;
  imageHeight: number;
  title: string;
  description: string;
  /** Optional list shown under the description (the services use it for what is included). */
  items?: string[];
  /** Where the image sits. Services puts it under the words; Why Jupitex keeps it on top. */
  imagePosition?: "top" | "bottom";
  className?: string;
}

/**
 * The one card used by both Services and Why Jupitex, so the two rows match:
 * an image and the words, with the image above or below them.
 */
export default function FeatureCard({
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  title,
  description,
  items,
  imagePosition = "top",
  className,
}: FeatureCardProps) {
  const bottom = imagePosition === "bottom";
  const picture = (
    // At the bottom, mt-auto pins the image to the card's foot so a row of cards lines up
    <div className={`shrink-0 overflow-hidden bg-[#f5f6f7] ${bottom ? "mt-auto rounded-b-3xl" : "rounded-t-3xl"}`}>
      <Image
        src={image}
        alt={imageAlt}
        width={imageWidth}
        height={imageHeight}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="block h-auto w-full"
      />
    </div>
  );

  return (
    <article
      className={cn(
        "flex flex-col rounded-3xl bg-card text-left lg:min-h-[calc(512px*var(--ui))] border border-black/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
        className
      )}
    >
      {!bottom && picture}
      <div className={`flex flex-col px-5 sm:px-6 md:px-7 pb-6 sm:pb-7 ${bottom ? "pt-7 sm:pt-8" : "flex-1 pt-6"}`}>
        <h3 className="text-[1.375rem] sm:text-[1.5rem] font-semibold leading-[1.16] tracking-[-0.02em] text-apple-near-black">
          {title}
        </h3>
        <p className="mt-3 text-[0.9375rem] sm:text-[0.9688rem] leading-[1.55] text-[#55585c]">{description}</p>
        {items && (
          <ul className={`${bottom ? "" : "mt-auto"} pt-5 flex flex-wrap gap-2`}>
            {items.map((item) => (
              <li
                key={item}
                className="rounded-full bg-apple-light-gray px-3 py-1.5 text-[0.8125rem] font-medium text-apple-near-black"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
      {bottom && picture}
    </article>
  );
}
