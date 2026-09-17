import { createFileRoute } from "@tanstack/react-router";
import { BRAND } from "@/data/site";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — LazyTech" },
      {
        name: "description",
        content: "How LazyTech collects, stores and uses member information.",
      },
      { property: "og:title", content: "Privacy Policy — LazyTech" },
      { property: "og:description", content: "How we handle your information." },
    ],
  }),
  component: () => (
    <LegalPage
      eyebrow="LEGAL"
      title="PRIVACY POLICY."
      updated="SEPTEMBER 2026"
      sections={[
        {
          heading: "What we collect",
          body: "When you apply to join or contact us, we collect your name, email, phone number, city and anything you choose to write in the form.",
        },
        {
          heading: "Why we collect it",
          body: "To process your membership, send session invitations and reminders, and reply to your questions. We do not sell your information.",
        },
        {
          heading: "Where it is stored",
          body: "Applications and messages are stored in our managed database. Access is limited to the people running the club.",
        },
        {
          heading: "Your choices",
          body: `You can ask us to correct or delete your information at any time by writing to ${BRAND.email}.`,
        },
      ]}
    />
  ),
});
