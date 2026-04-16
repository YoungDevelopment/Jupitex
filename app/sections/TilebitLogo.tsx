import { cn } from "@/lib/utils";
import SectionWrapper from "../components/sectionWrapper";

interface TilebitLogoProps {
  className?: string;
  variant?: "light" | "medium" | "dark";
}

const variantStyles = {
  light: "opacity-30",
  medium: "opacity-50",
  dark: "opacity-80",
} as const;

export default function TilebitLogo({
  className,
  variant = "medium",
}: TilebitLogoProps) {
  return (
    
      <div
        className={cn(
          "flex items-center gap-2 select-none",
          variantStyles[variant],
          className,
        )}
      >
        {/* 8-pointed star / asterisk icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M12 0L14.12 5.26L18.36 1.76L16.74 7.26L22.39 6.18L18.48 10.08L24 12L18.48 13.92L22.39 17.82L16.74 16.74L18.36 22.24L14.12 18.74L12 24L9.88 18.74L5.64 22.24L7.26 16.74L1.61 17.82L5.52 13.92L0 12L5.52 10.08L1.61 6.18L7.26 7.26L5.64 1.76L9.88 5.26L12 0Z"
            fill="currentColor"
          />
        </svg>
        <span className="whitespace-nowrap text-lg font-semibold tracking-tight">
          tilebit
        </span>
      </div>

  );
}
