import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BATCH } from "@/data/site";
import { useSeats } from "@/lib/seats";
import { cn } from "@/lib/utils";
import { SectionHead } from "@/components/site/primitives";
import { Reveal } from "@/components/site/motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/* --------------------------- BADGE --------------------------- */

export function BatchBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-graphite",
        className,
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" />
      <span className="text-foreground">{BATCH.label}</span>
      <span aria-hidden className="h-3 w-px bg-border" />
      {BATCH.capacity} SEATS ONLY
    </span>
  );
}

/* --------------------------- SEAT METER --------------------------- */

export function SeatMeter({ className }: { className?: string }) {
  return null;
}

/* --------------------------- COUNTDOWN --------------------------- */

function diff(target: number) {
  const ms = Math.max(target - Date.now(), 0);
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
  };
}

export function BatchCountdown({ className }: { className?: string }) {
  const target = new Date(BATCH.startsAt).getTime();
  const [time, setTime] = useState<{ days: number; hours: number; minutes: number } | null>(null);

  useEffect(() => {
    setTime(diff(target));
    const id = window.setInterval(() => setTime(diff(target)), 30_000);
    return () => window.clearInterval(id);
  }, [target]);

  const cells = [
    { value: time?.days, unit: "DAYS" },
    { value: time?.hours, unit: "HOURS" },
    { value: time?.minutes, unit: "MINUTES" },
  ];

  return (
    <div className={className}>
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-graphite">
        {BATCH.label} STARTS · {BATCH.startLabel.toUpperCase()}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {cells.map((c) => (
          <div key={c.unit} className="rounded-[14px] border border-border px-4 py-4">
            <p className="font-display text-[2rem] leading-none tabular-nums">
              {c.value === undefined ? "—" : String(c.value).padStart(2, "0")}
            </p>
            <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-graphite">
              {c.unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- JOIN CTA --------------------------- */

export function JoinBatchCta({ className }: { className?: string }) {
  const { full } = useSeats();
  return (
    <div className={className}>
      <Link
        to="/join"
        className="tap group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-primary px-7 py-4 font-mono text-xs uppercase tracking-[0.16em] text-white transition-transform duration-[180ms] active:scale-[0.97] sm:w-auto sm:px-9"
      >
        {full ? "JOIN BATCH 02 WAITLIST" : `JOIN ${BATCH.label}`}
        <ArrowRight className="h-4 w-4 transition-transform duration-[180ms] group-hover:translate-x-1" />
      </Link>
      {!full && (
        <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-graphite">
          SECURE YOUR SEAT · {BATCH.capacity} BUILDERS ONLY
        </p>
      )}
    </div>
  );
}

/* --------------------------- SECTION --------------------------- */

export function BatchSection() {
  return (
    <section className="section-y border-b border-border">
      <div className="shell grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-start md:gap-16">
        <div>
          <SectionHead
            eyebrow={`${BATCH.label} / THE FIRST 100 BUILDERS`}
            line1="THE FIRST CHAPTER"
            line2="STARTS HERE."
            body="Batch 01 is where LazyTech begins. A limited group of builders learning, creating and shipping together for one year."
          />
          <JoinBatchCta className="mt-9" />
        </div>

        <Reveal delay={0.06}>
          <div className="rounded-[22px] border border-border bg-card p-6 sm:p-8">
            <ul className="space-y-3">
              {BATCH.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-foreground/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>

            <SeatMeter className="mt-8 border-t border-border pt-7" />
            <BatchCountdown className="mt-8 border-t border-border pt-7" />

            <p className="mt-7 text-sm leading-[1.7] text-graphite">{BATCH.supporting}</p>

            <JoinBatchCta className="mt-8 border-t border-border pt-7 sm:hidden" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
