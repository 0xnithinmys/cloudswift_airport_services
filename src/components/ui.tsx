"use client";

import {
  motion, useMotionTemplate, useMotionValue, useSpring, useTransform, type HTMLMotionProps,
} from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import {
  Armchair, Car, HeartHandshake, Luggage, PlaneLanding, PlaneTakeoff, Repeat, Users, Zap,
  type LucideIcon,
} from "lucide-react";

export const icons: Record<string, LucideIcon> = {
  Armchair, Car, HeartHandshake, Luggage, PlaneLanding, PlaneTakeoff, Repeat, Users, Zap,
};

export const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...rest
}: { delay?: number; y?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Splits text into characters that flip up in 3D. */
export function SplitText({
  text,
  className = "",
  delay = 0,
  inView = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  inView?: boolean;
}) {
  const words = text.split(" ");
  let idx = 0;
  const trigger = inView
    ? { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-60px" } }
    : { initial: "hidden", animate: "show" };
  return (
    <motion.span {...trigger} className={`inline-block ${className}`} style={{ perspective: 600 }}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {w.split("").map((c) => {
            const i = idx++;
            return (
              <motion.span
                key={i}
                className="inline-block origin-bottom"
                variants={{
                  hidden: { opacity: 0, y: "60%", rotateX: -90 },
                  show: { opacity: 1, y: 0, rotateX: 0 },
                }}
                transition={{ duration: 0.8, delay: delay + i * 0.025, ease }}
              >
                {c}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted backdrop-blur">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
      </span>
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  text,
  center = true,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  text?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <h2 className="mt-6 text-4xl font-semibold leading-[1.02] text-white md:text-6xl">
        <SplitText text={title} inView />{" "}
        {accent && (
          <SplitText text={accent} inView delay={0.25} className="font-serif font-normal italic tracking-normal text-gold" />
        )}
      </h2>
      {text && (
        <Reveal delay={0.2}>
          <p className="mt-5 text-lg leading-relaxed text-muted">{text}</p>
        </Reveal>
      )}
    </div>
  );
}

/** 3D tilt card with moving glare and depth for children using translateZ. */
export function TiltCard({
  children,
  className = "",
  max = 10,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 180, damping: 18 });
  const gx = useTransform(mx, (v) => v * 100);
  const gy = useTransform(my, (v) => v * 100);
  const glareBg = useMotionTemplate`radial-gradient(500px circle at ${gx}% ${gy}%, rgba(255,255,255,0.13), transparent 45%)`;

  return (
    <div style={{ perspective: 1100 }} className="h-full">
      <motion.div
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className={`group relative h-full ${className}`}
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: glareBg }}
          />
        )}
      </motion.div>
    </div>
  );
}

export function MagneticButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 15 });
  const y = useSpring(0, { stiffness: 220, damping: 15 });

  const styles =
    variant === "primary"
      ? "bg-white text-ink shadow-[0_10px_40px_-10px_rgba(244,201,122,0.6)]"
      : "border border-white/15 bg-white/[0.04] text-white backdrop-blur";

  return (
    <motion.span style={{ x, y }} className="inline-block">
      <Link
        ref={ref}
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        onMouseMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          x.set((e.clientX - r.left - r.width / 2) * 0.3);
          y.set((e.clientY - r.top - r.height / 2) * 0.4);
        }}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-bold ${styles} ${className}`}
      >
        <span
          aria-hidden
          className={`absolute inset-0 translate-y-full rounded-full transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0 ${
            variant === "primary" ? "bg-gold" : "bg-white/10"
          }`}
        />
        <span className="relative flex items-center gap-2">{children}</span>
      </Link>
    </motion.span>
  );
}
