import { Link } from "@tanstack/react-router";
import { BATCH, BRAND } from "@/data/site";
import { Reveal } from "@/components/site/motion";

const columns = [
  {
    heading: "SYSTEM",
    items: [
      { to: "/builds", label: "52 Builds" },
      { to: "/membership", label: "Lazy Pass" },
      { to: "/join", label: "Join LazyTech" },
    ],
  },
  {
    heading: "CLUB",
    items: [
      { to: "/about", label: "About" },
      { to: "/faq", label: "FAQ" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "LEGAL",
    items: [
      { to: "/terms", label: "Terms" },
      { to: "/privacy", label: "Privacy" },
      { to: "/refund-policy", label: "Refunds" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border pt-16 md:pt-20">
      <div aria-hidden className="grain pointer-events-none absolute inset-0" />
      <div className="shell relative">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr] md:gap-14">
          <div>
            <p className="group inline-flex cursor-default font-display text-2xl font-bold tracking-[0.16em] uppercase transition-all duration-300 hover:tracking-[0.22em] hover:text-primary hover:drop-shadow-[0_0_14px_var(--primary)]">
              <span className="transition-colors duration-300 group-hover:text-primary">
                {BRAND.name}
              </span>
            </p>
            <p className="eyebrow mt-3 text-primary">{BRAND.tagline}</p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-graphite">{BRAND.footnote}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.heading}>
                <p className="eyebrow text-graphite">{col.heading}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map((i) => (
                    <li key={i.to}>
                      <Link
                        to={i.to}
                        className="link-underline text-sm text-foreground/80 transition-colors hover:text-primary"
                      >
                        {i.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border py-7 md:flex-row md:items-center md:justify-between">
          <p className="eyebrow text-graphite">© 2026 {BRAND.name}</p>
          <a href={`mailto:${BRAND.email}`} className="eyebrow link-underline text-graphite">
            {BRAND.email}
          </a>
          <p className="eyebrow text-graphite">52 WEEKS / 52 BUILDS</p>
          <p className="eyebrow text-primary">
            LAZYTECH {BATCH.label} · {BATCH.startLabel.toUpperCase()}
          </p>
        </div>
      </div>

      <Reveal y={20}>
        <p
          aria-hidden
          className="group -mb-[2vw] cursor-default select-none text-center font-display text-[20vw] leading-[0.8] font-bold tracking-tight text-foreground/[0.045] transition-all duration-500 ease-out hover:tracking-normal hover:text-primary/25 hover:drop-shadow-[0_0_40px_var(--primary)]"
        >
          {BRAND.name}
        </p>
      </Reveal>
    </footer>
  );
}
