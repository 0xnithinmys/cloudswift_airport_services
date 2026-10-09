"use client";

import { AnimatePresence, animate, motion, useAnimationFrame, useInView, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { Globe2, MapPin, MoveHorizontal } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { regions } from "@/lib/site";
import { SectionHeading, ease } from "./ui";

const STEP = 360 / regions.length;
const gradients = [
  "from-[#ff9a3c]/30 via-[#1a1206] to-[#0a0f1d]",
  "from-[#f4c97a]/30 via-[#1a1406] to-[#0a0f1d]",
  "from-[#2dd4bf]/25 via-[#061a18] to-[#0a0f1d]",
  "from-[#7aa7ff]/30 via-[#0a1230] to-[#0a0f1d]",
  "from-[#a78bfa]/30 via-[#140d2a] to-[#0a0f1d]",
];

/** 3D rotating carousel of regions. Drag to spin, click to select. */
export default function Coverage() {
  const rotation = useMotionValue(0);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage);
  const transform = useTransform(rotation, (r) => `translateZ(calc(var(--radius) * -1)) rotateY(${r}deg)`);

  useAnimationFrame((_, delta) => {
    if (paused || dragging || !inView) return;
    rotation.set(rotation.get() - delta * 0.006);
  });

  useMotionValueEvent(rotation, "change", (r) => {
    const idx = ((Math.round(-r / STEP) % regions.length) + regions.length) % regions.length;
    if (idx !== active) setActive(idx);
  });

  const goTo = (i: number) => {
    const current = rotation.get();
    const base = Math.round(current / 360) * 360;
    let target = base - i * STEP;
    if (target - current > 180) target -= 360;
    if (current - target > 180) target += 360;
    animate(rotation, target, { duration: 0.9, ease });
  };

  const region = regions[active];

  return (
    <section id="airports" className="relative overflow-hidden py-28 md:py-36">
      <div aria-hidden className="absolute left-1/2 top-1/3 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-sky/10 blur-[150px]" />
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Global coverage"
          title="Wherever you land,"
          accent="we're already there."
          text="A growing network of trained airport representatives across five regions."
        />
      </div>

      {/* 3D carousel */}
      <div
        ref={stage}
        className="relative mx-auto mt-14 h-[380px] w-full select-none [--radius:260px] md:h-[420px] md:[--radius:360px]"
        style={{ perspective: 1400 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-[320px] w-[230px] -translate-x-1/2 -translate-y-1/2 cursor-grab touch-pan-y active:cursor-grabbing md:h-[360px] md:w-[280px]"
          style={{ transformStyle: "preserve-3d", transform }}
          onPanStart={() => setDragging(true)}
          onPan={(_, info) => rotation.set(rotation.get() + info.delta.x * 0.35)}
          onPanEnd={(_, info) => {
            setDragging(false);
            const projected = rotation.get() + info.velocity.x * 0.08;
            animate(rotation, Math.round(projected / STEP) * STEP, { duration: 0.8, ease });
          }}
        >
          {regions.map((r, i) => (
            <button
              key={r.name}
              onClick={() => goTo(i)}
              className={`glow-border absolute inset-0 rounded-[28px] backface-hidden ${active === i ? "is-active" : ""}`}
              style={{ transform: `rotateY(${i * STEP}deg) translateZ(var(--radius))` }}
            >
              <div className={`relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b ${gradients[i]} p-6 text-left`}>
                <Globe2 className="h-8 w-8 text-white/70" strokeWidth={1.3} />
                <p className="mt-auto font-serif text-7xl italic leading-none text-white/90">{r.airports.length}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">airports</p>
                <h3 className="mt-4 text-3xl font-semibold text-white">{r.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-white/55">{r.airports.slice(0, 4).join(" · ")}</p>
              </div>
            </button>
          ))}
        </motion.div>
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-muted">
        <MoveHorizontal className="h-4 w-4" /> Drag to explore
      </p>

      {/* Airports in selected region */}
      <div className="mx-auto mt-12 max-w-6xl px-4">
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {regions.map((r, i) => (
            <button
              key={r.name}
              onClick={() => goTo(i)}
              className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors ${active === i ? "text-ink" : "text-muted hover:text-white"}`}
            >
              {active === i && (
                <motion.span layoutId="region-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              <span className="relative">{r.name}</span>
            </button>
          ))}
        </div>
        <div className="min-h-[180px]">
          <AnimatePresence mode="wait">
            <motion.ul
              key={region.name}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              variants={{ show: { transition: { staggerChildren: 0.03 } } }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
            >
              {region.airports.map((a) => (
                <motion.li
                  key={a}
                  variants={{ hidden: { opacity: 0, y: 16, rotateX: -40 }, show: { opacity: 1, y: 0, rotateX: 0 } }}
                  transition={{ duration: 0.5, ease }}
                  className="group flex items-center gap-3 rounded-2xl border border-line bg-white/[0.03] px-4 py-4 transition-colors hover:border-gold/40 hover:bg-white/[0.06]"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:-translate-y-0.5 group-hover:scale-110" />
                  <span className="text-sm font-medium text-text">{a}</span>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
        <p className="mt-8 text-center text-sm text-muted">
          Don&apos;t see your airport?{" "}
          <Link href="#contact" className="text-white underline decoration-gold/50 underline-offset-4 hover:decoration-gold">Ask us</Link>{" "}
          — we likely cover it.
        </p>
      </div>
    </section>
  );
}
