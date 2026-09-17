export const BRAND = {
  name: "LAZYTECH",
  tagline: "LEARN LESS. BUILD MORE.",
  promise: "Build something practical every weekend.",
  system: "52 weeks. 52 builds.",
  price: 499,
  regularPrice: 1499,
  email: "tosritrilingatechnologies@gmail.com",
  instagram: "https://instagram.com",
  footnote: "A weekend builder community for people who prefer making to bookmarking.",
};

/** First cohort — intentionally small. */
export const BATCH = {
  label: "BATCH 01",
  name: "Batch 01",
  capacity: 100,
  /** Local start (India) — 11 October 2026, 10:00 IST. */
  startsAt: "2026-10-11T04:30:00.000Z",
  startLabel: "October 11",
  cta: "Join Batch 01",
  positioning: "Batch 01 is limited to 100 builders.",
  supporting:
    "We are keeping the first batch intentionally small so every member gets better sessions, stronger feedback and meaningful connections.",
  includes: [
    "52 weekend builds",
    "Live sessions",
    "Builder community",
    "Project showcase",
    "Industry mentors",
  ],
};

export type Season = "Foundations" | "AI Builder" | "Product Creator" | "Career & Opportunity";

export const seasons: {
  key: Season;
  label: string;
  range: string;
  blurb: string;
  includes: string[];
  from: string;
  to: string;
}[] = [
  {
    key: "Foundations",
    label: "BUILD FOUNDATIONS",
    range: "WEEKS 01–07",
    blurb: "Create your digital base.",
    includes: ["websites", "GitHub", "APIs", "portfolios"],
    from: "I don't know where to start",
    to: "I have my first projects online",
  },
  {
    key: "AI Builder",
    label: "AI BUILDER",
    range: "WEEKS 08–20",
    blurb: "Build with intelligent tools.",
    includes: ["AI apps", "agents", "automation", "AI workflows"],
    from: "I use AI",
    to: "I build with AI",
  },
  {
    key: "Product Creator",
    label: "PRODUCT CREATOR",
    range: "WEEKS 21–36",
    blurb: "Turn ideas into products.",
    includes: ["apps", "SaaS", "MVPs", "user experiences"],
    from: "I have ideas",
    to: "I ship products",
  },
  {
    key: "Career & Opportunity",
    label: "CAREER BUILDER",
    range: "WEEKS 37–52",
    blurb: "Build your professional edge.",
    includes: ["portfolio", "freelancing", "interviews", "personal brand"],
    from: "I need opportunities",
    to: "I have proof of work",
  },
];

export type Build = {
  week: number;
  slug: string;
  title: string;
  season: Season;
  learn: string;
  build: string;
  output: string;
};

