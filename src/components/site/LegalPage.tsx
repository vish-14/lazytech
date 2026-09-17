import { Eyebrow } from "@/components/site/primitives";
import { MaskLines, Reveal, Stagger, StaggerItem } from "@/components/site/motion";

export function LegalPage({
  eyebrow,
  title,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <section className="section-y">
      <div className="shell max-w-3xl">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <h1 className="mt-6 text-[clamp(2.2rem,8vw,4.6rem)]">
          <MaskLines lines={[title]} />
        </h1>
        <p className="eyebrow mt-4 text-graphite">LAST UPDATED {updated}</p>
        <Stagger className="mt-12 border-t border-border">
          {sections.map((s) => (
            <StaggerItem key={s.heading} className="border-b border-border py-8">
              <h2 className="text-2xl">{s.heading}</h2>
              <p className="mt-4 text-sm leading-relaxed text-graphite">{s.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
