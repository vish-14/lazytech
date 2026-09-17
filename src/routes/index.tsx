import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Minus, Plus, Check } from "lucide-react";
import {
  BATCH,
  BRAND,
  audiences,
  buildTypes,
  buildExamples,
  buildWall,
  heroStats,
  builds,
  faqs,
  lazyScore,
  loop,
  membershipIncludes,
  pillTags,
  seasons,
  speakerRoles,
  weekLabel,
} from "@/data/site";
import { ArtifactCard, Btn, Eyebrow, Pill, SectionHead } from "@/components/site/primitives";
import {
  Marquee,
  MaskLines,
  Reveal,
  Stagger,
  StaggerItem,
  Typewriter,
} from "@/components/site/motion";
import { BuildsRoadmap } from "@/components/site/BuildsRoadmap";
import { BatchBadge, BatchSection, SeatMeter } from "@/components/site/batch";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LazyTech — Weekend Builder Community" },
      {
        name: "description",
        content:
          "52 weeks. 52 builds. Every weekend, make something practical with technology, AI and modern tools — and leave with proof you made it.",
      },
      { property: "og:title", content: "LazyTech — Your weekend. Your next build." },
      {
        property: "og:description",
        content: "A weekend builder community. 52 weeks, 52 builds, ₹499 a year.",
      },
      { property: "og:url", content: "https://lazytech.greatskills.co.in/" },
      { name: "twitter:title", content: "LazyTech — Your weekend. Your next build." },
      {
        name: "twitter:description",
        content: "A weekend builder community. 52 weeks, 52 builds, ₹499 a year.",
      },
    ],
    links: [{ rel: "canonical", href: "https://lazytech.greatskills.co.in/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <TickerStrip />
      <Difference />
      <LazyLoop />
      <Roadmap />
      <BuildWall />
      <ScoreAndProfile />
      <Speakers />
      <Audience />
      <BatchSection />
      <LazyPass />
      <Faq />
      <FinalCta />
    </>
  );
}

/* ------------------------------ HERO ------------------------------ */

