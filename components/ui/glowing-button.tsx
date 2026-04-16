"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
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

  const stops = [
    -halfWidth, -0.7 * halfWidth, -0.3 * halfWidth, 0,
    0.3 * halfWidth, 0.7 * halfWidth, halfWidth,
  ];
  const opacityStops = [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1];
  const opacityStopsReversed = [1, 0.9, 0.7, 0.5, 0.3, 0.1, 0];

  const glowX = useTransform(x, stops, stops);
  const leftOpacity = useTransform(x, stops, opacityStops);
  const rightOpacity = useTransform(x, stops, opacityStopsReversed);

  const outerClasses = cn(
    "relative inline-flex items-center justify-center",
    "whitespace-nowrap uppercase font-bold",
    "rounded-full border border-white/60 bg-[#d1d1d1]",
    "text-black -tracking-[0.015em] overflow-hidden",
    "transition-all duration-200",
    className,
  );

  const Tag = href ? "a" : "button";
  const linkProps = href ? { href } : {};

  return (
    <div
      ref={wrapperRef}
      className="relative inline-flex items-center"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Outer bright bloom — large fiery halo behind the button */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          width: "calc(100% + 70px)",
          height: "calc(100% + 70px)",
          opacity: leftOpacity,
          background:
            "radial-gradient(ellipse 55% 90% at 75% 50%, rgba(255,255,245,0.7) 0%, rgba(255,170,129,0.8) 20%, rgba(233,132,99,0.6) 40%, rgba(205,49,0,0.3) 65%, transparent 90%)",
          filter: "blur(16px)",
          borderRadius: "9999px",
        }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          width: "calc(100% + 70px)",
          height: "calc(100% + 70px)",
          opacity: rightOpacity,
          background:
            "radial-gradient(ellipse 55% 90% at 25% 50%, rgba(255,255,245,0.7) 0%, rgba(255,170,129,0.8) 20%, rgba(233,132,99,0.6) 40%, rgba(205,49,0,0.3) 65%, transparent 90%)",
          filter: "blur(16px)",
          borderRadius: "9999px",
        }}
      />

      {/* Border glow — left side */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[calc(100%+10px)] w-[calc(100%+10px)] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
        style={{ opacity: leftOpacity }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: "transparent",
            background:
              "linear-gradient(transparent,transparent) padding-box, linear-gradient(103.7deg, hsla(15,25%,65%,.3) 20%, rgba(233,132,99,.5) 50%, #e98463 75%, #fff 92%) border-box",
          }}
        />
      </motion.div>

      {/* Border glow — right side (mirrored) */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[calc(100%+10px)] w-[calc(100%+10px)] -translate-x-1/2 -translate-y-1/2 scale-x-[-1] rounded-full will-change-transform"
        style={{ opacity: rightOpacity }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: "transparent",
            background:
              "linear-gradient(transparent,transparent) padding-box, linear-gradient(103.7deg, hsla(15,25%,65%,.3) 20%, rgba(233,132,99,.5) 50%, #e98463 75%, #fff 92%) border-box",
          }}
        />
      </motion.div>

      {/* The actual button — clips everything inside */}
      <Tag className={outerClasses} onClick={onClick} {...linkProps}>
        {/* Warm radial glow that tracks the mouse — clipped by overflow-hidden */}
        <motion.div
          className="pointer-events-none absolute inset-y-0 flex w-[180px] items-center justify-center"
          style={{ x: glowX }}
        >
          <div className="absolute h-[100px] w-[100px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,245,0.95)_0%,#FFAA81_20%,#FFDA9F_35%,rgba(255,170,129,0.7)_50%,rgba(210,106,58,0.00)_85%)]" />
          <div className="absolute h-[80px] w-[180px] bg-[radial-gradient(43%_44%_at_50%_50%,rgba(255,255,247,0.9)_15%,#FFFACD_35%,#F4D2BF_55%,rgba(214,211,210,0.00)_100%)] blur-sm" />
        </motion.div>

        {/* Text content */}
        <span className="relative z-10 flex items-center gap-3">
          {children}
          <span aria-hidden="true">&rarr;</span>
        </span>
      </Tag>
    </div>
  );
}
