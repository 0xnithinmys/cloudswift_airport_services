"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, MessageCircle, Plane, Sparkles, Users } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { regions, services, site } from "@/lib/site";
import LogoMark from "./Logo";
import { SectionHeading, TiltCard, ease } from "./ui";

const field =
  "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder:text-muted/60 outline-none transition focus:border-gold/60 focus:bg-white/[0.08] focus:shadow-[0_0_0_4px_rgba(244,201,122,0.08)]";

/** Booking form on a boarding pass that flips in 3D to reveal the ticket. */
export default function Booking() {
  const [flipped, setFlipped] = useState(false);
  const [form, setForm] = useState({ service: "", airport: "", date: "", pax: "1", name: "", flight: "" });

  // Preselect a service when arriving from /?service=<slug>#book
  const preset = useSyncExternalStore(
    () => () => {},
    () => services.find((x) => x.slug === new URLSearchParams(window.location.search).get("service"))?.title ?? "",
    () => "",
  );
  const service = form.service || preset || services[0].title;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const msg = `Hi ${site.name}! I'd like to book:\n• Service: ${service}\n• Airport: ${form.airport}\n• Date: ${form.date}\n• Flight: ${form.flight || "—"}\n• Passengers: ${form.pax}\n• Name: ${form.name}`;
  const waLink = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
  const code = (form.airport || "XXX").replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase().padEnd(3, "X");

  return (
    <section id="book" className="relative py-28 md:py-36">
      <div aria-hidden className="absolute inset-x-0 top-1/3 -z-10 mx-auto h-[500px] max-w-4xl rounded-full bg-gold/10 blur-[150px]" />
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Book now"
          title="Your pass to a"
          accent="calmer journey."
          text="Fill in your trip and we'll confirm availability on WhatsApp — usually within minutes."
        />

        <div className="mx-auto mt-14 max-w-3xl" style={{ perspective: 1800 }}>
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 1, ease }}
            className="relative grid grid-cols-[minmax(0,1fr)] preserve-3d"
          >
            {/* FRONT */}
            <div className="min-w-0 backface-hidden [grid-area:1/1]">
              <TiltCard max={4} className="rounded-[32px]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFlipped(true);
                  }}
                  className="glow-border relative rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl md:p-10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted">Boarding pass</p>
                      <h3 className="mt-1 text-2xl font-semibold text-white">Book your assistance</h3>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Online 24/7
                    </span>
                  </div>

                  <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Label icon={Sparkles} text="Service">
                      <select value={service} onChange={set("service")} className={`${field} appearance-none`}>
                        {services.map((s) => (
                          <option key={s.slug} className="bg-panel">{s.title}</option>
                        ))}
                      </select>
                    </Label>
                    <Label icon={MapPin} text="Airport">
                      <input required list="airports" value={form.airport} onChange={set("airport")} placeholder="e.g. Dubai, Delhi, Paris CDG" className={field} />
                      <datalist id="airports">
                        {regions.flatMap((r) => r.airports).map((a) => <option key={a} value={a} />)}
                      </datalist>
                    </Label>
                    <Label icon={CalendarDays} text="Date">
                      <input required type="date" value={form.date} onChange={set("date")} className={`${field} [color-scheme:dark]`} />
                    </Label>
                    <Label icon={Plane} text="Flight number (optional)">
                      <input value={form.flight} onChange={set("flight")} placeholder="e.g. EK 507" className={field} />
                    </Label>
                    <Label icon={Users} text="Passengers">
                      <input type="number" min={1} max={50} value={form.pax} onChange={set("pax")} className={field} />
                    </Label>
                    <Label icon={Users} text="Lead passenger name">
                      <input required value={form.name} onChange={set("name")} placeholder="Full name" className={field} />
                    </Label>
                  </div>

                  <Perforation />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold via-[#ffe2a8] to-gold bg-[length:200%_100%] py-4 text-sm font-bold text-ink shadow-[0_20px_50px_-15px_rgba(244,201,122,0.7)] transition-[background-position] duration-700 hover:bg-[position:100%_0]"
                  >
                    Generate my boarding pass
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                  <p className="mt-3 text-center text-xs text-muted">Free cancellation up to 24h before service</p>
                </form>
              </TiltCard>
            </div>

            {/* BACK */}
            <div className="min-w-0 backface-hidden [grid-area:1/1] [transform:rotateY(180deg)]">
              <div className="noise relative flex h-full flex-col overflow-hidden rounded-[32px] bg-gradient-to-br from-[#f8e7c4] via-[#f4d79c] to-[#e9b860] p-6 text-ink shadow-[0_50px_120px_-30px_rgba(244,201,122,0.5)] md:p-10">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-brand font-bold uppercase tracking-[0.14em]">
                    <LogoMark tone="ink" className="h-7 w-7" /> {site.name}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-ink/60">Assistance pass</span>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">Airport</p>
                    <p className="text-6xl font-black tracking-tighter md:text-7xl" style={{ fontFamily: "var(--font-display)" }}>{code}</p>
                    <p className="text-sm font-semibold text-ink/70">{form.airport || "—"}</p>
                  </div>
                  <div className="relative mx-6 hidden h-px flex-1 border-t-2 border-dashed border-ink/30 sm:block">
                    <Plane className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 text-ink" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">Passenger</p>
                    <p className="text-xl font-bold">{form.name || "—"}</p>
                    <p className="text-sm font-semibold text-ink/70">{form.pax} pax</p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4 border-y border-ink/15 py-5 text-sm">
                  <Info k="Service" v={service} />
                  <Info k="Date" v={form.date || "—"} />
                  <Info k="Flight" v={form.flight || "—"} />
                </div>

                <Barcode />

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setFlipped(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-ink/20 px-5 py-3.5 text-sm font-bold hover:bg-ink/5"
                  >
                    <ArrowLeft className="h-4 w-4" /> Edit
                  </button>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-ink py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                  >
                    <MessageCircle className="h-4 w-4" /> Confirm on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Label({ icon: I, text, children }: { icon: typeof Plane; text: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted">
        <I className="h-3.5 w-3.5 text-gold" /> {text}
      </span>
      {children}
    </label>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/50">{k}</p>
      <p className="mt-1 font-bold leading-snug">{v}</p>
    </div>
  );
}

function Perforation() {
  return (
    <div className="relative -mx-6 my-8 border-t-2 border-dashed border-white/15 md:-mx-10">
      <span className="absolute -left-4 -top-4 h-8 w-8 rounded-full bg-ink" />
      <span className="absolute -right-4 -top-4 h-8 w-8 rounded-full bg-ink" />
    </div>
  );
}

function Barcode() {
  const bars = Array.from({ length: 64 }, (_, i) => ((i * 7919) % 5) + 1);
  return (
    <div className="mt-6 flex h-14 items-stretch gap-[3px] opacity-80">
      {bars.map((w, i) => (
        <span key={i} className="bg-ink" style={{ width: w }} />
      ))}
    </div>
  );
}
