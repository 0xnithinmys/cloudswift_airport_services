"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/site";
import { Eyebrow, MagneticButton, Reveal, TiltCard, ease, icons } from "./ui";

export default function ServiceDetail({ slug }: { slug: string }) {
  const service = services.find((s) => s.slug === slug)!;
  const Icon = icons[service.icon];
  const others = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="noise relative overflow-hidden pt-36 pb-20 md:pt-44">
        <div aria-hidden className="grid-bg absolute inset-0 -z-10" />
        <div aria-hidden className="absolute -top-40 left-1/2 -z-10 h-[520px] w-[800px] -translate-x-1/2 rounded-full bg-sky/15 blur-[140px]" />
        <div className="mx-auto max-w-6xl px-4">
          <Link href="/#services" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white">
            <ArrowLeft className="h-4 w-4" /> All services
          </Link>
          <div className="mt-8 grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Eyebrow>Service</Eyebrow>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, ease }}
                className="mt-6 text-5xl font-semibold tracking-tight text-white md:text-6xl"
              >
                {service.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease }}
                className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
              >
                {service.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease }}
                className="mt-9"
              >
                <MagneticButton href={`/?service=${service.slug}#book`}>
                  Book this service <ArrowRight className="h-4 w-4" />
                </MagneticButton>
              </motion.div>
            </div>

            {service.image ? (
              <motion.div
                initial={{ opacity: 0, y: 40, rotateY: -25 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 1.1, ease }}
                style={{ perspective: 1200 }}
                className="relative mx-auto w-full max-w-lg"
              >
                <TiltCard max={10} className="rounded-[28px]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/15 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)]">
                    <Image src={service.image} alt={service.title} fill priority sizes="(min-width: 1024px) 512px, 100vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                  </div>
                </TiltCard>
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-4 grid h-16 w-16 place-items-center rounded-2xl border border-white/15 bg-[#0d1426] text-gold shadow-[0_20px_40px_-10px_rgba(244,201,122,0.4)]"
                >
                  <Icon className="h-7 w-7" />
                </motion.span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease }}
                className="relative mx-auto aspect-square w-full max-w-sm"
              >
                <motion.div
                  className="absolute inset-0 rounded-full border border-dashed border-white/15"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-10 rounded-full border border-gold/20"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                  <span className="absolute -top-1.5 left-1/2 h-3 w-3 rounded-full bg-gold shadow-[0_0_20px_var(--gold)]" />
                </motion.div>
                <div className="absolute inset-20 grid place-items-center rounded-full bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur">
                  <Icon className="h-16 w-16 text-gold" strokeWidth={1.2} />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-2">
        <Reveal className="rounded-3xl border border-line bg-panel/60 p-8">
          <h2 className="text-xl font-semibold text-white">What&apos;s included</h2>
          <ul className="mt-6 space-y-4">
            {service.includes.map((x, i) => (
              <motion.li
                key={x}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 text-text"
              >
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/15 text-gold"><Check className="h-3 w-3" /></span>
                {x}
              </motion.li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="rounded-3xl border border-line bg-panel/60 p-8">
          <h2 className="text-xl font-semibold text-white">Ideal for</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {service.idealFor.map((x) => (
              <span key={x} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-text">{x}</span>
            ))}
          </div>
          <p className="mt-8 text-sm leading-relaxed text-muted">
            Combine with other services — like porter assistance, lounge access or a private transfer — for a complete door-to-door experience.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-24">
        <h2 className="text-2xl font-semibold text-white">Pair it with</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {others.map((o, i) => {
            const I = icons[o.icon];
            return (
              <Reveal key={o.slug} delay={i * 0.08}>
                <Link href={`/services/${o.slug}`} className="group flex h-full flex-col rounded-3xl border border-line bg-panel/50 p-6 transition-colors hover:border-white/20">
                  <I className="h-6 w-6 text-gold" />
                  <h3 className="mt-6 font-semibold text-white">{o.title}</h3>
                  <p className="mt-2 text-sm text-muted">{o.short}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm text-white">
                    Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
