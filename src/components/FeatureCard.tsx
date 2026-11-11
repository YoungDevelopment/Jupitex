import FeatureTile, { type TileName } from "@/components/stageshow/FeatureTiles";

export interface FeatureCardProps {
  tile: TileName;
  title: string;
  description: string;
  /** Optional list shown under the description (the services use it for what is included). */
  items?: string[];
}

/**
 * The one card used by both Services and Why Jupitex, so the two rows match:
 * an illustration that plays on hover, then the words.
 */
export default function FeatureCard({ tile, title, description, items }: FeatureCardProps) {
  return (
    <article className="spot-card flex flex-col rounded-3xl bg-card text-left lg:min-h-[512px] border border-black/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="shrink-0 overflow-hidden rounded-t-3xl" aria-hidden>
        <FeatureTile name={tile} />
      </div>
      <div className="flex flex-1 flex-col px-5 sm:px-6 md:px-7 pt-6 pb-6 sm:pb-7">
        <h3 className="text-[1.375rem] sm:text-[1.5rem] font-semibold leading-[1.16] tracking-[-0.02em] text-apple-near-black">
          {title}
        </h3>
        <p className="mt-3 text-[15px] sm:text-[15.5px] leading-[1.55] text-[#55585c]">{description}</p>
        {items && (
          <ul className="mt-auto pt-5 flex flex-wrap gap-2">
            {items.map((item) => (
              <li
                key={item}
                className="rounded-full bg-apple-light-gray px-3 py-1.5 text-[13px] font-medium text-apple-near-black"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
