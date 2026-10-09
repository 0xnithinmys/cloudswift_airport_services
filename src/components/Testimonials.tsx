"use client";

import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";
import { useRef } from "react";
import { testimonials } from "@/lib/site";
import { SectionHeading } from "./ui";

/** Tilted 3D wall of review cards scrolling in alternating directions. */
export default function Testimonials() {
  const wall = useRef<HTMLDivElement>(null);
  const inView = useInView(wall);
  const cols = [0, 1, 2, 3].map((c) => [...testimonials.slice(c % testimonials.length), ...testimonials.slice(0, c % testimonials.length)]);

  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow="Traveller stories" title="Calm journeys," accent="happy travellers." />
      </div>

      <div ref={wall} className="relative mx-auto mt-10 h-[640px] max-w-7xl overflow-hidden" style={{ perspective: 1200 }}>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />

        <div
          className="absolute left-1/2 top-1/2 grid w-[1400px] grid-cols-4 gap-5"
          style={{ transform: "translate(-50%, -50%) rotateX(38deg) rotateY(0deg) rotateZ(-18deg)", transformStyle: "preserve-3d" }}
        >
          {cols.map((items, c) => (
            <motion.div
              key={c}
              className="flex flex-col gap-5"
              animate={inView ? { y: c % 2 ? ["-50%", "0%"] : ["0%", "-50%"] } : undefined}
              transition={{ duration: 30 + c * 4, repeat: Infinity, ease: "linear" }}
            >
              {[...items, ...items].map((t, i) => (
                <motion.figure
                  key={i}
                  whileHover={{ z: 40, scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#141a2b] to-[#0c1120] p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]"
                >
                  <Quote className="h-6 w-6 text-gold/70" />
                  <blockquote className="mt-4 text-[15px] leading-relaxed text-text">{t.quote}</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 text-sm">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-sky to-gold text-xs font-bold text-ink">
                      {t.place[0]}
                    </span>
                    <span>
                      <span className="block font-semibold text-white">{t.name}</span>
                      <span className="text-muted">{t.place}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
