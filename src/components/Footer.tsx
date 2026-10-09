import Link from "next/link";
import { regions, services, site } from "@/lib/site";
import LogoMark from "./Logo";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line pt-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2 font-brand text-lg font-semibold uppercase tracking-[0.14em] text-white">
            <LogoMark play="inView" className="h-10 w-10" />
            {site.name}
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{site.description}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Services</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}><Link href={`/services/${s.slug}`} className="hover:text-white">{s.title}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Regions</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            {regions.map((r) => (
              <li key={r.name}><Link href="/#airports" className="hover:text-white">{r.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Contact</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>
            <li><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">{site.phone}</a></li>
            <li>{site.address}</li>
          </ul>
        </div>
      </div>

      <p
        aria-hidden
        // 18vw keeps the full wordmark inside the viewport at every width
        className="pointer-events-none mt-16 select-none whitespace-nowrap bg-gradient-to-b from-white/[0.14] via-white/[0.06] to-transparent bg-clip-text pb-[0.08em] text-center text-[18vw] font-semibold leading-[0.85] tracking-tighter text-transparent"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {site.name}
      </p>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted md:flex-row">
          <p>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
          <p>Fast track availability subject to local airport regulations.</p>
        </div>
      </div>
    </footer>
  );
}
