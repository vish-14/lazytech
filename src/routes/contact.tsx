import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Send } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { BRAND } from "@/data/site";
import { Eyebrow } from "@/components/site/primitives";
import { MaskLines, Reveal } from "@/components/site/motion";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — LazyTech Weekend Club" },
      {
        name: "description",
        content: "Questions about LazyTech membership or sessions? Write to us.",
      },
      { property: "og:title", content: "Contact — LazyTech Weekend Club" },
      {
        property: "og:description",
        content: "Questions about membership or sessions? Write to us.",
      },
      { property: "og:url", content: "https://lazytech.greatskills.co.in/contact" },
      { name: "twitter:title", content: "Contact — LazyTech Weekend Club" },
      {
        name: "twitter:description",
        content: "Questions about membership or sessions? Write to us.",
      },
    ],
    links: [{ rel: "canonical", href: "https://lazytech.greatskills.co.in/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(5, "Add a short message").max(1000),
});

const fieldClass =
  "mt-3 w-full rounded-full border border-border bg-card px-5 py-4 text-sm outline-none transition-colors duration-200 focus:border-primary sm:px-6";

function ContactPage() {
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      message: fd.get("message"),
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setBusy(false);
    if (error) {
      toast.error(`Couldn't send that. Email us at ${BRAND.email}.`);
      return;
    }
    form.reset();
    toast.success("Message sent. We usually reply within two days.");
  }

  return (
    <section className="section-y">
      <div className="shell grid gap-12 md:grid-cols-2 md:gap-14">
        <div>
          <Reveal>
            <Eyebrow>CONTACT</Eyebrow>
          </Reveal>
          <h1 className="mt-6 text-[clamp(2.4rem,8vw,4.6rem)]">
            <MaskLines lines={["SAY", <span className="text-primary">HELLO.</span>]} />
          </h1>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-graphite">
              Questions about membership, sessions or partnering with the club? Write to{" "}
              <a href={`mailto:${BRAND.email}`} className="link-underline text-foreground">
                {BRAND.email}
              </a>{" "}
              or use the form.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <form
            onSubmit={onSubmit}
            className="space-y-6 rounded-[16px] border border-border p-6 sm:p-7"
          >
            <div>
              <label htmlFor="name" className="eyebrow text-graphite">
                NAME
              </label>
              <input id="name" name="name" maxLength={100} className={fieldClass} />
              {errors["name"] ? (
                <p className="mt-2 text-xs text-primary">{errors["name"]}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="email" className="eyebrow text-graphite">
                EMAIL
              </label>
              <input id="email" name="email" type="email" maxLength={255} className={fieldClass} />
              {errors["email"] ? (
                <p className="mt-2 text-xs text-primary">{errors["email"]}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="message" className="eyebrow text-graphite">
                MESSAGE
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                maxLength={1000}
                className="mt-3 w-full rounded-[20px] border border-border bg-card px-5 py-4 text-sm outline-none transition-colors duration-200 focus:border-primary"
              />
              {errors["message"] ? (
                <p className="mt-2 text-xs text-primary">{errors["message"]}</p>
              ) : null}
            </div>
            <button
              type="submit"
              disabled={busy}
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 font-display text-sm uppercase tracking-[0.1em] text-white transition-transform duration-300 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-[#c40021] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
              />
              <span className="relative flex items-center gap-2">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {busy ? "Sending…" : "Send message"}
              </span>
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
