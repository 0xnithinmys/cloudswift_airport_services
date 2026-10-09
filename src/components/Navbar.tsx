"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";
import { useStage } from "@/lib/stage";
import LogoMark from "./Logo";
import { ease } from "./ui";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#how", label: "How it works" },
  { href: "/#airports", label: "Airports" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const revealed = useStage("reveal");

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > prev && y > 400 && !open);
  });

  return (
    <motion.header
      animate={{ y: hidden ? -110 : 0 }}
      transition={{ duration: 0.4, ease }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-500 md:px-6 ${
          scrolled
            ? "border-white/10 bg-ink/70 shadow-2xl shadow-black/40 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 font-brand text-[15px] font-semibold uppercase tracking-[0.14em] text-white">
          <LogoMark play="mount" active={revealed} delay={0.2} className="h-9 w-9" />
          {site.name}
        </Link>

        <ul className="hidden items-center md:flex" onMouseLeave={() => setHovered(null)}>
          {links.map((l) => (
            <li key={l.href} className="relative">
              <Link
                href={l.href}
                onMouseEnter={() => setHovered(l.href)}
                className="relative z-10 block px-4 py-2 text-sm text-muted transition-colors hover:text-white"
              >
                {l.label}
              </Link>
              {hovered === l.href && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-white/[0.07]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </li>
          ))}
        </ul>

        <Link
          href="/#book"
          className="hidden rounded-full bg-white px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-gold md:inline-block"
        >
          Book now
        </Link>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.3, ease }}
            className="mx-auto mt-2 max-w-6xl rounded-3xl border border-white/10 bg-panel/95 p-3 backdrop-blur-xl md:hidden"
          >
            {[...links, { href: "/#book", label: "Book now" }].map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-base text-text hover:bg-white/5"
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
