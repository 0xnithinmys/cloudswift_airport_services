"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, BadgeCheck, Clock3, PlaneLanding, PlaneTakeoff, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import Globe from "./Globe";
import { Eyebrow, MagneticButton, SplitText, ease } from "./ui";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const globeY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
      className="noise relative isolate overflow-hidden pt-36 md:pt-44"
    >
      <Backdrop progress={scrollYProgress} />

      <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Eyebrow>Meet &amp; assist · 60+ airports · 24/7</Eyebrow>
        </motion.div>

        <h1 className="mt-8 text-[13vw] font-semibold leading-[0.92] text-white sm:text-7xl md:text-8xl lg:text-[7.5rem]">
          <SplitText text="Glide through" delay={0.1} />
          <br />
          <SplitText text="every airport," delay={0.35} />
          <br />
          <SplitText text="effortlessly." delay={0.6} className="font-serif font-normal italic tracking-normal text-shine" />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 1, ease }}
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl"
        >
          Personal meet &amp; greet, VIP fast track, transit help, lounges, porters and private transfers —
          one trusted team from curb to gate, across four continents.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.15, ease }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <MagneticButton href="#book">
            Book assistance <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </MagneticButton>
          <MagneticButton href="#services" variant="ghost">
            Explore services
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Globe stage */}
      <div className="relative mx-auto -mt-6 h-[58vh] min-h-[420px] max-w-6xl md:h-[72vh]">
        <motion.div
          initial={{ opacity: 0, y: 120, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.4, ease }}
          className="absolute left-1/2 top-0 w-[150vw] max-w-[1000px] -translate-x-1/2 sm:w-[110vw]"
        >
          <motion.div style={{ scale: globeScale, y: globeY }}>
            <div aria-hidden className="absolute inset-[12%] rounded-full bg-sky/25 blur-[90px]" />
            <Globe />
          </motion.div>
        </motion.div>

        <FloatCard depth={40} sx={sx} sy={sy} delay={1.4} className="left-[2%] top-[12%] md:left-[6%]">
          <Icon className="bg-emerald-400/15 text-emerald-300"><BadgeCheck className="h-4 w-4" /></Icon>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted">Agent assigned</p>
            <p className="text-sm font-semibold text-white">Dubai · Terminal 3</p>
          </div>
        </FloatCard>

        <FloatCard depth={-55} sx={sx} sy={sy} delay={1.6} className="right-[2%] top-[22%] md:right-[6%]">
          <Icon className="bg-gold/15 text-gold"><Clock3 className="h-4 w-4" /></Icon>
          <div className="w-36">
            <p className="text-[11px] uppercase tracking-wider text-muted">Fast track</p>
            <p className="text-sm font-semibold text-white">Queue skipped</p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold to-[#ffe7b5]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.4, delay: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
              />
            </div>
          </div>
        </FloatCard>

        <FloatCard depth={70} sx={sx} sy={sy} delay={1.8} className="bottom-[26%] left-[4%] hidden sm:block md:left-[12%]">
          <Icon className="bg-sky/15 text-sky"><PlaneTakeoff className="h-4 w-4" /></Icon>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted">Transit</p>
            <p className="text-sm font-semibold text-white">DEL → LHR · Connected</p>
          </div>
        </FloatCard>

        <FloatCard depth={-35} sx={sx} sy={sy} delay={2} className="bottom-[34%] right-[4%] hidden sm:block md:right-[13%]">
          <Icon className="bg-violet/15 text-violet"><PlaneLanding className="h-4 w-4" /></Icon>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted">Arrival</p>
            <p className="flex items-center gap-1 text-sm font-semibold text-white">
              Name board ready <Sparkles className="h-3.5 w-3.5 text-gold" />
            </p>
          </div>
        </FloatCard>

        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
      </div>
    </section>
  );
}

function Icon({ children, className }: { children: React.ReactNode; className: string }) {
  return <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${className}`}>{children}</span>;
}

function FloatCard({
  children,
  className,
  depth,
  sx,
  sy,
  delay,
}: {
  children: React.ReactNode;
  className: string;
  depth: number;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  delay: number;
}) {
  const x = useTransform(sx, (v) => v * depth);
  const y = useTransform(sy, (v) => v * depth);
  return (
    <motion.div style={{ x, y }} className={`absolute z-20 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
        transition={{
          opacity: { duration: 0.8, delay },
          scale: { duration: 0.8, delay, ease },
          y: { duration: 5 + depth / 40, repeat: Infinity, ease: "easeInOut", delay },
        }}
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0d1426]/90 p-3 pr-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function Backdrop({ progress }: { progress: MotionValue<number> }) {
  const scale = useTransform(progress, [0, 1], [1.05, 1.3]);
  const y = useTransform(progress, [0, 1], [0, 160]);
  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      {/* anime sky, mirrored so its painted jet sits top-left and the 3D jet enters top-right */}
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <Image
          src="/images/hero-sky.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-scale-x-100 object-cover object-top opacity-60"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(4,6,13,0.55),rgba(4,6,13,0.15)_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent via-ink/80 to-ink" />
      <div className="grid-bg absolute inset-0 opacity-50" />
      <motion.div
        className="absolute -top-56 left-1/2 h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(122,167,255,0.28),transparent)]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[-10%] top-[30%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(167,139,250,0.18),transparent)]"
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-10%] top-[10%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(closest-side,rgba(244,201,122,0.16),transparent)]"
        animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-px w-px rounded-full bg-white"
          style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 70}%` }}
          animate={{ opacity: [0.1, 0.9, 0.1] }}
          transition={{ duration: 2 + (i % 5), repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}
