import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { startCheckout } from "@/lib/checkout";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/build-ai-agents")({
  component: BuildAiAgentsPage,
  head: () => ({
    meta: [
      { title: "Build Your First AI Agent | LazyTech Workshop #01" },
      {
        name: "description",
        content:
          "Build your first AI agent from zero to a working prototype in a hands-on online LazyTech workshop on 27 September 2026. Join for ₹59.",
      },
    ],
  }),
});

function BuildAiAgentsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "loading" | "paid" | "error"
  >("idle");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    role: "",
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStatus("loading");
    
    try {
      const result = await startCheckout({
        ...formData,
        productType: "workshop-01",
      });

      if (result.status === "paid") {
        setPaymentStatus("paid");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (result.status === "error") {
        setPaymentStatus("error");
        toast.error(result.message || "Payment failed. Please try again.");
        setTimeout(() => setPaymentStatus("idle"), 3000);
      } else {
        // dismissed
        setPaymentStatus("idle");
      }
    } catch (error) {
      setPaymentStatus("error");
      toast.error("An unexpected error occurred. Please try again.");
      setTimeout(() => setPaymentStatus("idle"), 3000);
    }
  };

  const scrollToCheckout = () => {
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
  };

  if (paymentStatus === "paid") {
    return (
      <div className="min-h-screen bg-[#080808] text-[#F5F5F0] font-sans selection:bg-[#E5092F] selection:text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">YOU'RE IN.</h1>
          <p className="text-[#A1A1A1] mb-8">
            Your LazyTech Workshop #01 seat is confirmed.
          </p>

          <div className="bg-white/5 border border-white/10 p-6 rounded-lg text-left mb-12">
            <div className="text-sm text-[#E5092F] font-bold mb-2 tracking-widest uppercase">
              Build Your First AI Agent
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#A1A1A1]">Date</span>
                <span>27 September 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1A1A1]">Time</span>
                <span>10:00 AM – 1:00 PM IST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1A1A1]">Location</span>
                <span>Online</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-12">
            <h2 className="text-xl font-bold mb-2">Want to keep building every weekend?</h2>
            <p className="text-[#A1A1A1] text-sm mb-6">
              This workshop is just Week 01. Join Lazy Pass for the full 52-week journey.
            </p>
            
            <div className="bg-[#E5092F]/10 border border-[#E5092F]/20 p-6 rounded-lg flex flex-col items-center">
              <div className="text-2xl font-bold mb-1">Lazy Pass</div>
              <div className="text-lg text-[#E5092F] font-mono mb-4">₹499/year</div>
              <div className="text-sm font-bold tracking-widest mb-6">52 WEEKS. 52 BUILDS.</div>
              <Link
                to="/membership"
                className="bg-[#E5092F] text-white font-bold py-3 px-8 rounded flex items-center gap-2 hover:bg-[#c40828] transition-colors w-full justify-center"
              >
                GET LAZY PASS <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F0] font-sans selection:bg-[#E5092F] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold tracking-widest text-lg">
            LAZYTECH
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm text-[#A1A1A1]">
            <a href="#build" className="hover:text-white transition-colors">What You'll Build</a>
            <a href="#learn" className="hover:text-white transition-colors">What You'll Learn</a>
            <a href="#schedule" className="hover:text-white transition-colors">Schedule</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <button
              onClick={scrollToCheckout}
              className="text-white font-bold hover:text-[#E5092F] transition-colors flex items-center gap-1"
            >
              BOOK FOR ₹59 <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#080808] border-b border-white/10 px-6 py-4 flex flex-col gap-4 text-sm text-[#A1A1A1]">
            <a href="#build" onClick={() => setIsMenuOpen(false)}>What You'll Build</a>
            <a href="#learn" onClick={() => setIsMenuOpen(false)}>What You'll Learn</a>
            <a href="#schedule" onClick={() => setIsMenuOpen(false)}>Schedule</a>
            <a href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</a>
          </div>
        )}
      </nav>

      <main className="pt-24 pb-32 md:pb-24">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            <div>
              <div className="text-xs font-mono text-[#A1A1A1] tracking-widest mb-4">
                LAZYTECH · WORKSHOP #01
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
                BUILD YOUR<br />
                FIRST<br />
                <span className="text-[#E5092F]">AI AGENT</span>
              </h1>
              <div className="text-lg md:text-xl font-medium tracking-wide mt-4 text-[#A1A1A1]">
                FROM ZERO TO WORKING PROTOTYPE
              </div>
            </div>

            <p className="text-lg text-[#A1A1A1] max-w-md leading-relaxed">
              A hands-on, beginner-friendly workshop where you'll learn how AI agents work and build a working prototype from scratch.
            </p>

            <div className="font-mono text-sm space-y-1 border-l-2 border-[#E5092F] pl-4 py-1">
              <div>SUNDAY, 27 SEPTEMBER 2026</div>
              <div>10:00 AM — 1:00 PM IST</div>
              <div>ONLINE</div>
            </div>

            <div>
              <button
                onClick={scrollToCheckout}
                className="group bg-white text-black font-bold py-4 px-8 flex items-center gap-3 hover:bg-[#E5092F] hover:text-white transition-all duration-300"
              >
                BOOK YOUR SEAT — ₹59
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="text-xs text-[#A1A1A1] mt-3 font-medium">
                No prior AI experience required.
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative aspect-square md:aspect-[4/5] bg-[#111] border border-white/10 overflow-hidden group flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#E5092F] rounded-full blur-[120px] opacity-20"></div>
            
            <div className="relative z-10 w-full max-w-sm border border-white/20 bg-black/50 backdrop-blur shadow-2xl p-6 font-mono text-xs text-[#A1A1A1] flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-white font-bold">AGENT_RUNTIME</span>
                <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> ONLINE</span>
              </div>
              <div className="space-y-2 opacity-80">
                <div>&gt; Initializing environment...</div>
                <div>&gt; Loading LLM context...</div>
                <div className="text-white">&gt; Receiving user prompt</div>
                <div className="pl-4 border-l border-white/20 text-[#E5092F]">"Analyze dataset and generate summary report"</div>
                <div>&gt; Planning execution steps...</div>
                <div className="flex items-center gap-2">&gt; Executing tool: [search_data] <span className="animate-spin text-white">◓</span></div>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 bg-white text-black text-[10px] font-bold px-2 py-1 tracking-widest">
              YOUR FIRST AI AGENT
            </div>
            <div className="absolute top-6 right-6 border border-white/20 bg-black/50 backdrop-blur text-white text-[10px] font-bold px-2 py-1 tracking-widest">
              BUILD · TEST · USE
            </div>
          </div>
        </section>

        {/* THE PROBLEM */}
        <section className="py-24 border-y border-white/10 bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              YOU'VE LEARNED ABOUT AI.<br />
              <span className="text-[#A1A1A1]">BUT HAVE YOU BUILT WITH IT?</span>
            </h2>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm font-mono text-[#A1A1A1]">
              <span className="border border-white/10 px-4 py-2 rounded-full">Tutorials saved.</span>
              <span className="border border-white/10 px-4 py-2 rounded-full">Videos watched.</span>
              <span className="border border-white/10 px-4 py-2 rounded-full">Tools bookmarked.</span>
              <span className="border border-white/10 px-4 py-2 rounded-full">Ideas written down.</span>
            </div>

            <div className="pt-8">
              <div className="text-sm text-[#A1A1A1] uppercase tracking-widest mb-2">But when it's time to build:</div>
              <div className="text-2xl md:text-4xl font-medium">"WHERE DO I START?"</div>
            </div>

            <div className="flex items-center justify-center gap-4 text-[#E5092F] font-bold tracking-widest pt-8">
              <span>LEARN</span>
              <ArrowRight className="w-5 h-5" />
              <span className="text-white">BUILD</span>
            </div>
          </div>
        </section>

        {/* THE SOLUTION */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              STOP WATCHING.<br />
              START BUILDING.
            </h2>
            <p className="text-xl text-[#A1A1A1] max-w-2xl">
              This workshop takes you from understanding AI agents to building and testing your own working prototype.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: "01", title: "UNDERSTAND", desc: "What AI agents actually are." },
              { num: "02", title: "BUILD", desc: "Create your first agent step by step." },
              { num: "03", title: "CONNECT", desc: "Work with tools, APIs and real inputs." },
              { num: "04", title: "TEST", desc: "Run your agent and understand how to improve it." },
            ].map((step, i) => (
              <div key={i} className="border border-white/10 p-8 hover:bg-white/5 transition-colors group">
                <div className="text-[#E5092F] font-mono text-sm mb-4">{step.num}</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{step.title}</h3>
                <p className="text-[#A1A1A1] text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WHAT YOU'LL BUILD */}
        <section id="build" className="py-24 border-y border-white/10 bg-[#111]">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center">
              BY THE END OF 3 HOURS,<br />
              <span className="text-[#A1A1A1]">YOU'LL HAVE BUILT SOMETHING REAL.</span>
            </h2>

            <div className="max-w-4xl mx-auto border border-white/10 bg-[#080808] shadow-2xl overflow-hidden rounded-xl">
              <div className="border-b border-white/10 bg-white/5 px-4 py-3 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
              </div>
              <div className="p-8 md:p-12">
                <div className="flex flex-col items-center space-y-6 text-sm md:text-base font-mono">
                  
                  <div className="w-full max-w-md bg-white/5 border border-white/10 p-4 flex gap-4 items-start rounded text-[#A1A1A1]">
                    <div className="shrink-0 bg-white/10 w-8 h-8 flex items-center justify-center rounded">U</div>
                    <div>Analyze the latest tech news and summarize the top 3 trends in bullet points.</div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-[#E5092F] rotate-90" />
                  
                  <div className="w-full max-w-md border border-[#E5092F]/50 p-4 space-y-3 rounded bg-[#E5092F]/5 text-[#A1A1A1]">
                    <div className="flex items-center gap-2 text-white font-bold">
                      <Sparkles className="w-4 h-4 text-[#E5092F]" /> AI AGENT
                    </div>
                    <div className="pl-6 border-l border-white/10 space-y-2 text-xs">
                      <div>&gt; Thinking... Needs recent news data.</div>
                      <div className="text-white">&gt; Calling tool: web_search("latest tech news")</div>
                      <div>&gt; Processing 15 articles...</div>
                      <div>&gt; Synthesizing trends...</div>
                    </div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-[#E5092F] rotate-90" />

                  <div className="w-full max-w-md bg-white/5 border border-white/10 p-4 flex gap-4 items-start rounded">
                    <div className="shrink-0 bg-[#E5092F] text-white w-8 h-8 flex items-center justify-center rounded">A</div>
                    <div className="space-y-2">
                      <div>Here are the top 3 tech trends:</div>
                      <ul className="list-disc pl-4 space-y-1 text-[#A1A1A1]">
                        <li>Rise of autonomous AI agents in enterprise.</li>
                        <li>Breakthroughs in edge-device model inference.</li>
                        <li>New regulations shaping data privacy.</li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT YOU'LL LEARN & EXPERIENCE */}
        <section id="learn" className="py-24 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-[#E5092F] mb-8">WHAT YOU'LL LEARN</h2>
            <ul className="space-y-6">
              {[
                "Understand what AI agents are",
                "How agents differ from ordinary chatbots",
                "Build an AI agent step by step",
                "Connect tools and APIs",
                "Give your agent useful capabilities",
                "Test and improve your agent",
                "Understand real-world AI agent use cases",
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <Check className="w-5 h-5 text-[#E5092F] shrink-0 mt-0.5" />
                  <span className="text-lg text-[#A1A1A1]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-8">NOT ANOTHER<br />3-HOUR LECTURE.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "HANDS-ON", desc: "Follow along and build." },
                { title: "BEGINNER FRIENDLY", desc: "No advanced AI background required." },
                { title: "REAL PROJECT", desc: "Leave with a working prototype." },
                { title: "LIVE GUIDANCE", desc: "Ask questions while you build." },
              ].map((card, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6">
                  <div className="font-bold mb-2">{card.title}</div>
                  <div className="text-sm text-[#A1A1A1]">{card.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO IS THIS FOR? */}
        <section className="py-24 border-y border-white/10 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">WHO SHOULD JOIN?</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { title: "STUDENTS", desc: "Want to move beyond tutorials and build real projects." },
                { title: "DEVELOPERS", desc: "Want to understand how AI agents actually work." },
                { title: "FOUNDERS & CREATORS", desc: "Want to explore what agents can automate." },
                { title: "CURIOUS BUILDERS", desc: "Want to build something with AI without spending weeks figuring out where to start." },
              ].map((persona, i) => (
                <div key={i} className="text-center">
                  <div className="text-[#E5092F] font-bold tracking-widest mb-4">{persona.title}</div>
                  <div className="text-sm text-[#A1A1A1]">{persona.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3-HOUR JOURNEY */}
        <section id="schedule" className="py-24 max-w-3xl mx-auto px-6">
          <h2 className="text-sm font-bold tracking-widest text-[#E5092F] mb-12 text-center">3-HOUR JOURNEY</h2>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
            {[
              { time: "10:00", title: "WELCOME + AI AGENTS" },
              { time: "10:30", title: "UNDERSTAND THE BUILD" },
              { time: "11:00", title: "BUILD YOUR AGENT" },
              { time: "12:00", title: "CONNECT TOOLS" },
              { time: "12:30", title: "TEST + IMPROVE" },
              { time: "1:00", title: "SHIP YOUR PROTOTYPE" },
            ].map((step, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-[#080808] text-[#A1A1A1] group-hover:border-[#E5092F] group-hover:text-[#E5092F] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow transition-colors z-10">
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 border border-white/10 bg-white/5 rounded">
                  <div className="font-mono text-xs text-[#E5092F] mb-1">{step.time}</div>
                  <div className="font-bold">{step.title}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* THE 52-WEEK IDEA */}
        <section className="py-24 border-y border-white/10 bg-[#111] text-center">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-sm font-bold tracking-widest text-[#A1A1A1] mb-6">THIS IS JUST WEEK ONE.</div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
              52 WEEKS.<br />
              <span className="text-[#E5092F]">52 BUILDS.</span>
            </h2>
            <p className="text-xl text-[#A1A1A1] max-w-2xl mx-auto mb-16">
              LazyTech is built around one simple habit:<br />
              <span className="text-white">Every weekend, learn something practical and build something real.</span>
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 font-mono text-xs md:text-sm text-[#A1A1A1]">
              <div className="px-4 py-2 bg-white text-black font-bold">01 AI AGENT</div>
              <div className="px-4 py-2 border border-white/20">02 WEBSITE</div>
              <div className="px-4 py-2 border border-white/20">03 API</div>
              <div className="px-4 py-2 border border-white/20">04 AUTOMATION</div>
              <div className="px-4 py-2 border border-white/20">05 APP</div>
              <div className="px-4 py-2 text-white/50 border-none">... 52 MORE BUILDS</div>
            </div>
          </div>
        </section>

        {/* PRICE / CHECKOUT */}
        <section id="checkout" className="py-24 max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              START BUILDING FOR ₹59.
            </h2>
            
            <div className="space-y-6 text-[#A1A1A1] mb-12">
              <div className="flex gap-4 items-center">
                <Check className="w-5 h-5 text-[#E5092F]" /> Live workshop
              </div>
              <div className="flex gap-4 items-center">
                <Check className="w-5 h-5 text-[#E5092F]" /> Hands-on build
              </div>
              <div className="flex gap-4 items-center">
                <Check className="w-5 h-5 text-[#E5092F]" /> Workshop resources
              </div>
              <div className="flex gap-4 items-center">
                <Check className="w-5 h-5 text-[#E5092F]" /> Working prototype
              </div>
              <div className="flex gap-4 items-center">
                <Check className="w-5 h-5 text-[#E5092F]" /> Community access
              </div>
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-white/10 p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-[#E5092F] font-bold tracking-widest text-sm mb-1">ONE-TIME WORKSHOP PASS</div>
                <div className="text-[#A1A1A1] text-xs font-mono">27 SEP 2026 · 10AM ONLINE</div>
              </div>
              <div className="text-4xl font-bold">₹59</div>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#A1A1A1] mb-1 uppercase tracking-widest">Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#E5092F] transition-colors"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#A1A1A1] mb-1 uppercase tracking-widest">Email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#E5092F] transition-colors"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#A1A1A1] mb-1 uppercase tracking-widest">Phone Number</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#E5092F] transition-colors"
                  placeholder="+91"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#A1A1A1] mb-1 uppercase tracking-widest">College / Org</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#A1A1A1] mb-1 uppercase tracking-widest">Role / Student</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={paymentStatus === "loading"}
                className="w-full bg-[#E5092F] text-white font-bold py-4 mt-6 flex items-center justify-center gap-2 hover:bg-[#c40828] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentStatus === "loading" ? (
                  <span className="animate-pulse">PROCESSING...</span>
                ) : (
                  <>BOOK YOUR SEAT — ₹59 <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
              <div className="text-center text-xs text-[#A1A1A1] mt-4 flex items-center justify-center gap-2">
                Secure payment via Razorpay
              </div>
            </form>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 max-w-3xl mx-auto px-6 border-t border-white/10">
          <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">FAQ</h2>
          <Accordion type="single" collapsible className="w-full space-y-4 text-left">
            {[
              { q: "Is this beginner friendly?", a: "Yes. The workshop is designed for people who have never built an AI agent before. We will explain everything step by step." },
              { q: "Do I need coding experience?", a: "Basic understanding of how web apps work is helpful, but you don't need advanced coding experience to follow along and build the prototype." },
              { q: "Is the workshop online?", a: "Yes, 100% online. You can join from anywhere." },
              { q: "What do I need before joining?", a: "A computer, an internet connection, and a willingness to build." },
              { q: "How long is the workshop?", a: "3 hours. From 10:00 AM to 1:00 PM IST." },
              { q: "What will I build?", a: "You will build a working AI agent prototype that can take user inputs, think, call tools (like web search), and return a useful result." },
              { q: "Will I receive workshop resources?", a: "Yes, all attendees receive the build guides and resources used during the workshop." },
              { q: "How do I receive the joining link?", a: "After registration, you will receive a confirmation email. The joining link will be sent closer to the workshop date." },
              { q: "What happens after payment?", a: "Your seat is confirmed immediately and you'll see a success screen with your registration details." },
              { q: "Is ₹59 refundable?", a: "As this is a low-cost, live event with limited digital capacity, the ₹59 workshop pass is non-refundable." },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-white/10 bg-white/5 px-6">
                <AccordionTrigger className="text-left font-bold hover:no-underline hover:text-white py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#A1A1A1] pb-6 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 border-t border-white/10 text-center bg-[#E5092F]/5">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
              READY TO BUILD YOUR<br />FIRST AI AGENT?
            </h2>
            <div className="font-mono text-sm space-y-2 mb-12 text-[#A1A1A1]">
              <div className="text-white">27 SEPTEMBER 2026</div>
              <div>10:00 AM — 1:00 PM IST</div>
              <div>ONLINE</div>
              <div className="text-2xl font-bold text-white pt-4">₹59</div>
            </div>
            
            <button
              onClick={scrollToCheckout}
              className="bg-white text-black font-bold py-4 px-12 inline-flex items-center gap-3 hover:bg-[#E5092F] hover:text-white transition-all duration-300"
            >
              BOOK YOUR SEAT <ArrowRight className="w-5 h-5" />
            </button>
            <div className="text-sm text-[#A1A1A1] mt-6">
              Your first build starts here.
            </div>

            <div className="mt-24 pt-12 border-t border-white/10">
              <div className="font-bold tracking-widest text-lg mb-2">LAZYTECH</div>
              <div className="text-[#A1A1A1] text-sm">Learn Less. Build More.</div>
              <div className="text-[#A1A1A1] text-xs mt-4">A GreatSkills Initiative.</div>
            </div>
          </div>
        </section>
      </main>

      {/* STICKY MOBILE CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#080808]/90 backdrop-blur border-t border-white/10 z-40">
        <button
          onClick={scrollToCheckout}
          className="w-full bg-[#E5092F] text-white font-bold py-3 flex items-center justify-center gap-2 rounded hover:bg-[#c40828] transition-colors"
        >
          ₹59 · BOOK YOUR SEAT <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* PERSISTENT DESKTOP CTA */}
      <div className="hidden md:block fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
        <button
          onClick={scrollToCheckout}
          className="bg-[#E5092F] text-white font-bold py-4 px-8 rounded shadow-2xl flex items-center justify-center gap-3 hover:bg-[#c40828] hover:-translate-y-1 transition-all"
        >
          BOOK YOUR SEAT — ₹59 <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
