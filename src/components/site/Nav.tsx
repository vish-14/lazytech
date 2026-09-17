import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { BATCH, BRAND } from "@/data/site";
import { cn } from "@/lib/utils";

const links = [
  { to: "/builds", label: "52 Builds" },
  { to: "/membership", label: "Lazy Pass" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-[180ms]",
        scrolled
          ? "border-border bg-background/90 backdrop-blur-md"
          : "border-transparent bg-background",
      )}
    >
      <div className="shell flex items-center justify-between py-3 md:py-4">
        <Link
          to="/"
          className="tap flex items-center gap-2 font-display text-base font-bold tracking-[0.18em] uppercase"
        >
          <span aria-hidden className="h-2 w-2 rounded-[2px] bg-primary" />
          {BRAND.name}
        </Link>

        <span className="hidden items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-graphite lg:inline-flex">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" />
          {BATCH.label} • {BATCH.capacity} SEATS
        </span>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => {
            const isActive = pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "relative py-1 font-mono text-xs uppercase tracking-[0.14em] transition-colors duration-[180ms]",
                  isActive ? "text-foreground" : "text-graphite hover:text-foreground",
                )}
              >
                {l.label}
                {isActive ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-0.5 h-[1px] bg-primary"
                    transition={{ duration: 0.2, ease: EASE }}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/join"
            className="tap group hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-white transition-transform duration-[180ms] active:scale-[0.97] sm:inline-flex"
          >
            {BATCH.cta}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-[180ms] group-hover:translate-x-1" />
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="tap grid place-items-center md:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="drawer"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="border-t border-border bg-background md:hidden"
          >
            <div className="shell flex flex-col gap-1 py-5">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "tap flex items-center py-2 font-display text-2xl uppercase",
                    pathname.startsWith(l.to) ? "text-primary" : "text-foreground",
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/join"
                onClick={() => setOpen(false)}
                className="tap mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-white"
              >
                {BATCH.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
