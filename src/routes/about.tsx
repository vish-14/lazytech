import { createFileRoute } from "@tanstack/react-router";
import { BRAND, loop, speakerRoles } from "@/data/site";
import { Eyebrow, SectionHead } from "@/components/site/primitives";
import { MaskLines, Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { FinalCta } from "./index";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — LazyTech Weekend Builder Community" },
      {
        name: "description",
        content:
          "LazyTech is a weekend builder community. Learn less, build more: one brief, one build and one share every weekend for a year.",
      },
      { property: "og:title", content: "About LazyTech" },
      {
        property: "og:description",
        content: "A weekend builder community built around finishing things.",
      },
      { property: "og:url", content: "https://lazytech.greatskills.co.in/about" },
      { name: "twitter:title", content: "About LazyTech" },
      {
        name: "twitter:description",
        content: "A weekend builder community built around finishing things.",
      },
    ],
    links: [{ rel: "canonical", href: "https://lazytech.greatskills.co.in/about" }],
  }),
  component: AboutPage,
});

const beliefs = [
  {
    title: "FINISHING BEATS COLLECTING",
    body: "A small working thing teaches more than a saved playlist you never open.",
  },
  {
    title: "SCOPE IS THE SKILL",
    body: "Every brief is sized for one weekend, because unfinished projects are the default failure mode.",
  },
  {
    title: "PROOF TRAVELS",
    body: "A link to something real does more for you than a certificate ever will.",
  },
  {
    title: "PUBLIC IS FASTER",
    body: "Sharing early turns a private hobby into feedback, collaborators and better next builds.",
  },
];

function AboutPage() {
  return (
    <>
      <section className="section-y border-b border-border">
        <div className="shell">
          <Reveal>
            <Eyebrow>ABOUT {BRAND.name}</Eyebrow>
          </Reveal>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.3rem,7vw,4.6rem)] uppercase">
            <MaskLines
              lines={[
                "A WEEKEND SYSTEM FOR",
                <span className="text-primary">PEOPLE WHO MAKE THINGS.</span>,
              ]}
            />
          </h1>
          <Reveal delay={0.06}>
            <p className="mt-6 max-w-2xl text-[17px] leading-[1.65] text-graphite">
              LazyTech exists because most people do not need more content. They need a reason to
              start on Saturday and something to show by Sunday. Fifty-two weekends, fifty-two
              builds, one profile that proves it happened.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-y border-b border-border">
        <div className="shell">
          <SectionHead eyebrow="WHAT WE BELIEVE" line1="FOUR RULES" line2="WE BUILD AROUND." />
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2">
            {beliefs.map((b) => (
              <StaggerItem key={b.title} className="h-full">
                <div className="artifact h-full p-5 sm:p-6">
                  <p className="font-display text-xl uppercase">{b.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-graphite">{b.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-y border-b border-border">
        <div className="shell">
          <SectionHead
            eyebrow="THE LAZY LOOP"
            line1="HOW A WEEKEND"
            line2="ACTUALLY RUNS."
            body="Learn, build, share, improve. The same four moves every week, so momentum comes from the system and not from motivation."
          />
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loop.map((l, i) => (
              <StaggerItem key={l.step} className="h-full">
                <div className="artifact h-full p-5">
                  <span className="font-mono text-[0.7rem] text-primary">0{i + 1}</span>
                  <p className="mt-8 font-display text-xl uppercase">{l.step}</p>
                  <p className="mt-2 text-sm text-graphite">{l.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-y border-b border-border">
        <div className="shell">
          <SectionHead
            eyebrow="SPEAKERS TBA"
            line1="NAMES ANNOUNCED AS"
            line2="SESSIONS ARE CONFIRMED."
            body="We do not publish people who have not agreed to show up."
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {speakerRoles.map((r) => (
              <span
                key={r}
                className="rounded-full border border-border px-4 py-2 font-mono text-[0.7rem] tracking-[0.14em] text-graphite"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