function Hero() {
  const [paused, setPaused] = useState(false);
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
      <div aria-hidden className="grain pointer-events-none absolute inset-0" />
      <div className="shell relative grid gap-10 py-12 md:grid-cols-[1.15fr_0.85fr] md:items-start md:gap-14 md:py-10 lg:py-12">
        <div>
          <div className="fade-up flex flex-wrap items-center gap-3">
            <Eyebrow>LIMITED FIRST COHORT</Eyebrow>
            <BatchBadge />
          </div>
          <h1 className="mt-6 text-[clamp(2.6rem,9vw,5.4rem)] uppercase">
            <span className="rise-line block" style={{ animationDelay: "0.05s" }}>
              YOUR WEEKEND.
            </span>
            <span className="rise-line block text-primary" style={{ animationDelay: "0.22s" }}>
              YOUR NEXT BUILD.
            </span>
          </h1>
          <p
            className="fade-up mt-6 max-w-[420px] text-[17px] leading-[1.75] text-foreground/80"
            style={{ animationDelay: "0.34s" }}
          >
            Every weekend, build something practical with technology,{" "}
            <span className="text-primary">AI</span> and modern tools. No giant syllabus. No endless
            tutorials. Just something real you can point to.
          </p>
          <div
            className="fade-up mt-8 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.4s" }}
          >
            <Btn to="/join" className="w-full sm:w-auto">
              {BATCH.cta}
            </Btn>
            <Btn to="/builds" variant="ghost" className="w-full sm:w-auto">
              Explore 52 Builds
            </Btn>
          </div>
          <p
            className="fade-up mt-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-graphite"
            style={{ animationDelay: "0.46s" }}
          >
            Starting {BATCH.startLabel} · {BATCH.positioning}
          </p>
        </div>

        {/* build console panel */}
        <div
          className="console-panel fade-up rounded-[16px] border border-border bg-card md:mt-2"
          style={{ animationDelay: "0.12s" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          tabIndex={0}
        >
          <div className="flex items-center gap-2 border-b border-border px-4 py-3 md:px-3 md:py-2.5">
            <span aria-hidden className="dot-pulse h-2 w-2 rounded-full bg-primary" />
            <span
              aria-hidden
              className="dot-pulse h-2 w-2 rounded-full bg-border"
              style={{ animationDelay: "0.3s" }}
            />
            <span
              aria-hidden
              className="dot-pulse h-2 w-2 rounded-full bg-border"
              style={{ animationDelay: "0.6s" }}
            />
            <span className="eyebrow ml-2 text-graphite">lazytech / console</span>
          </div>
          <div className="p-5 sm:p-6 md:p-4">
            <p className="eyebrow text-graphite">WHAT WILL YOU BUILD?</p>
            <p className="mt-3 flex h-[1.35em] items-baseline gap-2 overflow-hidden whitespace-nowrap font-display text-[clamp(1.5rem,4.6vw,2.3rem)] uppercase leading-[1.35em] text-lime md:mt-2">
              <span aria-hidden className="font-mono text-base text-graphite md:text-sm">
                &gt;
              </span>
              <Typewriter values={buildTypes} paused={paused} className="console-glow" />
            </p>

            <div className="mt-6 space-y-2.5 border-t border-border pt-5 md:mt-4 md:space-y-2 md:pt-4">
              {seasons.map((s) => (
                <div key={s.key} className="rounded-[10px] border border-border p-3 md:p-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="eyebrow text-foreground/85">{s.label}</span>
                    <span className="font-mono text-[0.66rem] text-primary">{s.range}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-graphite md:mt-1 md:text-xs">{s.blurb}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5 md:mt-1.5">
                    {s.includes.map((inc) => (
                      <span
                        key={inc}
                        className="rounded-full border border-border px-2.5 py-1 font-mono text-[0.58rem] tracking-[0.12em] text-graphite uppercase md:px-2 md:py-0.5 md:text-[0.55rem]"
                      >
                        {inc}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-5 md:mt-4 md:pt-4">
              {heroStats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-[10px] border border-border px-3 py-3 md:px-2.5 md:py-2"
                >
                  <p className="font-display text-2xl leading-none md:text-xl">{s.value}</p>
                  <p className="eyebrow mt-2 text-[0.58rem] text-graphite md:mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TickerStrip() {
  return (
    <div className="border-b border-border bg-primary py-3 text-white">
      <Marquee items={pillTags} speed={40} />
    </div>
  );
}

/* --------------------------- DIFFERENCE --------------------------- */

function Difference() {
  return (
    <section className="section-y border-b border-border">
      <div className="shell grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
        <SectionHead
          eyebrow="THE DIFFERENCE"
          line1="STOP SAVING TUTORIALS."
          line2="START SHIPPING PROOF."
          body="LazyTech is not a library to finish. It is a weekend system for turning curiosity into working things — one build, one share, one improvement at a time."
        />
        <Reveal delay={0.06}>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            <div className="rounded-[14px] border border-border p-4">
              <p className="eyebrow text-graphite">SAVED FOR LATER</p>
              <div className="mt-4 space-y-2">
                {[
                  "ultimate react course.mp4",
                  "ai roadmap 2026.pdf",
                  "learn python in 100 days",
                  "saas ideas thread",
                  "figma masterclass",
                ].map((t, i) => (
                  <div
                    key={t}
                    className="truncate rounded-[8px] border border-border px-3 py-2 font-mono text-[0.7rem] text-graphite"
                    style={{ opacity: 1 - i * 0.14 }}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[14px] border border-primary bg-[#171313] p-4">
              <p className="eyebrow text-primary">SHIPPED</p>
              <div className="mt-4 rounded-[10px] border border-border">
                <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-graphite" />
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-graphite" />
                  <span className="ml-2 truncate font-mono text-[0.62rem] text-graphite">
                    yourname.build/portfolio
                  </span>
                </div>
                <div className="space-y-2 p-3">
                  <div className="h-2 w-2/3 rounded bg-foreground/25" />
                  <div className="h-2 w-1/2 rounded bg-foreground/15" />
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="h-10 rounded bg-foreground/10" />
                    <div className="h-10 rounded bg-primary/40" />
                    <div className="h-10 rounded bg-foreground/10" />
                  </div>
                </div>
              </div>
              <p className="mt-4 font-mono text-[0.7rem] text-lime">W01 · LIVE PORTFOLIO WEBSITE</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------- LAZY LOOP ---------------------------- */

function LazyLoop() {
  return (
    <section className="section-y border-b border-border">
      <div className="shell">
        <SectionHead
          eyebrow="MEMBER EXPERIENCE"
          line1="THE LAZY LOOP"
          body="Four moves, repeated every weekend. Small enough to finish, structured enough to compound."
        />
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loop.map((l, i) => (
            <StaggerItem key={l.step} className="h-full">
              <ArtifactCard>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.7rem] text-primary">0{i + 1}</span>
                  <span className="eyebrow text-graphite">{l.meta}</span>
                </div>
                <p className="mt-10 font-display text-2xl uppercase">{l.step}</p>
                <p className="mt-2 text-sm leading-relaxed text-graphite">{l.body}</p>
              </ArtifactCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------------------------- ROADMAP ---------------------------- */

function Roadmap() {
  return (
    <section id="builds" className="section-y border-b border-border">
      <div className="shell">
        <SectionHead
          eyebrow="THE YEAR IN BUILDS"
          line1="52 WEEKS."
          line2="52 BUILDS."
          body="One year. Four phases. Fifty-two things you can build and show."
        />
        <div className="mt-10">
          <BuildsRoadmap />
        </div>
        <Reveal delay={0.06}>
          <div className="mt-8">
            <Btn to="/builds" variant="ghost">
              See all 52 builds
            </Btn>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------- BUILD WALL --------------------------- */

function BuildWall() {
  return (
    <section id="build-wall" className="section-y border-b border-border">
      <div className="shell">
        <SectionHead
          eyebrow="BUILD WALL"
          line1="THINGS THAT EXIST"
          line2="BECAUSE OF A WEEKEND."
          body="Examples of what a single weekend build looks like. Sample builds until member projects are published."
        />
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {buildWall.map((b) => (
            <StaggerItem key={b.title} className="h-full">
              <ArtifactCard className="group flex h-full flex-col">
                <div className="rounded-[10px] border border-border">
                  <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-graphite" />
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-graphite" />
                    <span className="ml-1 font-mono text-[0.6rem] text-graphite">
                      {weekLabel(b.week)}
                    </span>
                  </div>
                  <div className="space-y-2 p-3">
                    <div className="h-2 w-3/5 rounded bg-foreground/25" />
                    <div className="grid grid-cols-4 gap-1.5">
                      <div className="h-8 rounded bg-primary/35" />
                      <div className="h-8 rounded bg-foreground/10" />
                      <div className="h-8 rounded bg-foreground/10" />
                      <div className="h-8 rounded bg-lime/25" />
                    </div>
                  </div>
                </div>
                <p className="mt-4 font-display text-xl uppercase">{b.title}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Pill>{b.category}</Pill>
                  <span className="eyebrow text-graphite">SAMPLE BUILD</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-graphite">{b.outcome}</p>
              </ArtifactCard>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.06}>
          <div className="mt-10 rounded-[16px] border border-border p-5 sm:p-7">
            <p className="eyebrow text-primary">THINGS YOU CAN MAKE</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {buildExamples.map((g) => (
                <div key={g.group}>
                  <p className="eyebrow text-graphite">{g.group}</p>
                  <ul className="mt-3 space-y-1.5">
                    {g.items.map((it) => (
                      <li key={it} className="text-sm text-foreground/80">
                        <span aria-hidden className="mr-2 text-primary">
                          /
                        </span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------- LAZY SCORE + BUILDER PROFILE ----------------- */

function ScoreAndProfile() {
  return (
    <section className="section-y border-b border-border">
      <div className="shell grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-[16px] border border-border bg-card p-6 sm:p-7">
            <p className="eyebrow text-primary">LAZY SCORE</p>
            <h2 className="mt-4 text-[clamp(1.7rem,4vw,2.6rem)] uppercase">Momentum, counted.</h2>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {lazyScore.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between rounded-[10px] border border-border px-4 py-3"
                >
                  <span className="eyebrow text-graphite">{s.label}</span>
                  <span className="font-mono text-sm text-lime">{s.value}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-graphite">
              A gentle signal of momentum — not a popularity contest.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="h-full rounded-[16px] border border-border bg-card p-6 sm:p-7">
            <p className="eyebrow text-primary">BUILDER PROFILE</p>
            <h2 className="mt-4 text-[clamp(1.7rem,4vw,2.6rem)] uppercase">A page of proof.</h2>
            <p className="mt-4 text-sm leading-relaxed text-graphite">
              Collect projects, skills, achievements, and badges in one profile that shows what you
              actually made.
            </p>
            <div className="mt-6 rounded-[12px] border border-border p-4">
              <div className="flex items-center gap-3">
                <div aria-hidden className="h-10 w-10 rounded-full bg-primary/30" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2 w-24 rounded bg-foreground/25" />
                  <div className="h-2 w-16 rounded bg-foreground/12" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={cn("h-12 rounded", i === 1 ? "bg-lime/25" : "bg-foreground/8")}
                  />
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["W01 SHIPPED", "W08 AI TOOL", "STREAK 6", "DEMO DAY"].map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-border px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.1em] text-graphite"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------- SPEAKERS ---------------------------- */

function Speakers() {
  return (
    <section className="section-y border-b border-border">
      <div className="shell">
        <SectionHead
          eyebrow="SPEAKERS TBA"
          line1="NAMES ANNOUNCED AS"
          line2="SESSIONS ARE CONFIRMED."
          body="No invented names, no borrowed logos. Roles first, people when they are booked."
        />
        <Stagger className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {speakerRoles.map((r) => (
            <StaggerItem key={r}>
              <div className="artifact flex flex-col items-center p-5 text-center">
                <div
                  aria-hidden
                  className="h-16 w-16 rounded-full bg-gradient-to-b from-foreground/20 to-foreground/5 blur-[6px] transition-opacity duration-[180ms] hover:opacity-80"
                />
                <p className="eyebrow mt-4 text-graphite">{r}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------------------------- AUDIENCE ---------------------------- */

function Audience() {
  const [active, setActive] = useState(0);
  const current = audiences[active]!;
  return (
    <section className="section-y border-b border-border">
      <div className="shell">
        <SectionHead eyebrow="START HERE" line1="PICK YOUR" line2="STARTING POINT." />
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a, i) => {
            const isActive = i === active;
            return (
              <StaggerItem key={a.key} className="h-full">
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActive(i)}
                  className="h-full w-full text-left"
                >
                  <ArtifactCard active={isActive} className="flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xl uppercase">{a.key}</span>
                      {isActive ? <Check className="h-4 w-4 text-lime" /> : null}
                    </div>
                    <p className="mt-6 text-sm leading-relaxed text-graphite">{a.line}</p>
                  </ArtifactCard>
                </button>
              </StaggerItem>
            );
          })}
        </Stagger>
        <p className="mt-6 font-mono text-sm text-lime">
          {current.key}: {current.line} Start at week 01 and keep going.
        </p>
      </div>
    </section>
  );
}

/* ---------------------------- LAZY PASS ---------------------------- */

export function LazyPassCard() {
  return (
    <div className="float-y rounded-[18px] border border-border bg-card p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow text-graphite">LAZY PASS</p>
          <p className="mt-1 font-display text-xl uppercase text-primary">{BATCH.label}</p>
        </div>
        <span className="text-right font-mono text-[0.6rem] uppercase leading-[1.8] tracking-[0.16em] text-graphite">
          FIRST COHORT
          <br />
          <span className="text-foreground">{BATCH.capacity} MEMBERS MAX</span>
        </span>
      </div>
      <div className="mt-6 flex flex-wrap items-baseline gap-3">
        <p className="font-display text-[clamp(2.6rem,9vw,3.6rem)] leading-none">
          ₹{BRAND.price}
          <span className="ml-2 font-mono text-sm tracking-[0.14em] text-graphite">/ YEAR</span>
        </p>
        <p className="font-mono text-sm tracking-[0.12em] text-graphite line-through">
          ₹{BRAND.regularPrice}
        </p>
      </div>
      <SeatMeter className="mt-6 border-t border-border pt-6" />
      <ul className="mt-6 space-y-2 border-t border-border pt-5">
        {membershipIncludes.map((m) => (
          <li key={m} className="flex items-start gap-2 text-sm text-foreground/85">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
            {m}
          </li>
        ))}
      </ul>
      <Btn to="/join" className="mt-7 w-full">
        {BATCH.cta}
      </Btn>
      <p className="mt-4 text-center text-xs text-graphite">
        One year. One build at a time. Come for the prompt. Stay for the proof.
      </p>
    </div>
  );
}

function LazyPass() {
  return (
    <section id="lazy-pass" className="section-y border-b border-border">
      <div className="shell grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-14">
        <SectionHead
          eyebrow={`LAZY PASS / ONLY ${BATCH.capacity} BUILDERS`}
          line1="JOIN THE"
          line2="BUILDING YEAR."
          body="One annual membership. Fifty-two chances to make something real, share it, and improve it with people doing the same."
        />
        <Reveal delay={0.06}>
          <LazyPassCard />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------- FAQ ------------------------------- */

export function FaqList() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-8 border-t border-border">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-b border-border">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="tap group flex w-full items-center justify-between gap-6 py-5 text-left"
            >
              <span
                className={cn(
                  "font-display text-lg uppercase transition-colors duration-[180ms] sm:text-xl",
                  isOpen ? "text-primary" : "group-hover:text-primary",
                )}
              >
                {f.q}
              </span>
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors duration-[180ms]",
                  isOpen ? "border-primary bg-primary text-white" : "border-border text-graphite",
                )}
              >
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 text-base leading-relaxed text-graphite">{f.a}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function Faq() {
  return (
    <section id="faq" className="section-y border-b border-border">
      <div className="shell">
        <SectionHead eyebrow="BEFORE YOU JOIN" line1="THE HONEST" line2="ANSWERS." />
        <FaqList />
      </div>
    </section>
  );
}

/* ---------------------------- FINAL CTA ---------------------------- */

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-primary py-20 text-white md:py-28">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-40" />
      <div className="shell relative">
        <h2 className="max-w-4xl text-[clamp(2.1rem,7vw,4.6rem)] uppercase text-white">
          <MaskLines lines={["WHAT ARE YOU BUILDING", "THIS WEEKEND?"]} />
        </h2>
        <Reveal delay={0.06}>
          <p className="mt-5 max-w-md text-[17px] text-white/80">
            Pick a build. Make it real. Come back next weekend.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Btn to="/join" variant="paper" className="w-full sm:w-auto">
              Join LazyTech
            </Btn>
            <Link
              to="/builds"
              className="tap group inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-white transition-colors duration-[180ms] hover:border-white"
            >
              See the 52 builds
              <ArrowRight className="h-4 w-4 transition-transform duration-[180ms] group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        <p className="mt-10 font-mono text-[0.7rem] tracking-[0.14em] text-white/70">
          {builds.length} BUILDS MAPPED · ₹{BRAND.price} / YEAR
        </p>
      </div>
    </section>
  );
}
