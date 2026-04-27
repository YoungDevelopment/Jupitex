"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

interface GlowingButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}

const SPRING_INITIAL = { stiffness: 10000, damping: 500 };
const SPRING_LEAVE = { stiffness: 100, damping: 20 };

export function GlowingButton({
  children,
  className,
  href,
  onClick,
}: GlowingButtonProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [halfWidth, setHalfWidth] = useState(105);

  const rawX = useMotionValue(halfWidth);
  const [springConfig, setSpringConfig] = useState(SPRING_INITIAL);
  const x = useSpring(rawX, springConfig);

  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const hw = wrapperRef.current.getBoundingClientRect().width / 2 - 6;
    if (hw !== halfWidth) {
      setHalfWidth(hw);
      rawX.set(hw);
    }
  }, [halfWidth, rawX]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (leaveTimer.current) {
        setSpringConfig(SPRING_INITIAL);
        clearTimeout(leaveTimer.current);
        leaveTimer.current = null;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      rawX.set(localX - rect.width / 2);
    },
    [rawX],
  );

  const onMouseLeave = useCallback(() => {
    setSpringConfig(SPRING_LEAVE);
    leaveTimer.current = setTimeout(() => {
      rawX.set(halfWidth);
      setSpringConfig(SPRING_INITIAL);
    }, 1000);
  }, [rawX, halfWidth]);

  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  const xStops = [
    -halfWidth,
    -0.7 * halfWidth,
    -0.3 * halfWidth,
    0,
    0.3 * halfWidth,
    0.7 * halfWidth,
    halfWidth,
  ];
  const leftOpacityStops = [
    0,
    0.1 * halfWidth,
    0.3 * halfWidth,
    0.5 * halfWidth,
    0.7 * halfWidth,
    0.9 * halfWidth,
    halfWidth,
  ];
  const rightOpacityStops = [
    -halfWidth,
    -0.9 * halfWidth,
    -0.7 * halfWidth,
    -0.5 * halfWidth,
    -0.3 * halfWidth,
    -0.1 * halfWidth,
    0,
  ];
  const opacityOut = [0.02, 0.06, 0.18, 0.6, 0.92, 1, 1];
  const opacityOutReversed = [1, 1, 0.92, 0.6, 0.18, 0.06, 0.02];

  const glowX = useTransform(x, xStops, xStops);
  const leftOpacity = useTransform(x, rightOpacityStops, opacityOutReversed);
  const rightOpacity = useTransform(x, leftOpacityStops, opacityOut);

  const outerClasses = cn(
    "relative z-10 inline-flex items-center justify-center",
    "whitespace-nowrap uppercase font-bold",
    "rounded-full border border-white/60 bg-[#d1d1d1]",
    "-tracking-[0.015em] overflow-hidden",
    "transition-all duration-200",
    className,
  );

  const Tag = href ? "a" : "button";
  const linkProps = href ? { href } : {};

  return (
    <div
      ref={wrapperRef}
      className="relative isolate inline-flex items-center"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Border glow — left side */}
      <motion.div
        className="border-button-light-blur pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[calc(100%+9px)] w-full -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
        style={{ opacity: rightOpacity }}
      >
        <div className="border-button-light relative h-full w-full rounded-full" />
      </motion.div>

      {/* Border glow — right side (mirrored) */}
      <motion.div
        className="border-button-light-blur pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[calc(100%+9px)] w-full -translate-x-1/2 -translate-y-1/2 scale-x-[-1] rounded-full will-change-transform"
        style={{ opacity: leftOpacity }}
      >
        <div className="border-button-light relative h-full w-full rounded-full" />
      </motion.div>

      {/* The actual button — clips everything inside */}
      <Tag className={outerClasses} onClick={onClick} {...linkProps}>
        {/* Warm radial glow that tracks the mouse — clipped by overflow-hidden */}
        <motion.div
          className="pointer-events-none absolute left-0 top-1/2 -z-10 flex w-[204px] -translate-y-1/2 items-center justify-center"
          style={{ x: glowX }}
        >
          <div className="absolute top-1/2 h-[132px] w-[132px] -translate-y-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,#FFFFFF_0%,#FFF7D9_18%,#FFB085_34%,#FFDA9F_46%,rgba(255,170,129,0.72)_60%,rgba(210,106,58,0.00)_96%)]" />
          <div className="absolute top-1/2 h-[114px] w-[224px] -translate-y-1/2 bg-[radial-gradient(44%_46%_at_50%_49.51%,#FFFFFF_18%,#FFFBD7_42%,#F6DBC8_63%,rgba(214,211,210,0.18)_86%,rgba(214,211,210,0.00)_100%)] blur-[10px]" />
        </motion.div>

        {/* Text content */}
        <span className="flex items-center gap-x-1 text-[#5A250A]">
          <span>{children}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 9"
            aria-hidden="true"
            className="h-[9px] w-[17px]"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
              d="m12.495 0 4.495 4.495-4.495 4.495-.99-.99 2.805-2.805H0v-1.4h14.31L11.505.99z"
            />
          </svg>
        </span>
      </Tag>
    </div>
  );
}
