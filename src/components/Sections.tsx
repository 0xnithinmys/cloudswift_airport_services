"use client";

import {
  AnimatePresence, animate, motion, useAnimationFrame, useInView, useMotionValue, useScroll, useSpring,
  useTransform, useVelocity, type MotionValue,
} from "framer-motion";
import { ArrowUpRight, Mail, MessageCircle, Phone, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { faqs, regions, services, site } from "@/lib/site";
import { MagneticButton, Reveal, SectionHeading, TiltCard, ease, icons } from "./ui";

/* ---------------- Scroll-velocity marquee ---------------- */

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

function VelocityRow({ items, base, serif, active }: { items: string[]; base: number; serif?: boolean; active: boolean }) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [0, 1000], [0, 5], { clamp: false });
  const dir = useRef(1);
  const tx = useTransform(x, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (!active) return;
    let move = dir.current * base * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    x.set(x.get() + move);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div style={{ x: tx }} className="flex w-max">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {items.map((a) => (
              <span
                key={a + k}
                className={`flex items-center gap-8 px-4 text-4xl md:text-6xl ${
                  serif ? "font-serif italic text-white/25" : "font-semibold tracking-tight text-white/90"
                }`}
                style={serif ? undefined : { fontFamily: "var(--font-display)" }}
              >
                {a}
                <span className="text-2xl text-gold/70">✦</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function VelocityMarquee() {
  const airports = regions.flatMap((r) => r.airports).slice(0, 18);
  const ref = useRef<HTMLElement>(null);
  const active = useInView(ref);
  return (
    <section ref={ref} className="relative -rotate-2 space-y-4 border-y border-line bg-panel/60 py-8">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-ink to-transparent" />
      <VelocityRow items={airports} base={-2} active={active} />
      <VelocityRow items={services.map((s) => s.title.replace("Meet & Greet — ", ""))} base={2} serif active={active} />
    </section>
  );
}

/* ---------------- Manifesto: scroll-linked word reveal ---------------- */

const manifesto =
  "Airports are stressful. Long queues, confusing terminals, tight connections and heavy bags. We turn all of it into a calm, guided walk — a friendly face at the gate, a hand with your luggage, and a fast lane wherever one exists.";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = manifesto.split(" ");
  return (
    <section className="mx-auto max-w-5xl px-4 py-32 md:py-44">
      <p
        ref={ref}
        className="text-3xl font-medium leading-[1.25] text-white md:text-5xl"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
      >
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </p>
    </section>
  );
}

/* ---------------- Services: 3D bento ---------------- */

export function Services() {
  return (
    <section id="services" className="relative py-28 md:py-36">
      <div aria-hidden className="absolute right-0 top-40 -z-10 h-[500px] w-[500px] rounded-full bg-violet/10 blur-[140px]" />
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="What we do"
          title="Every airport moment,"
          accent="handled."
          text="From the curb to the cabin door, choose exactly the help you need — or combine services for a seamless door-to-door journey."
        />
        <div className="mt-16 grid auto-rows-[minmax(260px,auto)] gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal
              key={s.slug}
              delay={(i % 3) * 0.1}
              y={50}
              className={i === 0 ? "md:col-span-2 lg:row-span-2" : ""}
            >
              <ServiceCard service={s} index={i} big={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index, big }: { service: (typeof services)[number]; index: number; big: boolean }) {
  const Icon = icons[service.icon];
  return (
    <Link href={`/services/${service.slug}`} className="block h-full rounded-[28px]">
      <TiltCard max={big ? 6 : 10} className="glow-border rounded-[28px]">
        {/* no overflow-hidden here: it would flatten the translateZ depth layers */}
        <div className="relative flex h-full flex-col rounded-[28px] border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-7 preserve-3d md:p-8">
          <div aria-hidden className="absolute inset-0 overflow-hidden rounded-[28px]">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gold/0 blur-3xl transition-colors duration-700 group-hover:bg-gold/20" />
          </div>
          {service.image ? (
            // illustration floats forward in 3D; overflow-hidden only clips the image itself
            <div
              style={{ transform: "translateZ(30px)" }}
              className={`relative -mx-3 -mt-3 mb-6 overflow-hidden rounded-[20px] border border-white/10 shadow-[0_25px_50px_-20px_rgba(0,0,0,0.9)] md:-mx-4 md:-mt-4 ${big ? "min-h-64 flex-1" : "h-48"}`}
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes={big ? "(min-width: 1024px) 760px, 100vw" : "(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"}
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1c] via-[#0b0f1c]/10 to-transparent" />
              <span className="absolute right-4 top-3 font-serif text-3xl italic text-white/80 drop-shadow">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center rounded-xl border border-white/20 bg-[#0b0f1c]/70 text-gold">
                <Icon className="h-5 w-5" />
              </span>
            </div>
          ) : (
            <div className="flex items-start justify-between preserve-3d">
              <Icon
                aria-hidden
                strokeWidth={0.6}
                className="pointer-events-none absolute right-4 top-1/2 h-40 w-40 -translate-y-1/2 text-white/[0.04] transition-colors duration-700 group-hover:text-gold/10"
              />
              <span
                style={{ transform: "translateZ(50px)" }}
                className="grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-gradient-to-br from-white/15 to-white/[0.02] text-gold shadow-[0_10px_30px_-10px_rgba(244,201,122,0.5)]"
              >
                <Icon className="h-6 w-6" />
              </span>
              <span style={{ transform: "translateZ(30px)" }} className="font-serif text-3xl italic text-white/20">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          )}

          <div style={{ transform: "translateZ(40px)" }} className={service.image ? "mt-auto" : "mt-auto pt-10"}>
            <h3 className={`font-semibold text-white ${big ? "text-3xl md:text-4xl" : "text-2xl"}`}>{service.title}</h3>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">{service.short}</p>
            {big && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {service.includes.map((x) => (
                  <li key={x} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-text">{x}</li>
                ))}
              </ul>
            )}
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
              Explore
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </TiltCard>
    </Link>
  );
}

/* ---------------- Stats ---------------- */

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2.2, ease, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

export function Stats() {
  const airportCount = regions.reduce((n, r) => n + r.airports.length, 0);
  const items = [
    { n: airportCount, s: "+", label: "Airports served" },
    { n: regions.length, s: "", label: "Regions worldwide" },
    { n: services.length, s: "", label: "Specialised services" },
    { n: 24, s: "/7", label: "Live support" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={it.label} delay={i * 0.08}>
            <TiltCard max={14} className="rounded-3xl">
              <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent p-7 text-center preserve-3d">
                <p style={{ transform: "translateZ(40px)" }} className="text-gradient text-5xl font-semibold tracking-tight md:text-6xl" >
                  <Counter to={it.n} suffix={it.s} />
                </p>
                <p className="mt-2 text-sm text-muted">{it.label}</p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-28 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            center={false}
            eyebrow="FAQ"
            title="Questions,"
            accent="answered."
            text="Can't find what you need? Our team is on WhatsApp around the clock."
          />
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.05}>
                <motion.div
                  layout
                  className={`glow-border relative rounded-3xl border transition-colors ${isOpen ? "is-active border-white/15 bg-white/[0.05]" : "border-line bg-white/[0.02]"}`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left md:px-7 md:py-6"
                    aria-expanded={isOpen}
                  >
                    <span className="text-[17px] font-semibold text-white">{f.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 135 : 0, backgroundColor: isOpen ? "rgba(244,201,122,1)" : "rgba(255,255,255,0.06)" }}
                      transition={{ duration: 0.4, ease }}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
                    >
                      <Plus className={`h-4 w-4 ${isOpen ? "text-ink" : "text-gold"}`} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-[15px] leading-relaxed text-muted md:px-7">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Contact / CTA ---------------- */

export function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [35, 0]);

  const wa = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}`;
  const cards = [
    { icon: MessageCircle, label: "WhatsApp", value: site.whatsapp, href: wa },
    { icon: Phone, label: "Call us", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  ];

  return (
    <section id="contact" ref={ref} className="px-4 pb-28 pt-10" style={{ perspective: 1400 }}>
      <motion.div
        style={{ scale, opacity, rotateX }}
        className="noise relative mx-auto max-w-6xl overflow-hidden rounded-[40px] border border-white/10 px-6 py-16 md:px-16 md:py-24"
      >
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,#1b2a5c,transparent_60%),radial-gradient(ellipse_at_bottom_right,#3a2a0e,transparent_60%)] bg-panel" />
        <div aria-hidden className="absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(244,201,122,0.3),transparent)]" />
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <h2 className="text-5xl font-semibold leading-[0.95] text-white md:text-7xl">
              Ready for your{" "}
              <span className="font-serif font-normal italic tracking-normal text-shine">smoothest</span> trip yet?
            </h2>
            <p className="mt-6 max-w-md text-lg text-muted">
              Tell us your flight and we&apos;ll take care of the rest. Replies typically within minutes.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <MagneticButton href="/#book">Book assistance</MagneticButton>
              <MagneticButton href={wa} variant="ghost">Chat on WhatsApp</MagneticButton>
            </div>
          </div>
          <div className="space-y-3">
            {cards.map(({ icon: I, label, value, href }, i) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease }}
                whileHover={{ x: 8, scale: 1.02 }}
                className="glow-border relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-gold/30 to-gold/5 text-gold">
                  <I className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-xs uppercase tracking-wider text-muted">{label}</span>
                  <span className="font-semibold text-white">{value}</span>
                </span>
                <ArrowUpRight className="h-5 w-5 text-muted" />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
