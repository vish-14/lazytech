import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { builds, weekLabel } from "@/data/site";
import { Btn, Eyebrow, Pill } from "@/components/site/primitives";
import { MaskLines, Reveal, Stagger, StaggerItem } from "@/components/site/motion";

export const Route = createFileRoute("/builds/$week")({
  loader: ({ params }) => {
    const build = builds.find((b) => b.slug === params.week);
    if (!build) throw notFound();
    return { build };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Build not found — LazyTech" }, { name: "robots", content: "noindex" }],
      };
    }
    const { build } = loaderData;
    const title = `Week ${build.slug}: ${build.title} — LazyTech`;
    const description = `${build.learn}. You build a ${build.build.toLowerCase()} and leave with a ${build.output.toLowerCase()}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: BuildDetail,
  notFoundComponent: () => (
    <section className="section-y">
      <div className="shell">
        <h1 className="text-4xl uppercase">Build not found</h1>
        <Link to="/builds" className="eyebrow link-underline mt-5 inline-flex text-primary">
          Back to 52 builds
        </Link>
      </div>
    </section>
  ),
});

function BuildDetail() {
  const { build } = Route.useLoaderData();
  const prev = builds.find((b) => b.week === build.week - 1);
  const next = builds.find((b) => b.week === build.week + 1);
  const related = builds
    .filter((b) => b.season === build.season && b.week !== build.week)
    .slice(0, 3);

  return (
    <>
      <section className="section-y border-b border-border">
        <div className="shell">
          <Reveal>
            <Link
              to="/builds"
              className="eyebrow inline-flex items-center gap-2 text-graphite transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> ALL 52 BUILDS
            </Link>
          </Reveal>
          <div className="mt-6">
            <Eyebrow>
              {weekLabel(build.week)} / {build.season.toUpperCase()}
            </Eyebrow>
          </div>
          <h1 className="mt-5 max-w-3xl text-[clamp(2.2rem,7vw,4.4rem)] uppercase">
            <MaskLines lines={[build.title]} />
          </h1>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { label: "WHAT YOU LEARN", value: build.learn },
              { label: "WHAT YOU BUILD", value: build.build },
              { label: "WHAT YOU LEAVE WITH", value: build.output, accent: true },
            ].map((c) => (
              <div key={c.label} className="artifact p-5">
                <p className="eyebrow text-graphite">{c.label}</p>
                <p
                  className={`mt-3 font-display text-xl uppercase leading-tight ${c.accent ? "text-lime" : ""}`}
                >
                  {c.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Btn to="/join">Join LazyTech</Btn>
            <Btn to="/membership" variant="ghost">
              See the Lazy Pass
            </Btn>
          </div>

          <div className="mt-10 flex justify-between gap-4 border-t border-border pt-6">
            {prev ? (
              <Link
                to="/builds/$week"
                params={{ week: prev.slug }}
                className="group flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-graphite hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> {weekLabel(prev.week)} {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to="/builds/$week"
                params={{ week: next.slug }}
                className="group flex items-center gap-2 text-right font-mono text-[0.7rem] uppercase tracking-[0.12em] text-graphite hover:text-foreground"
              >
                {weekLabel(next.week)} {next.title} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell">
          <p className="eyebrow text-graphite">MORE FROM {build.season.toUpperCase()}</p>
          <Stagger className="mt-6 grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <StaggerItem key={r.week} className="h-full">
                <Link to="/builds/$week" params={{ week: r.slug }} className="block h-full">
                  <div className="artifact h-full p-5">
                    <Pill>{weekLabel(r.week)}</Pill>
                    <p className="mt-4 font-display text-lg uppercase">{r.title}</p>
                    <p className="mt-2 text-sm text-graphite">{r.output}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