const raw: [number, string, Season, string, string, string][] = [
  [
    1,
    "Build Your Personal Website",
    "Foundations",
    "Web app, layout, publishing",
    "Personal portfolio",
    "Live portfolio website",
  ],
  [
    2,
    "Set Up Your Builder Stack",
    "Foundations",
    "Git, repo hygiene, deploy flow",
    "Starter repository",
    "Public Git repository",
  ],
  [
    3,
    "Make a Landing Page That Converts",
    "Foundations",
    "Hierarchy, copy, CTA design",
    "One-page launch site",
    "Responsive landing page",
  ],
  [
    4,
    "Turn a Messy Idea Into a Brief",
    "Foundations",
    "Scope, constraints, success criteria",
    "Build brief",
    "One-page product brief",
  ],
  [
    5,
    "Build With APIs",
    "Foundations",
    "Requests, JSON, error states",
    "API-powered mini tool",
    "Working API interface",
  ],
  [
    6,
    "Make Data Useful",
    "Foundations",
    "Tables, filters, simple charts",
    "Personal dashboard",
    "Shareable data dashboard",
  ],
  [
    7,
    "Design a Better Form",
    "Foundations",
    "Inputs, validation, accessibility",
    "Smart intake form",
    "Usable form flow",
  ],
  [
    8,
    "Build Your First AI Tool",
    "AI Builder",
    "Prompt design, model calls, UX",
    "AI utility",
    "Working AI application",
  ],
  [
    9,
    "Give Your Tool Memory",
    "AI Builder",
    "Context, retrieval, boundaries",
    "Notes-aware assistant",
    "Contextual AI prototype",
  ],
  [
    10,
    "Ship a Browser Copilot",
    "AI Builder",
    "Browser UI, prompts, safety",
    "Task copilot",
    "Browser-based copilot demo",
  ],
  [
    11,
    "Make AI Read Documents",
    "AI Builder",
    "Extraction, citations, structured output",
    "Document helper",
    "Upload-to-answer prototype",
  ],
  [
    12,
    "Build a Tiny Agent",
    "AI Builder",
    "Tool use, loops, guardrails",
    "Single-purpose agent",
    "Agent workflow demo",
  ],
  [
    13,
    "Automate the Boring Part",
    "AI Builder",
    "Triggers, actions, fallbacks",
    "Personal automation",
    "Repeatable workflow",
  ],
  [
    14,
    "Build a Voice Interface",
    "AI Builder",
    "Speech input, response design",
    "Voice command tool",
    "Voice-enabled prototype",
  ],
  [
    15,
    "Make an Image Tool",
    "AI Builder",
    "Image prompts, editing flow, limits",
    "Visual utility",
    "Image workflow demo",
  ],
  [
    16,
    "AI for Your Actual Work",
    "AI Builder",
    "Task mapping, evaluation",
    "Work-specific assistant",
    "Reusable work assistant",
  ],
  [
    17,
    "Research Faster",
    "AI Builder",
    "Search, synthesis, source hygiene",
    "Research companion",
    "Source-backed research page",
  ],
  [
    18,
    "Build a Recommendation Tool",
    "AI Builder",
    "Rules, ranking, feedback",
    "Recommendation engine",
    "Working recommender",
  ],
  [
    19,
    "Create Your AI Safety Checklist",
    "AI Builder",
    "Privacy, failure modes, human review",
    "Safety layer",
    "Guardrail checklist + demo",
  ],
  [
    20,
    "Create AI Automation",
    "AI Builder",
    "Multi-step orchestration",
    "Personal workflow automation",
    "Automated workflow",
  ],
  [
    21,
    "Find a Problem Worth Building",
    "Product Creator",
    "Interviews, signals, pain points",
    "Problem map",
    "Validated problem statement",
  ],
  [
    22,
    "Prototype the Core Flow",
    "Product Creator",
    "User flow, wireframes, testing",
    "Clickable prototype",
    "Tested core flow",
  ],
  [
    23,
    "Make a Tiny Design System",
    "Product Creator",
    "Tokens, components, consistency",
    "UI kit",
    "Mini design system",
  ],
  [
    24,
    "Build a Useful Onboarding",
    "Product Creator",
    "Activation, empty states, guidance",
    "Onboarding flow",
    "First-use experience",
  ],
  [
    25,
    "Make Your MVP Real",
    "Product Creator",
    "Scope, tradeoffs, milestones",
    "MVP skeleton",
    "Working MVP shell",
  ],
  [
    26,
    "Add Auth Without the Drama",
    "Product Creator",
    "Sessions, roles, protected views",
    "Member area",
    "Authenticated prototype",
  ],
  [
    27,
    "Store and Show User Data",
    "Product Creator",
    "Data models, CRUD, states",
    "Personal workspace",
    "Data-backed feature",
  ],
  [
    28,
    "Build Payments Into the Flow",
    "Product Creator",
    "Pricing, checkout, confirmation",
    "Paid feature mock",
    "Checkout-ready flow",
  ],
  [
    29,
    "Instrument Your Product",
    "Product Creator",
    "Events, funnels, useful metrics",
    "Analytics layer",
    "Event-tracked product",
  ],
  [
    30,
    "Make It Fast Enough",
    "Product Creator",
    "Performance, loading, resilience",
    "Optimized build",
    "Performance report",
  ],
  [
    31,
    "Launch a Useful Directory",
    "Product Creator",
    "Taxonomy, search, contribution",
    "Curated directory",
    "Public directory",
  ],
  [
    32,
    "Build a Community Feature",
    "Product Creator",
    "Profiles, reactions, moderation",
    "Community surface",
    "Working community feature",
  ],
  [
    33,
    "Turn Feedback Into a Roadmap",
    "Product Creator",
    "Synthesis, prioritization",
    "Now/next/later plan",
    "Product roadmap",
  ],
  [
    34,
    "Prototype the Business Model",
    "Product Creator",
    "Pricing hypotheses, value exchange",
    "Offer page",
    "Testable offer",
  ],
  [
    35,
    "Build and Launch an MVP",
    "Product Creator",
    "Release checklist, deployment",
    "Deployed product",
    "Public MVP",
  ],
  [
    36,
    "Run Your First Launch Week",
    "Product Creator",
    "Distribution, feedback, iteration",
    "Launch campaign",
    "Launch post + changelog",
  ],
  [
    37,
    "Build a Portfolio Case Study",
    "Career & Opportunity",
    "Narrative, evidence, outcomes",
    "Case study page",
    "Portfolio case study",
  ],
  [
    38,
    "Make Your Work Easy to Share",
    "Career & Opportunity",
    "Social preview, links, demos",
    "Share kit",
    "Public project share page",
  ],
  [
    39,
    "Build a Freelance Offer",
    "Career & Opportunity",
    "Positioning, scope, pricing",
    "Service offer",
    "Client-ready offer page",
  ],
  [
    40,
    "Create a Proposal System",
    "Career & Opportunity",
    "Discovery, estimates, terms",
    "Proposal template",
    "Reusable proposal",
  ],
  [
    41,
    "Build Your Personal CRM",
    "Career & Opportunity",
    "Follow-up, notes, reminders",
    "Relationship tracker",
    "Personal CRM",
  ],
  [
    42,
    "Make a Better Resume",
    "Career & Opportunity",
    "Evidence, clarity, tailoring",
    "Resume system",
    "Role-specific resume",
  ],
  [
    43,
    "Build a Job Search Dashboard",
    "Career & Opportunity",
    "Pipeline, signals, review",
    "Application tracker",
    "Job search dashboard",
  ],
  [
    44,
    "Practice With a Portfolio Demo",
    "Career & Opportunity",
    "Storytelling, demo flow, clarity",
    "Demo script",
    "3-minute product demo",
  ],
  [
    45,
    "Build a Small Audience Loop",
    "Career & Opportunity",
    "Publishing, cadence, feedback",
    "Content system",
    "4-week publishing plan",
  ],
  [
    46,
    "Turn a Build Into a Talk",
    "Career & Opportunity",
    "Teaching, structure, visuals",
    "Lightning talk",
    "Recorded talk outline",
  ],
  [
    47,
    "Make Your First Collaboration",
    "Career & Opportunity",
    "Roles, handoffs, shared scope",
    "Team mini-build",
    "Collaborative project",
  ],
  [
    48,
    "Package Your Skills",
    "Career & Opportunity",
    "Skill proof, positioning",
    "Builder profile",
    "Public builder profile",
  ],
  [
    49,
    "Prepare for Demo Day",
    "Career & Opportunity",
    "Narrative, polish, rehearsal",
    "Demo day build",
    "Presentation-ready build",
  ],
  [
    50,
    "Give and Get Better Feedback",
    "Career & Opportunity",
    "Critique, iteration, generosity",
    "Improvement plan",
    "Before/after changelog",
  ],
  [
    51,
    "Ship the Version You Can Defend",
    "Career & Opportunity",
    "Tradeoffs, reliability, confidence",
    "Final release",
    "Defensible public release",
  ],
  [
    52,
    "LazyTech Demo Day",
    "Career & Opportunity",
    "Reflection, showcasing, next step",
    "Public project showcase",
    "Demo Day project + profile badge",
  ],
];

