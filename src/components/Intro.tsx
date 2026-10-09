"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { INTRO_KEY } from "@/lib/logo";
import { site } from "@/lib/site";
import LogoMark from "./Logo";
import { ease } from "./ui";

// Full-screen logo reveal, played once per browser session. A head script in the layout sets
// html[data-intro-seen] before paint for repeat visits and reduced-motion users, so CSS hides it instantly.
export default function Intro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let seen = document.documentElement.hasAttribute("data-intro-seen");
    try {
      seen ||= sessionStorage.getItem(INTRO_KEY) === "1";
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {}
    const t = setTimeout(() => setShow(false), seen ? 0 : 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          aria-hidden
          className="intro-overlay fixed inset-0 z-[80] grid place-items-center bg-ink"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease }}
        >
          <motion.div
            className="pointer-events-none absolute h-[60vmin] w-[60vmin] rounded-full bg-gold/10 blur-3xl"
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
              className="text-[11px] font-semibold uppercase text-gold"
              initial={{ opacity: 0, letterSpacing: "0.7em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              transition={{ delay: 1.35, duration: 0.9, ease }}
            >
              WorldWide Airport Assist
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
