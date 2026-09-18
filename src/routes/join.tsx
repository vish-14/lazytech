import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Check, GraduationCap, Briefcase, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Spline from "@splinetool/react-spline";
import { z } from "zod";
import { toast } from "sonner";
import { BRAND } from "@/data/site";
import { Eyebrow } from "@/components/site/primitives";
import { MaskLines, Reveal } from "@/components/site/motion";
import { supabase } from "@/lib/supabase";
import { startCheckout } from "@/lib/checkout";
import { useSeats } from "@/lib/seats";
import { BATCH } from "@/data/site";
import { BatchBadge, BatchCountdown, SeatMeter } from "@/components/site/batch";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: `Join LazyTech — ₹${BRAND.price} for a year` },
      {
        name: "description",
        content: `Apply to join LazyTech. One live practical session every weekend for a full year at ₹${BRAND.price}.`,
      },
      { property: "og:title", content: `Join LazyTech — ₹${BRAND.price} for a year` },
      { property: "og:description", content: "One useful thing every weekend, for a full year." },
      { property: "og:url", content: "https://lazytech.greatskills.co.in/join" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `Join LazyTech — ₹${BRAND.price} for a year` },
      { name: "twitter:description", content: "One useful thing every weekend, for a full year." },
    ],
    links: [{ rel: "canonical", href: "https://lazytech.greatskills.co.in/join" }],
  }),
  component: JoinPage,
});