export const builds: Build[] = raw.map(([week, title, season, learn, build, output]) => ({
  week,
  slug: String(week).padStart(2, "0"),
  title,
  season,
  learn,
  build,
  output,
}));

export const weekLabel = (week: number) => `W${String(week).padStart(2, "0")}`;

export type Phase = {
  id: string;
  index: string;
  title: string;
  quarter: string;
  start: number;
  end: number;
  theme: string;
  from: string;
  to: string;
  outcomes: string[];
  months: { label: string; title: string; start: number; end: number }[];
};

export const phases: Phase[] = [
  {
    id: "foundation",
    index: "01",
    title: "BUILD YOUR FOUNDATION",
    quarter: "Q1",
    start: 1,
    end: 13,
    theme: "From consuming technology to creating with it.",
    from: "I don't know where to start",
    to: "I have projects online",
    outcomes: ["Personal website", "GitHub profile", "First deployed projects", "Digital identity"],
    months: [
      { label: "MONTH 01", title: "Digital Foundation", start: 1, end: 4 },
      { label: "MONTH 02", title: "Working With Data", start: 5, end: 8 },
      { label: "MONTH 03", title: "First AI Builds", start: 9, end: 13 },
    ],
  },
  {
    id: "ai",
    index: "02",
    title: "BUILD WITH AI",
    quarter: "Q2",
    start: 14,
    end: 26,
    theme: "Use AI as a building partner.",
    from: "I use AI",
    to: "I build with AI",
    outcomes: ["AI tools", "Automations", "AI workflows", "Intelligent applications"],
    months: [
      { label: "MONTH 04", title: "AI Interfaces", start: 14, end: 17 },
      { label: "MONTH 05", title: "Automation & Guardrails", start: 18, end: 21 },
      { label: "MONTH 06", title: "Product Thinking", start: 22, end: 26 },
    ],
  },
  {
    id: "products",
    index: "03",
    title: "BUILD PRODUCTS",
    quarter: "Q3",
    start: 27,
    end: 39,
    theme: "Turn ideas into things people can use.",
    from: "I have ideas",
    to: "I ship products",
    outcomes: ["Apps", "MVPs", "SaaS concepts", "Product thinking"],
    months: [
      { label: "MONTH 07", title: "Real Product Surfaces", start: 27, end: 30 },
      { label: "MONTH 08", title: "Launch Mechanics", start: 31, end: 35 },
      { label: "MONTH 09", title: "Shipping In Public", start: 36, end: 39 },
    ],
  },
  {
    id: "future",
    index: "04",
    title: "BUILD YOUR FUTURE",
    quarter: "Q4",
    start: 40,
    end: 52,
    theme: "Turn your skills into opportunities.",
    from: "I need opportunities",
    to: "I have proof of work",
    outcomes: ["Portfolio", "Personal brand", "Career opportunities", "Public showcase"],
    months: [
      { label: "MONTH 10", title: "Proof Of Work", start: 40, end: 43 },
      { label: "MONTH 11", title: "Audience & Range", start: 44, end: 47 },
      { label: "MONTH 12", title: "Demo Day", start: 48, end: 52 },
    ],
  },
];

