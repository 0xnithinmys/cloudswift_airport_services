"use client";

import { motion, type Variants } from "framer-motion";
import { useId } from "react";
import { MARK, MARK_VIEWBOX } from "@/lib/logo";
import { ease } from "./ui";

type Props = {
  className?: string;
  variant?: keyof typeof MARK_VIEWBOX;
  // "gold" for dark backgrounds, "ink" for one-colour use on gold (the booking pass).
  tone?: keyof typeof TONES;
  // Fly the fish in when mounted or when scrolled into view; animated marks also take off again on hover.
  play?: "mount" | "inView";
  // with play="mount", hold the mark hidden until this turns true (used to wait for the intro curtain)
  active?: boolean;
  delay?: number;
};

const TONES = {
  gold: { light: "#fdebc0", mid: "#f4c97a", dark: "#b9842f", ring: "#f4c97a", trail: "#7aa7ff", eye: "#04060d" },
  ink: { light: "#04060d", mid: "#04060d", dark: "#04060d", ring: "#04060d", trail: "#04060d", eye: "#f4c97a" },
};

const centred = { transformBox: "fill-box", transformOrigin: "center" } as const;

const variants = (delay: number): Record<string, Variants> => ({
  // x is in the fish's own units, so it moves along the direction of flight
  fly: {
    hidden: { x: -26, opacity: 0 },
    show: { x: 0, opacity: 1, transition: { delay, duration: 1, ease } },
    redraw: { x: [0, 7, 0], transition: { duration: 0.8, ease: "easeInOut" } },
  },
  trail: {
    hidden: { pathLength: 0, opacity: 0 },
    show: { pathLength: 1, opacity: 1, transition: { delay: delay + 0.25, duration: 0.9, ease: "easeOut" } },
    redraw: { pathLength: [0, 1], opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  },
  pop: {
    hidden: { scale: 0, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: { delay: delay + 0.9, duration: 0.5, ease } },
    redraw: { scale: [1, 1.5, 1], rotate: [0, 90, 90], transition: { duration: 0.7, ease } },
  },
  ring: {
    hidden: { pathLength: 0, opacity: 0 },
    show: { pathLength: 1, opacity: 0.5, transition: { delay, duration: 1.4, ease: "easeInOut" } },
  },
  dots: {
    hidden: { rotate: -40, opacity: 0 },
    show: { rotate: 0, opacity: 0.45, transition: { delay: delay + 0.3, duration: 1.4, ease } },
  },
});

export default function LogoMark({ className, variant = "compact", tone = "gold", play, active = true, delay = 0 }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const c = TONES[tone];
  const v = variants(delay);
  const full = variant === "full";

  const trigger = !play
    ? { initial: false as const, animate: "show" }
    : play === "mount"
      ? { initial: "hidden", animate: active ? "show" : "hidden", whileHover: "redraw" }
      : { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.6 }, whileHover: "redraw" };

  return (
    <motion.svg viewBox={MARK_VIEWBOX[variant]} className={className} aria-hidden {...trigger}>
      <defs>
        <linearGradient id={`${uid}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.light} />
          <stop offset="0.5" stopColor={c.mid} />
          <stop offset="1" stopColor={c.dark} />
        </linearGradient>
        <linearGradient id={`${uid}t`} gradientUnits="userSpaceOnUse" x1="10" y1="0" x2="-12" y2="0">
          <stop offset="0" stopColor={c.trail} />
          <stop offset="1" stopColor={c.trail} stopOpacity="0" />
        </linearGradient>
      </defs>

      {full && (
        <>
          <motion.circle cx="60" cy="60" r="50" fill="none" stroke={c.ring} strokeWidth={1.6} variants={v.ring} />
          <motion.circle
            cx="60" cy="60" r="44" fill="none" stroke={c.ring} strokeWidth={1.2} strokeLinecap="round" strokeDasharray="0.1 4"
            variants={v.dots} style={centred}
          />
        </>
      )}

      <g transform={MARK.transform}>
        <motion.g variants={v.fly}>
          <g fill="none" stroke={`url(#${uid}t)`} strokeWidth={full ? 2 : 2.6} strokeLinecap="round">
            {MARK.trails.map((d) => (
              <motion.path key={d} d={d} variants={v.trail} />
            ))}
          </g>
          <path d={MARK.fish} fill={`url(#${uid}g)`} />
          <motion.path d={MARK.eye} fill={c.eye} variants={v.pop} style={centred} />
        </motion.g>
      </g>

      {full && <motion.path d={MARK.sparkle} fill={c.ring} variants={v.pop} style={centred} />}
    </motion.svg>
  );
}
