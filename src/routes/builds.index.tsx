import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { builds, seasons, weekLabel } from "@/data/site";
import { Eyebrow } from "@/components/site/primitives";
import { MaskLines, Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { BuildsRoadmap } from "@/components/site/BuildsRoadmap";
import { FinalCta } from "./index";

export const Route = createFileRoute("/builds/")({
  head: () => ({
    meta: [
      { title: "52 Builds — LazyTech" },
      {
        name: "description",
        content:
          "The full LazyTech roadmap: 52 weekend builds across four seasons, each with a brief and a finished thing you leave with.",
      },
      { property: "og:title", content: "52 Builds — LazyTech" },
      {
        property: "og:description",
        content: "52 weekends, 52 finished builds. See the whole year.",
      },
    ],
  }),
  component: BuildsPage,
});

function BuildsPage() {
  return (
    <>
      <section className="section-y border-b border-border">
        <div className="shell">
          <Reveal>
            <Eyebrow>THE YEAR IN BUILDS</Eyebrow>
          </Reveal>
          <h1 className="mt-5 text-[clamp(2.4rem,8vw,5rem)] uppercase">
            <MaskLines lines={["52 WEEKS.", <span className="text-primary">52 BUILDS.</span>]} />
          </h1>
          <Reveal delay={0.06}>
            <p className="mt-5 max-w-xl text-[17px] leading-[1.65] text-graphite">
              One year. Four phases. Fifty-two things you can build and show.
            </p>
          </Reveal>
          <div className="mt-10">
            <BuildsRoadmap />
          </div>
        </div>
      </section>

      {seasons.map((s) => (
        <section key={s.key} className="section-y border-b border-border">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow text-primary">{s.range}</p>
                <h2 className="mt-3 text-[clamp(1.8rem,5vw,3rem)] uppercase">{s.label}</h2>
              </div>
              <p className="max-w-sm text-sm text-graphite">{s.blurb}</p>
            </div>

            <Stagger className="mt-8 border-t border-border">
              {builds
                .filter((b) => b.season === s.key)
                .map((b) => (
                  <StaggerItem key={b.week}>
                    <Link
                      to="/builds/$week"
                      params={{ week: b.slug }}
                      className="group flex flex-col gap-2 border-b border-border py-5 transition-colors duration-[180ms] hover:border-primary sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                    >
                      <div className="flex min-w-0 items-baseline gap-4">
                        <span className="font-mono text-[0.7rem] text-primary">
                          {weekLabel(b.week)}
                        </span>
                        <span className="font-display text-lg uppercase sm:text-xl">{b.title}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-4">
                        <span className="font-mono text-[0.7rem] text-graphite">{b.output}</span>
                        <ArrowRight className="h-4 w-4 text-graphite transition-transform duration-[180ms] group-hover:translate-x-1 group-hover:text-primary" />
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
            </Stagger>
          </div>
        </section>
      ))}

      <FinalCta />
    </>
  );
}