export const loop = [
  { step: "LEARN", body: "One focused brief from someone doing the work.", meta: "20 MIN" },
  { step: "BUILD", body: "A guided outcome you can finish in a weekend.", meta: "ONE SITTING" },
  { step: "SHARE", body: "Put it on the Build Wall and get useful feedback.", meta: "PUBLIC" },
  { step: "IMPROVE", body: "Return next weekend with a better starting point.", meta: "NEXT WEEK" },
];

export const buildWall = [
  {
    week: 1,
    title: "One-page portfolio",
    category: "FOUNDATIONS",
    outcome: "Live site with three projects and a contact link.",
  },
  {
    week: 5,
    title: "Train delay checker",
    category: "FOUNDATIONS",
    outcome: "Public API call rendered as a readable status card.",
  },
  {
    week: 8,
    title: "Meeting notes cleaner",
    category: "AI BUILDER",
    outcome: "Paste a transcript, get actions and owners.",
  },
  {
    week: 11,
    title: "Invoice reader",
    category: "AI BUILDER",
    outcome: "Upload a PDF, get structured fields you can copy.",
  },
  {
    week: 13,
    title: "Weekly report robot",
    category: "AI BUILDER",
    outcome: "A workflow that writes and files the recap on Fridays.",
  },
  {
    week: 22,
    title: "Habit tracker flow",
    category: "PRODUCT CREATOR",
    outcome: "Clickable prototype tested with five people.",
  },
  {
    week: 31,
    title: "Local makers directory",
    category: "PRODUCT CREATOR",
    outcome: "Searchable list anyone can submit to.",
  },
  {
    week: 37,
    title: "Case study page",
    category: "CAREER",
    outcome: "Problem, decisions and result on one screen.",
  },
  {
    week: 52,
    title: "Demo Day showcase",
    category: "CAREER",
    outcome: "Twelve months of builds on one profile.",
  },
];