const baseSchema = {
  name: z.string().trim().min(2, "Tell us your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  city: z.string().trim().min(2, "Enter your city").max(100),
  organisation: z.string().trim().min(2, "This helps us place you").max(140),
  goal: z.string().trim().max(600).optional(),
};

const studentSchema = z.object({
  ...baseSchema,
  profile: z.literal("student"),
  course: z.string().trim().min(1, "Pick your course").max(60),
  branch: z.string().trim().min(1, "Pick your branch").max(60),
  year: z.string().trim().min(1, "Pick your current year").max(40),
  interests: z.array(z.string()).min(1, "Pick at least one"),
});

const professionalSchema = z.object({
  ...baseSchema,
  profile: z.literal("professional"),
  role: z.string().trim().min(2, "Tell us your role").max(100),
  experience: z.string().trim().min(1, "Pick your experience").max(40),
  industry: z.string().trim().min(1, "Pick your industry").max(60),
  interests: z.array(z.string()).min(1, "Pick at least one"),
});

const courses = ["B.Tech", "B.E", "BCA", "MCA", "B.Sc", "M.Sc", "MBA", "Diploma", "Other"];
const branches = [
  "Computer Science",
  "Information Technology",
  "AI & Data Science",
  "Electronics",
  "Mechanical",
  "Other",
];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year", "Graduated"];
const studentInterests = [
  "AI",
  "Web Development",
  "App Development",
  "Design",
  "Automation",
  "Cybersecurity",
  "Startups",
  "Freelancing",
  "Data Science",
  "Other",
];
const experiences = ["0-1 Years", "1-3 Years", "3-5 Years", "5-10 Years", "10+ Years"];
const industries = [
  "Technology",
  "Startup",
  "Finance",
  "Education",
  "Healthcare",
  "Design",
  "Marketing",
  "Other",
];
const proSkills = [
  "AI",
  "Software Development",
  "Product",
  "Design",
  "Data",
  "Cloud",
  "Marketing",
  "Business",
  "Other",
];

const steps = ["Profile", "Interests", "Goals"];

function JoinPage() {
  const [profile, setProfile] = useState<"student" | "professional">("student");
  const [course, setCourse] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [experience, setExperience] = useState("");
  const [industry, setIndustry] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const [paid, setPaid] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lazytech_paid") === "true";
    }
    return false;
  });

  const [done, setDone] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lazytech_paid") === "true";
    }
    return false;
  });

  const [builderNumber, setBuilderNumber] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const bn = localStorage.getItem("lazytech_builder_number");
      return bn ? parseInt(bn, 10) : null;
    }
    return null;
  });
  const [customerName, setCustomerName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lazytech_customer_name") || "";
    }
    return "";
  });
  const seats = useSeats();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isStudent = profile === "student";
  const interestOptions = isStudent ? studentInterests : proSkills;

  function toggleInterest(value: string) {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  function switchProfile(next: "student" | "professional") {
    if (next === profile) return;
    setProfile(next);
    setInterests([]);
    setErrors({});
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const common = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      city: fd.get("city"),
      organisation: fd.get("organisation") ?? "",
      goal: fd.get("goal") ?? "",
      interests,
    };

    const parsed = isStudent
      ? studentSchema.safeParse({ ...common, profile: "student", course, branch, year })
      : professionalSchema.safeParse({
          ...common,
          profile: "professional",
          role: fd.get("role") ?? "",
          experience,
          industry,
        });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setBusy(true);

    const d = parsed.data;
    const details =
      d.profile === "student"
        ? [
            `Student · ${d.course} · ${d.branch} · ${d.year}`,
            `Interested in: ${d.interests.join(", ")}`,
          ]
        : [
            `Professional · ${d.role} · ${d.industry} · ${d.experience}`,
            `Works with: ${d.interests.join(", ")}`,
          ];

    const leadId = crypto.randomUUID();
    const { error } = await supabase.from("leads").insert({
      id: leadId,
      name: d.name,
      email: d.email,
      phone: d.phone,
      city: d.city,
      profile: d.profile,
      organisation: d.organisation,
      goal: [...details, d.goal ? `Goal: ${d.goal}` : ""].filter(Boolean).join("\n"),
      amount: BRAND.price,
      source: "join-page",
    });

    if (error) {
      setBusy(false);
      toast.error("We couldn't save your details. Please try again or email us.");
      return;
    }

    const result = await startCheckout({
      leadId,
      name: d.name,
      email: d.email,
      phone: d.phone,
    });
    setBusy(false);

    if (result.status === "paid") {
      setPaid(true);
      setBuilderNumber(result.builderNumber);
      setCustomerName(d.name);
      setDone(true);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        localStorage.setItem("lazytech_paid", "true");
        localStorage.setItem("lazytech_customer_name", d.name);
        if (result.builderNumber) {
          localStorage.setItem("lazytech_builder_number", String(result.builderNumber));
        }
      }
      toast.success(`Welcome to LazyTech ${BATCH.name}.`);
      return;
    }
    if (result.status === "dismissed") {
      toast("Payment cancelled — your details are saved, you can pay anytime.");
    } else {
      toast.error(result.message);
    }
    setDone(true);
  }

  return (
    <section className="section-y">
      <div className="shell grid gap-12 md:grid-cols-[1.2fr_0.8fr] md:gap-14">
        <div>
          <Reveal>
            <Eyebrow>JOIN THE CLUB</Eyebrow>
          </Reveal>
          <h1 className="mt-6 text-[clamp(2.2rem,8vw,4.6rem)]">
            <MaskLines
              lines={["ONE WEEKEND.", <span className="text-primary">ONE USEFUL THING.</span>]}
            />
          </h1>

          {done ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-12 rounded-[16px] border border-primary p-7 sm:p-8 relative overflow-hidden bg-card"
            >
              {paid ? (
                <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                  <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
                </div>
              ) : null}
              <div className="relative z-10">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-white shadow-lg">
                  <Check className="h-5 w-5" />
                </span>
                <p className="mt-5 font-display text-3xl text-primary">
                  {paid ? `WELCOME TO LAZYTECH ${BATCH.label}.` : "YOU'RE IN THE QUEUE."}
                </p>
                {paid && builderNumber ? (
                  <p className="mt-3 font-mono text-sm uppercase tracking-[0.2em] text-foreground">
                    Builder #{String(builderNumber).padStart(3, "0")}
                  </p>
                ) : null}
                <p className="mt-4 text-sm text-graphite">
                  {paid
                    ? `Your seat in ${BATCH.name} is confirmed. We start ${BATCH.startLabel} — joining instructions are on the way to your inbox.`
                    : "We've got your details. Your payment didn't go through yet — finish it below whenever you're ready."}
                </p>
                {!paid ? (
                  <button
                    type="button"
                    onClick={() => setDone(false)}
                    className="tap mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-white"
                  >
                    Try payment again <ArrowUpRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      const { jsPDF } = await import("jspdf");
                      const doc = new jsPDF();
                      
                      // Add branding header
                      doc.setFillColor(15, 15, 15);
                      doc.rect(0, 0, 210, 40, "F");
                      
                      doc.setTextColor(255, 60, 60);
                      doc.setFont("helvetica", "bold");
                      doc.setFontSize(24);
                      doc.text("LAZYTECH", 20, 25);
                      
                      doc.setTextColor(255, 255, 255);
                      doc.setFont("helvetica", "normal");
                      doc.setFontSize(12);
                      doc.text("PAYMENT RECEIPT", 145, 25);
                      
                      // Details
                      doc.setTextColor(50, 50, 50);
                      doc.setFontSize(11);
                      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 55);
                      doc.text(`Time: ${new Date().toLocaleTimeString()}`, 20, 62);
                      doc.text(`Builder ID: #${String(builderNumber || 0).padStart(3, "0")}`, 145, 55);
                      doc.text(`Payment Mode: Online (Razorpay)`, 145, 62);
                      
                      if (customerName) {
                        doc.setFont("helvetica", "bold");
                        doc.text(`Billed To:`, 20, 75);
                        doc.setFont("helvetica", "normal");
                        doc.text(customerName, 20, 82);
                      }
                      
                      // Separator
                      doc.setDrawColor(200, 200, 200);
                      doc.line(20, 90, 190, 90);
                      
                      // Table header
                      doc.setFont("helvetica", "bold");
                      doc.text("DESCRIPTION", 20, 105);
                      doc.text("AMOUNT", 160, 105);
                      
                      // Table item
                      doc.setFont("helvetica", "normal");
                      doc.text("Lazy Pass - 1 Building Year", 20, 115);
                      doc.text(`INR ${BRAND.price}.00`, 160, 115);
                      
                      // Separator
                      doc.line(20, 125, 190, 125);
                      
                      // Total
                      doc.setFont("helvetica", "bold");
                      doc.text("TOTAL PAID", 120, 140);
                      doc.setTextColor(255, 60, 60);
                      doc.setFontSize(14);
                      doc.text(`INR ${BRAND.price}.00`, 160, 140);
                      
                      // Footer
                      doc.setTextColor(150, 150, 150);
                      doc.setFont("helvetica", "normal");
                      doc.setFontSize(10);
                      doc.text("Thank you for joining the club. See you this weekend.", 20, 175);
                      
                      // Load QR Code
                      await new Promise((resolve) => {
                        const img = new Image();
                        img.crossOrigin = "Anonymous";
                        img.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://chat.whatsapp.com/GFTwEnY8pjB1zZywAHsYmq?s=cl&p=a&mlu=4";
                        img.onload = () => {
                          doc.addImage(img, "PNG", 160, 150, 30, 30);
                          doc.setTextColor(100, 100, 100);
                          doc.setFontSize(8);
                          doc.text("Scan to join WhatsApp", 157, 185);
                          resolve(true);
                        };
                        img.onerror = () => resolve(false);
                      });
                      
                      doc.save("lazytech-receipt.pdf");
                    }}
                    className="tap mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-background hover:bg-foreground/90"
                  >
                    Download Receipt
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} className="mt-12 space-y-10" noValidate>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Full name" name="name" autoComplete="name" error={errors["name"]} />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  error={errors["email"]}
                />
                <Field
                  label="Phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  error={errors["phone"]}
                />
                <Field
                  label="City"
                  name="city"
                  autoComplete="address-level2"
                  error={errors["city"]}
                />
              </div>

              <div className="border-t border-border pt-10">
                <StepBar current={0} />
                <h2 className="mt-6 font-display text-3xl uppercase">WHO ARE YOU?</h2>
                <p className="mt-3 max-w-md text-sm text-graphite">
                  Tell us a little about yourself so we can make LazyTech more relevant for you.
                </p>

                <p className="eyebrow mt-8 text-graphite">I AM A</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <ProfileButton
                    active={isStudent}
                    onClick={() => switchProfile("student")}
                    icon={<GraduationCap className="h-5 w-5" />}
                    label="Student"
                  />
                  <ProfileButton
                    active={!isStudent}
                    onClick={() => switchProfile("professional")}
                    icon={<Briefcase className="h-5 w-5" />}
                    label="Professional"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={profile}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8"
                >
                  {isStudent ? (
                    <>
                      <Field
                        label="College / University"
                        name="organisation"
                        placeholder="Enter your college name"
                        error={errors["organisation"]}
                      />
                      <div className="grid gap-6 sm:grid-cols-2">
                        <Select
                          label="Degree / Course"
                          value={course}
                          onChange={setCourse}
                          options={courses}
                          error={errors["course"]}
                        />
                        <Select
                          label="Branch / Specialization"
                          value={branch}
                          onChange={setBranch}
                          options={branches}
                          error={errors["branch"]}
                        />
                      </div>
                      <ChipGroup
                        label="Current year"
                        options={years}
                        value={year}
                        onSelect={setYear}
                        error={errors["year"]}
                      />
                    </>
                  ) : (
                    <>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <Field
                          label="Current role"
                          name="role"
                          placeholder="e.g. Software Engineer"
                          error={errors["role"]}
                        />
                        <Field
                          label="Company / Organization"
                          name="organisation"
                          placeholder="Company name"
                          error={errors["organisation"]}
                        />
                      </div>
                      <ChipGroup
                        label="Years of experience"
                        options={experiences}
                        value={experience}
                        onSelect={setExperience}
                        error={errors["experience"]}
                      />
                      <Select
                        label="Industry"
                        value={industry}
                        onChange={setIndustry}
                        options={industries}
                        error={errors["industry"]}
                      />
                    </>
                  )}

                  <div className="border-t border-border pt-10">
                    <StepBar current={1} />
                    <p className="eyebrow mt-6 text-graphite">
                      {isStudent ? "WHAT ARE YOU INTERESTED IN?" : "SKILLS YOU WORK WITH"}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {interestOptions.map((opt) => {
                        const active = interests.includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            aria-pressed={active}
                            onClick={() => toggleInterest(opt)}
                            className={`tap rounded-full border px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] transition-[transform,background-color,border-color,color] duration-200 active:scale-[0.97] ${
                              active
                                ? "border-primary bg-primary text-white"
                                : "border-border text-foreground hover:border-foreground"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {errors["interests"] ? (
                      <p className="mt-3 text-xs text-primary">{errors["interests"]}</p>
                    ) : null}
                  </div>

                  <div className="border-t border-border pt-10">
                    <StepBar current={2} />
                    <label htmlFor="goal" className="eyebrow mt-6 block text-graphite">
                      {isStudent
                        ? "WHAT DO YOU WANT TO ACHIEVE WITH LAZYTECH?"
                        : "WHAT ARE YOU LOOKING FOR FROM LAZYTECH?"}
                    </label>
                    <textarea
                      id="goal"
                      name="goal"
                      rows={4}
                      maxLength={600}
                      placeholder={
                        isStudent
                          ? "Build projects, learn AI, prepare for internships, explore technology..."
                          : "Learn emerging technologies, network with builders, explore new tools..."
                      }
                      className="mt-3 w-full rounded-[20px] border border-border bg-card px-5 py-4 text-base outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-graphite focus:border-primary focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_18%,transparent)] sm:text-sm"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              <button
                type="submit"
                disabled={busy || seats.full}
                className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 font-display text-sm uppercase tracking-[0.1em] text-white transition-transform duration-300 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 bg-[#c40021] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                />
                <span className="relative flex items-center gap-2">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {busy
                    ? "Opening payment…"
                    : seats.full
                      ? `${BATCH.label} full`
                      : `Pay ₹${BRAND.price} • ${BATCH.cta}`}
                  {busy ? null : <ArrowUpRight className="h-4 w-4" />}
                </span>
              </button>
              <p className="text-xs text-graphite">
                {seats.full
                  ? "Batch 01 is full. Join the Batch 02 waitlist — email us and we'll hold your place."
                  : "Secure payment by Razorpay. UPI, cards, netbanking and wallets accepted."}
              </p>
            </form>
          )}
        </div>

        <aside className="h-fit md:sticky md:top-28">
          <Reveal delay={0.1}>
            <div className="relative">
              <div
                aria-hidden
                className="absolute inset-0 translate-x-[7px] translate-y-[10px] rounded-[16px] bg-primary"
              />
              <div className="relative rounded-[16px] border border-border bg-card p-6 sm:p-7">
                <BatchBadge className="mb-5" />
                <p className="eyebrow text-graphite">ORDER SUMMARY</p>
                <p className="mt-5 font-display text-2xl">LAZY PASS · 1 BUILDING YEAR</p>
                <div className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
                  <Row label="Weekend workshops" value="52" />
                  <Row label="Build challenges" value="Every week" />
                  <Row label="Builder Profile" value="Included" />
                  <Row label="Community + showcases" value="Included" />
                </div>
                <SeatMeter className="mt-6 border-t border-border pt-6" />
                <BatchCountdown className="mt-6 border-t border-border pt-6" />
                <div className="mt-6 flex items-end justify-between border-t border-border pt-6">
                  <span className="eyebrow text-foreground">TOTAL</span>
                  <div className="text-right">
                    <span className="font-mono text-sm tracking-[0.12em] text-graphite line-through">
                      ₹{BRAND.regularPrice}
                    </span>
                    <span className="ml-2 font-display text-4xl text-primary">₹{BRAND.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </aside>
      </div>
    </section>
  );
}

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="eyebrow text-primary">STEP {current + 1} OF 3</span>
      <div className="flex items-center gap-3">
        {steps.map((s, i) => (
          <span
            key={s}
            className={`font-mono text-[0.65rem] uppercase tracking-[0.18em] transition-colors duration-200 ${
              i === current ? "text-foreground" : "text-graphite/60"
            }`}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProfileButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`tap relative flex min-h-[64px] items-center gap-3 overflow-hidden rounded-full border px-6 py-4 text-left transition-[transform,border-color,color] duration-200 active:scale-[0.98] ${
        active
          ? "border-primary text-white"
          : "border-border text-foreground hover:border-foreground"
      }`}
    >
      {active ? (
        <motion.span
          layoutId="profile-fill"
          className="absolute inset-0 -z-10 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 360, damping: 32 }}
        />
      ) : null}
      {icon}
      <span className="font-mono text-xs uppercase tracking-[0.16em]">{label}</span>
    </button>
  );
}

function ChipGroup({
  label,
  options,
  value,
  onSelect,
  error,
}: {
  label: string;
  options: string[];
  value: string;
  onSelect: (v: string) => void;
  error?: string | undefined;
}) {
  return (
    <div>
      <p className="eyebrow text-graphite">{label}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(opt)}
              className={`tap rounded-full border px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] transition-[transform,background-color,border-color,color] duration-200 active:scale-[0.97] ${
                active
                  ? "border-primary bg-primary text-white"
                  : "border-border text-foreground hover:border-foreground"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {error ? <p className="mt-3 text-xs text-primary">{error}</p> : null}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string | undefined;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="eyebrow text-graphite">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        className={`mt-3 min-h-[56px] w-full appearance-none rounded-full border bg-card px-5 py-4 text-base outline-none transition-[border-color,box-shadow] duration-200 focus:border-primary focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_18%,transparent)] sm:px-6 sm:text-sm ${
          error ? "border-primary" : "border-border"
        } ${value ? "text-foreground" : "text-graphite"}`}
      >
        <option value="">Select an option</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-card text-foreground">
            {o}
          </option>
        ))}
      </select>
      {error ? <p className="mt-2 text-xs text-primary">{error}</p> : null}
    </div>
  );
}

function Row({ label, value, strike }: { label: string; value: string; strike?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-graphite">{label}</span>
      <span className={strike ? "text-graphite line-through" : "text-foreground"}>{value}</span>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  error?: string | undefined;
}) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow text-graphite">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        maxLength={255}
        aria-invalid={error ? true : undefined}
        className={`mt-3 min-h-[56px] w-full rounded-full border bg-card px-5 py-4 text-base outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-graphite focus:border-primary focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_18%,transparent)] sm:px-6 sm:text-sm ${
          error ? "border-primary" : "border-border"
        }`}
      />
      {error ? <p className="mt-2 text-xs text-primary">{error}</p> : null}
    </div>
  );
}
