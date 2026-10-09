"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { BadgeCheck, CalendarCheck2, MailCheck, Plane } from "lucide-react";
import { useRef } from "react";
import { steps } from "@/lib/site";
import { SectionHeading, ease } from "./ui";

const themes = [
  "from-[#16224a] to-[#0b1124]",
  "from-[#2a1c4d] to-[#120c24]",
  "from-[#3b2a10] to-[#160f06]",
  "from-[#0f3a3a] to-[#071818]",
];

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="how" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow="How it works" title="Booked in minutes," accent="sorted for the journey." />
      </div>
      <div ref={ref} className="relative mx-auto mt-16 max-w-5xl px-4">
        {steps.map((s, i) => (
          <StepCard key={s.title} i={i} total={steps.length} progress={scrollYProgress} {...s} />
        ))}
      </div>
    </section>
  );
}

function StepCard({
  i, total, title, text, progress,
}: { i: number; total: number; title: string; text: string; progress: MotionValue<number> }) {
  const scale = useTransform(progress, [i / total, 1], [1, 1 - (total - i) * 0.05]);
  const rotateX = useTransform(progress, [i / total, (i + 1) / total], [0, i === total - 1 ? 0 : 8]);
  const shade = useTransform(progress, [i / total, 1], [0, (total - 1 - i) * 0.18]);

  return (
    <div className="sticky flex h-[70vh] min-h-[460px] items-start justify-center" style={{ top: `${110 + i * 26}px`, perspective: 1200 }}>
      <motion.div
        style={{ scale, rotateX, transformOrigin: "top center" }}
        className={`relative grid h-[min(440px,62vh)] w-full overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br ${themes[i]} p-8 shadow-[0_-20px_80px_-20px_rgba(0,0,0,0.9)] md:grid-cols-2 md:p-12`}
      >
        <motion.div aria-hidden style={{ opacity: shade }} className="pointer-events-none absolute inset-0 z-10 bg-black" />
        <div className="flex flex-col">
          <span className="font-serif text-7xl italic leading-none text-white/15 md:text-8xl">0{i + 1}</span>
          <h3 className="mt-auto text-3xl font-semibold text-white md:text-5xl">{title}</h3>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-white/60 md:text-lg">{text}</p>
        </div>
        <div className="relative hidden items-center justify-center md:flex">
          <Visual i={i} />
        </div>
      </motion.div>
    </div>
  );
}

function Visual({ i }: { i: number }) {
  const inView = { initial: "hidden", whileInView: "show", viewport: { once: false, amount: 0.6 } } as const;

  if (i === 0)
    return (
      <motion.div {...inView} className="w-72 space-y-3 rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur" style={{ rotateY: -12, rotateX: 6 }}>
        {["Meet & Greet — Arrival", "Dubai · DXB", "12 Oct · 2 passengers"].map((t, k) => (
          <motion.div
            key={t}
            variants={{ hidden: { opacity: 0, x: 30 }, show: { opacity: 1, x: 0, transition: { delay: k * 0.15, duration: 0.6, ease } } }}
            className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80"
          >
            {t}
          </motion.div>
        ))}
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { delay: 0.6 } } }}
          className="flex items-center justify-center gap-2 rounded-xl bg-gold py-3 text-sm font-bold text-ink"
        >
          <CalendarCheck2 className="h-4 w-4" /> Book
        </motion.div>
      </motion.div>
    );

  if (i === 1)
    return (
      <motion.div {...inView} className="relative grid h-56 w-56 place-items-center">
        {[0, 1, 2].map((k) => (
          <motion.span
            key={k}
            className="absolute inset-0 rounded-full border border-violet/40"
            animate={{ scale: [0.6, 1.4], opacity: [0.8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: k * 0.8 }}
          />
        ))}
        <motion.div
          variants={{ hidden: { scale: 0, rotate: -90 }, show: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 14 } } }}
          className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-violet to-sky shadow-[0_0_60px_rgba(167,139,250,0.6)]"
        >
          <MailCheck className="h-12 w-12 text-white" />
        </motion.div>
      </motion.div>
    );

  if (i === 2)
    return (
      <motion.div
        {...inView}
        variants={{ hidden: { rotateY: -70, opacity: 0 }, show: { rotateY: -14, opacity: 1, transition: { duration: 1, ease } } }}
        className="relative w-72 rounded-2xl border-4 border-white/80 bg-white px-6 py-8 text-center shadow-[0_30px_80px_-20px_rgba(244,201,122,0.5)]"
      >
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-ink/50">Welcome</p>
        <p className="mt-2 text-3xl font-black tracking-tight text-ink" style={{ fontFamily: "var(--font-display)" }}>MR. SHARMA</p>
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-ink/60">
          <BadgeCheck className="h-4 w-4 text-emerald-600" /> Your agent is here
        </div>
        <span className="absolute -top-8 left-1/2 h-8 w-1 -translate-x-1/2 bg-white/40" />
      </motion.div>
    );

  return (
    <motion.svg {...inView} viewBox="0 0 300 200" className="w-80">
      <motion.path
        d="M 10 170 C 80 170, 120 40, 290 30"
        fill="none"
        stroke="url(#g4)"
        strokeWidth="2"
        strokeDasharray="5 7"
        variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 1.6, ease: "easeInOut" } } }}
      />
      <defs>
        <linearGradient id="g4" x1="0" x2="1">
          <stop offset="0" stopColor="#5eead4" stopOpacity="0.2" />
          <stop offset="1" stopColor="#f4c97a" />
        </linearGradient>
      </defs>
      <motion.g
        variants={{ hidden: { x: 0, y: 140, opacity: 0 }, show: { x: 270, y: 0, opacity: 1, transition: { duration: 1.6, ease: "easeInOut" } } }}
      >
        <foreignObject x="-4" y="16" width="28" height="28">
          <Plane className="h-7 w-7 rotate-[-20deg] text-gold" />
        </foreignObject>
      </motion.g>
    </motion.svg>
  );
}