export const lazyScore = [
  { label: "ATTEND", value: "+5" },
  { label: "BUILD", value: "+50" },
  { label: "SHARE", value: "+10" },
  { label: "WIN CHALLENGE", value: "+100" },
];

export const speakerRoles = ["FOUNDERS", "ENGINEERS", "DESIGNERS", "CREATORS", "BUILDERS"];

export const audiences = [
  { key: "STUDENTS", line: "Turn curiosity into portfolio proof." },
  { key: "MAKERS", line: "Ship the side project you keep reopening." },
  { key: "CREATORS", line: "Turn ideas into useful tools and formats." },
  { key: "FUTURE FOUNDERS", line: "Test small products before betting big." },
  { key: "CAREER SWITCHERS", line: "Build evidence for the work you want next." },
];

export const membershipIncludes = [
  "52 weekend workshops",
  "Build challenges",
  "Community access",
  "Project showcase",
  "Speaker sessions",
  "Builder profile",
];

export const buildTypes = [
  "AI TOOL",
  "WEBSITE",
  "MOBILE APP",
  "API",
  "AUTOMATION",
  "CHROME EXTENSION",
  "SAAS PRODUCT",
  "CHATBOT",
  "DESIGN SYSTEM",
  "DATA DASHBOARD",
  "PORTFOLIO",
  "LANDING PAGE",
  "NO-CODE APP",
  "AI AGENT",
  "DATABASE PROJECT",
];

/** Concrete things members make — used in cards, timeline and session pages. */
export const buildExamples: { group: string; items: string[] }[] = [
  {
    group: "WEBSITES",
    items: ["Personal Portfolio", "Startup Landing Page", "Documentation Website"],
  },
  { group: "APPS", items: ["Mobile App", "Productivity App", "Community App"] },
  { group: "AI", items: ["AI Assistant", "AI Chatbot", "AI Agent"] },
  {
    group: "AUTOMATION",
    items: ["Workflow Automation", "Email Automation", "Business Automation"],
  },
  { group: "APIS", items: ["API Integration", "Backend Service", "Data Connector"] },
  { group: "PRODUCTS", items: ["SaaS MVP", "Digital Product", "Marketplace"] },
  { group: "DESIGN", items: ["UI System", "App Prototype", "Product Experience"] },
];

export const heroStats = [
  { value: "52", label: "BUILDS" },
  { value: "12", label: "MONTHS" },
  { value: "100+", label: "TOOLS EXPLORED" },
];

export const pillTags = [
  "BUILDS",
  "AI TOOLS",
  "AUTOMATION",
  "PROTOTYPES",
  "APIS",
  "WORKFLOWS",
  "DEMOS",
  "SHIPPING",
  "PROOF",
  "WEEKENDS",
];

export const faqs = [
  {
    q: "Is LazyTech a course?",
    a: "No. It is a weekend builder community. Each week gives you a focused brief and a practical outcome, not a giant syllabus to complete.",
  },
  {
    q: "What happens in a weekend?",
    a: "You get a short session or brief, build along, and leave with something you can share. Builds are scoped for real life.",
  },
  {
    q: "Do I need to be an engineer?",
    a: "No. The roadmap includes websites, workflows, AI tools, product experiments, and career assets. Start at the level that fits you.",
  },
  {
    q: "What if I miss a weekend?",
    a: "Pick up at the next build. The system is designed to keep moving without punishing real life.",
  },
  {
    q: "What do I get with Lazy Pass?",
    a: "A year of workshops, challenges, community access, showcases, speaker sessions, and a Builder Profile.",
  },
  {
    q: "How much is membership?",
    a: "Early-bird Lazy Pass is ₹499 for one year (regular ₹1,499).",
  },
  {
    q: "Are speakers announced?",
    a: "Speakers are announced as sessions are confirmed. No placeholder names are presented as real.",
  },
];
