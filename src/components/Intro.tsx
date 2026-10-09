"use client";

import { motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { INTRO_KEY } from "@/lib/logo";
import { site } from "@/lib/site";
import { advanceStage } from "@/lib/stage";
import LogoMark from "./Logo";
import { ease } from "./ui";

// First-visit timeline (ms). Every intro animation has finished by PREPARE_AT, so the WebGL start-up that
// happens then is never seen; the curtain lift is a CSS transform, so it stays smooth even if JS is busy.
const PREPARE_AT = 2250;
const LIFT_AT = 2450;
const ENTRANCE_MS = 2600; // hero entrance length after the reveal, before the 3D jet may load

// Full-screen logo reveal, played once per browser session. The head script in the layout sets
// html[data-intro-seen] before paint for repeat visits and reduced-motion users, so CSS hides it instantly.
export default function Intro() {
  const [phase, setPhase] = useState<"playing" | "leaving" | "gone">("playing");
  const lenis = useLenis();

  useEffect(() => {
    const skip = document.documentElement.hasAttribute("data-intro-seen");
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {}

    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    if (skip) {
      // no intro: let WebGL initialise first, then reveal a couple of frames later
      advanceStage("prepare");
      at(60, () => {
        setPhase("gone");
        advanceStage("reveal");
      });
      at(60 + ENTRANCE_MS, () => advanceStage("settled"));
    } else {
      at(PREPARE_AT, () => advanceStage("prepare"));
      at(LIFT_AT, () => {
        setPhase("leaving");
        advanceStage("reveal");
      });
      at(LIFT_AT + ENTRANCE_MS, () => advanceStage("settled"));
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  // no scrolling underneath the intro
  useEffect(() => {
    if (phase === "playing") lenis?.stop();
    else lenis?.start();
  }, [lenis, phase]);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      className="intro-overlay fixed inset-0 z-[80] grid place-items-center bg-ink transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] will-change-transform"
      style={{ transform: phase === "leaving" ? "translate3d(0,-100%,0)" : "translate3d(0,0,0)" }}
      onTransitionEnd={(e) => e.target === e.currentTarget && setPhase("gone")}
    >
      <motion.div
        className="pointer-events-none absolute h-[80vmin] w-[80vmin] rounded-full bg-[radial-gradient(closest-side,rgba(244,201,122,0.16),transparent)]"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease }}
      />
      <div className="relative flex flex-col items-center gap-4">
        <LogoMark variant="full" play="mount" delay={0.15} className="h-36 w-36 md:h-44 md:w-44" />
        <div className="overflow-hidden">
          <motion.p
            className="mr-[-0.12em] font-brand text-5xl font-semibold uppercase tracking-[0.12em] text-[#f3ead8] md:text-6xl"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ delay: 1.0, duration: 0.8, ease }}
          >
            {site.name}
          </motion.p>
        </div>
        <motion.p
          className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8, ease }}
        >
          WorldWide Airport Assist
        </motion.p>
      </div>
    </div>
  );
}
