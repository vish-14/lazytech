import { createFileRoute } from "@tanstack/react-router";
import { BRAND } from "@/data/site";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — LazyTech" },
      { name: "description", content: "How refunds work for LazyTech annual memberships." },
      { property: "og:title", content: "Refund Policy — LazyTech" },
      { property: "og:description", content: "How refunds work for annual memberships." },
    ],
  }),
  component: () => (
    <LegalPage
      eyebrow="LEGAL"
      title="REFUND POLICY."
      updated="SEPTEMBER 2026"
      sections={[
        {
          heading: "7-day window",
          body: "If the club isn't for you, write to us within 7 days of your first live session and we'll refund your membership in full.",
        },
        {
          heading: "After 7 days",
          body: "After the first week we don't offer partial refunds for the remainder of the year, since sessions and archive access are already available to you.",
        },
        {
          heading: "How to request",
          body: `Email ${BRAND.email} from the address you signed up with. Refunds are processed to the original payment method within 7–10 working days.`,
        },
      ]}
    />
  ),
});
