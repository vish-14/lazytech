import { createFileRoute } from "@tanstack/react-router";
import { BATCH, BRAND, faqs, loop, seasons } from "@/data/site";
import { Eyebrow } from "@/components/site/primitives";
import { MaskLines, Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { LazyPassCard, FinalCta } from "./index";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Lazy Pass — LazyTech Membership" },
      {
        name: "description",
        content: `Early-bird Lazy Pass is ₹${BRAND.price} for one building year (regular ₹${BRAND.regularPrice}). 52 weekend workshops, build challenges, community access, showcases, speaker sessions and a Builder Profile.`,
      },
      { property: "og:title", content: "Lazy Pass — LazyTech Membership" },
      {
        property: "og:description",
        content: `Early-bird Lazy Pass: ₹${BRAND.price} for one building year (regular ₹${BRAND.regularPrice}).`,
      },
      { property: "og:url", content: "https://lazytech.greatskills.co.in/membership" },
      { name: "twitter:title", content: "Lazy Pass — LazyTech Membership" },
      {
        name: "twitter:description",
        content: `Early-bird Lazy Pass: ₹${BRAND.price} for one building year (regular ₹${BRAND.regularPrice}).`,
      },
    ],
    links: [{ rel: "canonical", href: "https://lazytech.greatskills.co.in/membership" }],
  }),
  component: MembershipPage,
});

function MembershipPage() {
  return (
    <>
      <section className="section-y border-b border-border">
        <div className="shell grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-14">
          <div>
            <Reveal>
              <Eyebrow>
                LAZY PASS / {BATCH.label} · {BATCH.capacity} SEATS
              </Eyebrow>
            </Reveal>
            <h1 className="mt-5 text-[clamp(2.3rem,7vw,4.4rem)] uppercase">
              <MaskLines
                lines={["JOIN THE", <span className="text-primary">BUILDING YEAR.</span>]}
              />
            </h1>
            <Reveal delay={0.06}>
              <p className="mt-5 max-w-lg text-[17px] leading-[1.65] text-graphite">
                One membership, one year, 52 chances to make something that exists after the weekend
                ends.
              </p>
            </Reveal>
            <Reveal delay={0.09}>
              <p className="mt-4 max-w-lg text-sm leading-[1.7] text-graphite">
                {BATCH.supporting} We start {BATCH.startLabel}.
              </p>
            </Reveal>

            <Stagger className="mt-10 border-t border-border">
              {seasons.map((s) => (
                <StaggerItem key={s.key}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border py-4">
                    <p className="font-display text-lg uppercase">{s.label}</p>
                    <p className="font-mono text-[0.7rem] text-graphite">{s.range}</p>
                    <p className="w-full text-sm text-graphite sm:w-auto sm:max-w-xs">{s.blurb}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal delay={0.06} className="md:sticky md:top-28 md:h-fit">
            <LazyPassCard />
          </Reveal>
        </div>
      </section>

      <section className="section-y border-b border-border">
        <div className="shell">
          <Reveal>
            <Eyebrow>WHAT A WEEKEND LOOKS LIKE</Eyebrow>
          </Reveal>
          <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <Reveal>
            <Eyebrow>BEFORE YOU JOIN</Eyebrow>
          </Reveal>
          <Stagger className="mt-8 grid gap-4 sm:grid-cols-2">
            {faqs.slice(0, 4).map((f) => (
              <StaggerItem key={f.q} className="h-full">
                <div className="artifact h-full p-5">
                  <p className="font-display text-lg uppercase">{f.q}</p>
                  <p className="mt-3 text-sm leading-relaxed text-graphite">{f.a}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
