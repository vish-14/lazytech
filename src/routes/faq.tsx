import { createFileRoute } from "@tanstack/react-router";
import { Eyebrow } from "@/components/site/primitives";
import { MaskLines, Reveal } from "@/components/site/motion";
import { FaqList, FinalCta } from "./index";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — LazyTech Weekend Builder Community" },
      {
        name: "description",
        content:
          "How LazyTech weekends work, what the Lazy Pass includes, and what ₹499 a year covers.",
      },
      { property: "og:title", content: "FAQ — LazyTech" },
      {
        property: "og:description",
        content: "Weekends, builds, membership and pricing, answered plainly.",
      },
      { property: "og:url", content: "https://lazytech.greatskills.co.in/faq" },
      { name: "twitter:title", content: "FAQ — LazyTech" },
      {
        name: "twitter:description",
        content: "Weekends, builds, membership and pricing, answered plainly.",
      },
    ],
    links: [{ rel: "canonical", href: "https://lazytech.greatskills.co.in/faq" }],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <section className="section-y border-b border-border">
        <div className="shell">
          <Reveal>
            <Eyebrow>BEFORE YOU JOIN</Eyebrow>
          </Reveal>
          <h1 className="mt-5 text-[clamp(2.3rem,8vw,4.8rem)] uppercase">
            <MaskLines lines={["THE HONEST", <span className="text-primary">ANSWERS.</span>]} />
          </h1>
          <FaqList />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
