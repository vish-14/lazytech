import { createFileRoute } from "@tanstack/react-router";
import { BRAND } from "@/data/site";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — LazyTech" },
      {
        name: "description",
        content: "The terms that apply to LazyTech membership and weekend sessions.",
      },
      { property: "og:title", content: "Terms & Conditions — LazyTech" },
      { property: "og:description", content: "Terms for LazyTech membership and sessions." },
    ],
  }),
  component: () => (
    <LegalPage
      eyebrow="LEGAL"
      title="TERMS & CONDITIONS."
      updated="SEPTEMBER 2026"
      sections={[
        {
          heading: "Membership",
          body: `A ${BRAND.name} Lazy Pass gives one person access to weekend workshops, build challenges and community spaces for one year from the date of purchase. Memberships are personal and may not be shared or resold.`,
        },
        {
          heading: "Sessions",
          body: "We run one live session most weekends and aim for 52 across the year. Timing, hosts and topics may change. Recordings are made available where the host permits.",
        },
        {
          heading: "Conduct",
          body: "Members are expected to be respectful in live rooms and community spaces. We may remove access without refund for harassment, spam or sharing member-only material publicly.",
        },
        {
          heading: "Payments",
          body: `Membership is billed once for the year at the price shown at checkout. Prices are in Indian Rupees and include applicable taxes unless stated otherwise.`,
        },
        {
          heading: "Contact",
          body: `Questions about these terms can be sent to ${BRAND.email}.`,
        },
      ]}
    />
  ),
});
