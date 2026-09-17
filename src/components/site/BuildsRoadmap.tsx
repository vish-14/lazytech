import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useSpring } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { builds, phases, weekLabel } from "@/data/site";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const weeksIn = (start: number, end: number) =>
  builds.filter((b) => b.week >= start && b.week <= end);

export function BuildsRoadmap() {
  const [open, setOpen] = useState<string | null>("foundation");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 40%"] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  return (
    <div ref={ref} className="relative">
      {/* drawn timeline */}
      <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-border md:block">
        <motion.div className="h-full w-px origin-top bg-primary" style={{ scaleY: line }} />
      </div>

      <div className="flex flex-col gap-5 md:gap-6 md:pl-10">
        {phases.map((p, i) => {
          const isOpen = open === p.id;
          const list = weeksIn(p.start, p.end);
          return (
            <motion.section
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
              className={cn(
                "group relative overflow-hidden rounded-[26px] border transition-colors duration-300",
                isOpen
                  ? "border-primary bg-card"
                  : "border-border bg-transparent hover:border-primary/70 hover:bg-card",
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : p.id)}
                aria-expanded={isOpen}
                className="tap block w-full px-6 py-8 text-left transition-transform duration-300 active:scale-[0.995] sm:px-10 sm:py-12 md:group-hover:-translate-y-0.5"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
                  <div className="min-w-0">
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          "font-mono text-[0.7rem] tracking-[0.22em] transition-colors",
                          isOpen ? "text-primary" : "text-graphite",
                        )}
                      >
                        PHASE {p.index}
                      </span>
                      <span className="h-px w-8 bg-border" />
                      <span className="font-mono text-[0.7rem] tracking-[0.22em] text-graphite">
                        {p.quarter} / WEEKS {String(p.start).padStart(2, "0")}–{p.end}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-[clamp(2rem,6vw,3.75rem)] uppercase leading-[0.92]">
                      {p.title}
                    </h3>

                    <p className="mt-4 max-w-lg text-[15px] leading-[1.65] text-graphite">
                      {p.theme}
                    </p>

                    <p className="mt-5 max-w-lg text-[15px] leading-[1.7]">
                      <span className="font-mono text-[0.65rem] tracking-[0.2em] text-graphite">
                        FROM
                      </span>{" "}
                      <span className="text-graphite">“{p.from}”</span>{" "}
                      <span className="font-mono text-[0.65rem] tracking-[0.2em] text-graphite">
                        TO
                      </span>{" "}
                      <span className="text-foreground">“{p.to}”</span>
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center justify-between gap-6 md:flex-col md:items-end md:gap-8">
                    <span className="font-display text-[2.5rem] leading-none md:text-[3.5rem]">
                      {list.length}
                      <span className="ml-2 font-mono text-[0.65rem] tracking-[0.2em] text-graphite">
                        BUILDS
                      </span>
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[0.65rem] tracking-[0.2em] transition-colors duration-300",
                        isOpen
                          ? "border-primary bg-primary text-white"
                          : "border-border text-foreground",
                      )}
                    >
                      {isOpen ? "CLOSE" : "EXPLORE"}
                      <ArrowRight
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-300",
                          isOpen && "rotate-90",
                        )}
                      />
                    </span>
                  </div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border px-6 pb-10 pt-8 sm:px-10">
                      <div className="mb-10 flex flex-wrap gap-x-8 gap-y-2">
                        <span className="font-mono text-[0.62rem] tracking-[0.22em] text-graphite">
                          YOU FINISH WITH
                        </span>
                        {p.outcomes.map((o) => (
                          <span key={o} className="text-[14px] text-foreground">
                            {o}
                          </span>
                        ))}
                      </div>

                      {p.months.map((m) => (
                        <div key={m.label} className="mb-10 last:mb-0">
                          <div className="flex items-baseline gap-4">
                            <span className="font-mono text-[0.62rem] tracking-[0.22em] text-primary">
                              {m.label}
                            </span>
                            <span className="font-display text-[1.1rem] uppercase tracking-tight">
                              {m.title}
                            </span>
                          </div>

                          <div className="mt-5 border-t border-border">
                            {weeksIn(m.start, m.end).map((b, idx) => (
                              <motion.div
                                key={b.week}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.35,
                                  ease: EASE,
                                  delay: 0.05 + idx * 0.05,
                                }}
                              >
                                <Link
                                  to="/builds/$week"
                                  params={{ week: b.slug }}
                                  className="tap group/row flex flex-col gap-2 border-b border-border py-5 transition-colors hover:bg-foreground/[0.03] md:flex-row md:items-baseline md:gap-8"
                                >
                                  <span className="w-14 shrink-0 font-mono text-[0.68rem] tracking-[0.18em] text-graphite transition-colors group-hover/row:text-primary">
                                    {weekLabel(b.week)}
                                  </span>
                                  <span className="min-w-0 flex-1 font-display text-[1.15rem] uppercase leading-[1.15] md:text-[1.35rem]">
                                    {b.title}
                                  </span>
                                  <span className="max-w-[16rem] flex-1 text-[14px] leading-[1.5] text-graphite md:text-right">
                                    <span className="font-mono text-[0.6rem] tracking-[0.18em] text-graphite/70">
                                      YOU CREATE{" "}
                                    </span>
                                    <span className="text-foreground">{b.output}</span>
                                  </span>
                                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-graphite transition-all duration-200 group-hover/row:translate-x-1 group-hover/row:text-primary md:block" />
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
