import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { startCheckout, type CheckoutCustomer } from "@/lib/checkout";
import { toast } from "sonner";
import { ArrowRight, Calendar, Clock, Globe, ArrowUpRight, CheckCircle2, MonitorPlay, MessageCircle } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import { motion } from "framer-motion";

export const Route = createFileRoute("/build-ai-agents")({
  component: BuildAiAgentsEvent,
});

function BuildAiAgentsEvent() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    role: "",
  });

  const isValid = 
    customer.name.trim().length > 1 && 
    customer.email.includes("@") && 
    customer.phone.trim().length > 5;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    const result = await startCheckout({
      ...customer,
      productType: "workshop-01",
    });

    if (result.status === "paid") {
      setSuccess(true);
      toast.success("Registration confirmed!");
    } else if (result.status === "error") {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const generateICS = () => {
    const event = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//LazyTech//Workshop//EN",
      "BEGIN:VEVENT",
      "UID:lazytech-workshop-01@greatskills.co.in",
      "DTSTAMP:20260919T000000Z",
      "DTSTART:20260927T043000Z", // 10:00 AM IST (UTC+5:30)
      "DTEND:20260927T073000Z",   // 1:00 PM IST (UTC+5:30)
      "SUMMARY:LazyTech Workshop #01: Build Your First AI Agent",
      "DESCRIPTION:From zero to working prototype. Join via the link sent to your email.",
      "LOCATION:Online",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([event], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "LazyTech_Workshop_01.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#080808] font-sans selection:bg-[#E5092F] selection:text-white pb-24 lg:pb-0">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#F5F5F0]/80 backdrop-blur-md border-b border-[#080808]/5">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="font-bold text-xl tracking-tighter">
              LAZYTECH
            </a>
            <span className="hidden md:inline-block text-[10px] font-mono tracking-widest text-[#080808]/50 uppercase mt-1 border-l border-[#080808]/10 pl-3">
              A GreatSkills Initiative
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#080808]/60">
            <a href="#about" className="hover:text-[#080808] transition-colors">About</a>
            <a href="#schedule" className="hover:text-[#080808] transition-colors">Schedule</a>
            <a href="#build" className="hover:text-[#080808] transition-colors">What You'll Build</a>
            <a href="#faq" className="hover:text-[#080808] transition-colors">FAQ</a>
            {success ? (
              <button disabled className="inline-flex items-center justify-center rounded-md bg-[#25D366] px-4 py-2 text-sm font-bold text-white">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Registered
              </button>
            ) : (
              <a 
                href="#register" 
                className="inline-flex items-center justify-center rounded-md bg-[#080808] px-4 py-2 text-sm font-medium text-[#F5F5F0] transition-colors hover:bg-[#080808]/90"
              >
                Register Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            )}
          </nav>
          
          <div className="md:hidden">
            {success ? (
              <button disabled className="inline-flex items-center justify-center rounded-md bg-[#25D366] px-4 py-1.5 text-xs font-bold text-white">
                <CheckCircle2 className="mr-1.5 h-3 w-3" />
                Registered
              </button>
            ) : (
              <a 
                href="#register" 
                className="inline-flex items-center justify-center rounded-md bg-[#080808] px-4 py-1.5 text-xs font-medium text-[#F5F5F0]"
              >
                Register Now
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 pt-12 lg:pt-20 pb-20">
        
        {/* HERO EVENT SECTION */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* LEFT: POSTER */}
          <div className="w-full lg:w-[55%] shrink-0">
            <div className="relative rounded-[16px] overflow-hidden border border-[#080808]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group transform transition-transform duration-500 hover:scale-[1.01]">
              <img 
                src="https://www.image2url.com/r2/default/images/1789759225795-5af46ccc-31c5-4e88-aad6-6fd899c4ce30.png" 
                alt="Build Your First AI Agent - LazyTech Workshop #01"
                className="w-full h-auto object-cover aspect-square bg-gray-100"
              />
            </div>
          </div>

          {/* RIGHT: DETAILS & REGISTRATION */}
          <div className="w-full lg:w-[45%] flex flex-col justify-center">
            
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center rounded-full border border-[#080808]/10 bg-white px-2.5 py-0.5 text-xs font-mono font-medium text-[#080808]/70 mb-4">
                  LAZYTECH · WORKSHOP #01
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                  BUILD YOUR FIRST <br className="hidden md:block" />
                  <span className="text-[#E5092F]">AI AGENT</span>
                </h1>
                <p className="mt-4 text-lg md:text-xl font-medium text-[#080808]/60 tracking-tight">
                  FROM ZERO TO WORKING PROTOTYPE
                </p>
                <p className="mt-4 text-[#080808]/70 max-w-md leading-relaxed">
                  A hands-on online workshop where you'll understand how AI agents work and build a working prototype from scratch.
                </p>
              </div>

              <div className="h-px w-full bg-[#080808]/10" />

              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm font-medium">
                <div className="flex items-center gap-2 text-[#080808]/80">
                  <Calendar className="h-4 w-4 text-[#080808]/40" />
                  Sun, 27 Sept 2026
                </div>
                <div className="flex items-center gap-2 text-[#080808]/80">
                  <Clock className="h-4 w-4 text-[#080808]/40" />
                  10:00 AM – 1:00 PM IST
                </div>
                <div className="flex items-center gap-2 text-[#080808]/80">
                  <Globe className="h-4 w-4 text-[#080808]/40" />
                  Online
                </div>
                <div className="flex items-center gap-2 text-[#080808]/80">
                  <MonitorPlay className="h-4 w-4 text-[#080808]/40" />
                  Recording Provided
                </div>
              </div>

              <div className="pt-2" id="register">
                
                {/* REGISTRATION CARD */}
                {success ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="bg-white border border-[#080808]/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
                  >
                    {/* Background glow effect */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/50 to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
                        >
                          <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </motion.div>
                      </motion.div>
                      
                      <h2 className="text-3xl font-bold tracking-tight mb-3">Registration Confirmed!</h2>
                      <p className="text-[#080808]/70 mb-8 font-medium max-w-sm">
                        You're officially on the roster for Workshop #01. We've sent a welcome email with all details to <span className="text-[#080808] font-bold">{customer.email}</span>.
                      </p>
                      
                      <div className="w-full space-y-3">
                        <a
                          href="https://chat.whatsapp.com/FpAoGu3KCw8662LtHqPrZ0?s=cl&p=a&mlu=4"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl py-4 font-bold transition-all hover:bg-[#25D366]/90 shadow-lg shadow-[#25D366]/20"
                        >
                          <MessageCircle className="h-5 w-5" />
                          Join the WhatsApp Group
                        </a>
                        
                        <button
                          onClick={generateICS}
                          className="w-full flex items-center justify-center gap-2 bg-[#F5F5F0] text-[#080808] border border-[#080808]/10 rounded-xl py-4 font-bold transition-colors hover:bg-[#080808]/5"
                        >
                          <Calendar className="h-5 w-5" />
                          Add to Calendar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-white border border-[#080808]/10 rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                    <div className="flex items-baseline justify-between mb-6">
                      <h2 className="text-xl font-bold tracking-tight">Register</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-[#080808]/40 line-through">₹999</span>
                        <div className="text-2xl font-bold text-[#E5092F]">₹1</div>
                      </div>
                    </div>
                    
                    <form id="register-form" onSubmit={handleCheckout} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#080808]/60 uppercase tracking-wider mb-1.5">Full Name</label>
                          <input
                            type="text"
                            required
                            value={customer.name}
                            onChange={e => setCustomer({...customer, name: e.target.value})}
                            className="w-full rounded-lg border border-[#080808]/15 bg-[#F5F5F0]/50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#080808]/40 focus:bg-white"
                            placeholder="Alex Walker"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#080808]/60 uppercase tracking-wider mb-1.5">Phone</label>
                          <input
                            type="tel"
                            required
                            value={customer.phone}
                            onChange={e => setCustomer({...customer, phone: e.target.value})}
                            className="w-full rounded-lg border border-[#080808]/15 bg-[#F5F5F0]/50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#080808]/40 focus:bg-white"
                            placeholder="+91 9876543210"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold text-[#080808]/60 uppercase tracking-wider mb-1.5">Email Address</label>
                        <input
                          type="email"
                          required
                          value={customer.email}
                          onChange={e => setCustomer({...customer, email: e.target.value})}
                          className="w-full rounded-lg border border-[#080808]/15 bg-[#F5F5F0]/50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#080808]/40 focus:bg-white"
                          placeholder="alex@example.com"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#080808]/60 uppercase tracking-wider mb-1.5">College / Org</label>
                          <input
                            type="text"
                            value={customer.college}
                            onChange={e => setCustomer({...customer, college: e.target.value})}
                            className="w-full rounded-lg border border-[#080808]/15 bg-[#F5F5F0]/50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#080808]/40 focus:bg-white"
                            placeholder="Optional"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#080808]/60 uppercase tracking-wider mb-1.5">Role</label>
                          <input
                            type="text"
                            value={customer.role}
                            onChange={e => setCustomer({...customer, role: e.target.value})}
                            className="w-full rounded-lg border border-[#080808]/15 bg-[#F5F5F0]/50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#080808]/40 focus:bg-white"
                            placeholder="Student / Dev"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!isValid || loading}
                        className="group w-full mt-2 flex items-center justify-center gap-2 bg-[#E5092F] text-white rounded-xl py-3.5 font-medium transition-all hover:bg-[#E5092F]/90 disabled:opacity-50 disabled:hover:bg-[#E5092F]"
                      >
                        {loading ? "Processing..." : (
                          <>
                            BOOK YOUR SEAT
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                      <p className="text-center text-[11px] font-medium text-[#080808]/40 mt-3">
                        Secure checkout via Razorpay. One-time payment.
                      </p>
                    </form>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>

        {/* SECTION: WHAT IS THIS */}
        <div id="about" className="mt-24 lg:mt-32 max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-6">
            YOU DON'T NEED ANOTHER TUTORIAL.<br />
            YOU NEED TO BUILD.
          </h2>
          <div className="space-y-4 text-[#080808]/70 text-lg leading-relaxed">
            <p>
              AI is everywhere. But understanding what AI agents are is very different from actually building one.
            </p>
            <p>
              This workshop is designed around learning by doing. You'll understand the fundamentals, build an agent step by step, connect useful tools, test it and leave with a working prototype.
            </p>
          </div>
        </div>

        {/* SECTION: WHAT YOU'LL BUILD */}
        <div id="build" className="mt-24 lg:mt-32">
          <h2 className="text-2xl font-bold tracking-tight mb-10">WHAT YOU'LL BUILD</h2>
          
          <div className="bg-white border border-[#080808]/10 rounded-2xl p-8 lg:p-12">
            <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-4 max-w-5xl mx-auto">
              
              <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-[#080808]/5 flex items-center justify-center text-xl font-bold shrink-0">1</div>
                <div>
                  <div className="font-bold text-lg tracking-tight mb-2">YOUR IDEA</div>
                  <p className="text-[#080808]/60 text-sm leading-relaxed">Bring a real problem. We'll define the scope, write the prompt, and design the logical flow of your first automation.</p>
                </div>
              </div>
              
              <div className="hidden md:flex flex-col justify-center h-16 shrink-0">
                <ArrowRight className="h-5 w-5 text-[#080808]/20" />
              </div>
              <div className="md:hidden w-full flex justify-center">
                <div className="h-8 w-px bg-[#080808]/20" />
              </div>
              
              <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-[#E5092F]/10 text-[#E5092F] flex items-center justify-center text-xl font-bold shrink-0">2</div>
                <div>
                  <div className="font-bold text-lg tracking-tight text-[#E5092F] mb-2">AI AGENT</div>
                  <p className="text-[#080808]/60 text-sm leading-relaxed">Build the core "brain". Give it persona, constraints, and instructions so it acts exactly as you want it to.</p>
                </div>
              </div>
              
              <div className="hidden md:flex flex-col justify-center h-16 shrink-0">
                <ArrowRight className="h-5 w-5 text-[#080808]/20" />
              </div>
              <div className="md:hidden w-full flex justify-center">
                <div className="h-8 w-px bg-[#080808]/20" />
              </div>
              
              <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-[#080808]/5 flex items-center justify-center text-xl font-bold shrink-0">3</div>
                <div>
                  <div className="font-bold text-lg tracking-tight mb-2">TOOLS</div>
                  <p className="text-[#080808]/60 text-sm leading-relaxed">Connect external capabilities. APIs, web scraping, email sending—give your agent the hands it needs.</p>
                </div>
              </div>
              
              <div className="hidden md:flex flex-col justify-center h-16 shrink-0">
                <ArrowRight className="h-5 w-5 text-[#080808]/20" />
              </div>
              <div className="md:hidden w-full flex justify-center">
                <div className="h-8 w-px bg-[#080808]/20" />
              </div>

              <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-[#080808]/5 flex items-center justify-center text-xl font-bold shrink-0">4</div>
                <div>
                  <div className="font-bold text-lg tracking-tight mb-2">ACTION</div>
                  <p className="text-[#080808]/60 text-sm leading-relaxed">Test the execution. Watch the agent think, pick the right tool, and execute the task autonomously.</p>
                </div>
              </div>
              
              <div className="hidden md:flex flex-col justify-center h-16 shrink-0">
                <ArrowRight className="h-5 w-5 text-[#080808]/20" />
              </div>
              <div className="md:hidden w-full flex justify-center">
                <div className="h-8 w-px bg-[#080808]/20" />
              </div>

              <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-[#080808] text-white flex items-center justify-center text-xl font-bold shrink-0">5</div>
                <div>
                  <div className="font-bold text-lg tracking-tight mb-2">RESULT</div>
                  <p className="text-[#080808]/60 text-sm leading-relaxed">A fully working prototype ready to be integrated into your actual workflow or app.</p>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* SECTION: WHAT YOU'LL LEARN */}
        <div className="mt-24 lg:mt-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {[
              { num: "01", text: "WHAT AI AGENTS ARE" },
              { num: "02", text: "HOW AGENTS WORK" },
              { num: "03", text: "BUILD AN AGENT" },
              { num: "04", text: "CONNECT TOOLS" },
              { num: "05", text: "WORK WITH APIS" },
              { num: "06", text: "TEST & IMPROVE" },
              { num: "07", text: "REAL-WORLD USE CASES" },
              { num: "08", text: "NEXT STEPS" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-4 border-b border-[#080808]/10 last:border-0 md:last:border-b">
                <span className="font-mono text-[#080808]/30 font-medium">{item.num}</span>
                <span className="font-semibold tracking-tight">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: WORKSHOP FORMAT */}
        <div id="schedule" className="mt-24 lg:mt-32">
          <h2 className="text-3xl font-bold tracking-tight mb-2">3 HOURS.</h2>
          <h2 className="text-3xl font-bold tracking-tight mb-12">ONE REAL BUILD.</h2>

          {/* Desktop Timeline */}
          <div className="hidden md:flex relative pt-8 pb-4">
            <div className="absolute top-[42px] left-0 right-0 h-px bg-[#080808]/10" />
            <div className="grid grid-cols-6 w-full relative z-10">
              {[
                { time: "10:00", text: "Welcome + Intro" },
                { time: "10:30", text: "Architecture" },
                { time: "11:00", text: "Build Agent" },
                { time: "12:00", text: "Connect APIs" },
                { time: "12:30", text: "Test + Improve" },
                { time: "1:00", text: "Working Prototype" }
              ].map((slot, i) => (
                <div key={i} className="flex flex-col gap-4 pr-4">
                  <div className="font-mono text-sm font-medium text-[#E5092F]">{slot.time}</div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#080808]" />
                  <div className="text-sm font-semibold tracking-tight leading-tight">{slot.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden space-y-6 relative border-l border-[#080808]/10 ml-2 pl-6">
            {[
              { time: "10:00", text: "Welcome + Intro" },
              { time: "10:30", text: "Architecture" },
              { time: "11:00", text: "Build Agent" },
              { time: "12:00", text: "Connect APIs" },
              { time: "12:30", text: "Test + Improve" },
              { time: "1:00", text: "Working Prototype" }
            ].map((slot, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[29px] top-1 w-2 h-2 rounded-full bg-[#080808]" />
                <div className="font-mono text-sm font-medium text-[#E5092F] mb-1">{slot.time}</div>
                <div className="font-semibold tracking-tight">{slot.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: WHO IS THIS FOR / WHAT YOU NEED */}
        <div className="mt-24 lg:mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-8">WHO IS THIS FOR?</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-1">STUDENTS</h3>
                <p className="text-[#080808]/60 text-sm">Want to move beyond tutorials.</p>
              </div>
              <div>
                <h3 className="font-bold mb-1">DEVELOPERS</h3>
                <p className="text-[#080808]/60 text-sm">Want to understand agent-based applications.</p>
              </div>
              <div>
                <h3 className="font-bold mb-1">FOUNDERS & CREATORS</h3>
                <p className="text-[#080808]/60 text-sm">Want to explore practical AI automation.</p>
              </div>
              <div>
                <h3 className="font-bold mb-1">CURIOUS BUILDERS</h3>
                <p className="text-[#080808]/60 text-sm">Want to start building with AI.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-8">COME READY TO BUILD.</h2>
            <div className="space-y-4 font-medium mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Laptop
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Stable internet
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Basic computer familiarity
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Curiosity
              </div>
            </div>
            <div className="inline-block bg-[#080808]/5 px-4 py-2 rounded-lg text-sm font-semibold tracking-tight">
              NO ADVANCED AI EXPERIENCE REQUIRED.
            </div>
          </div>

        </div>

        {/* SECTION: WHY LAZYTECH */}
        <div className="mt-24 lg:mt-32 border-t border-[#080808]/10 pt-20">
          <h2 className="text-sm font-bold tracking-widest uppercase text-[#080808]/50 mb-4">
            THIS IS ONLY WEEK ONE.
          </h2>
          <h3 className="text-4xl lg:text-5xl font-bold tracking-tight mb-8">
            52 WEEKS.<br/>52 BUILDS.
          </h3>
          <p className="text-xl text-[#080808]/70 max-w-2xl leading-relaxed mb-8">
            LazyTech is a weekend builder community.<br/>
            Every weekend: one practical workshop. one real build.
          </p>
          <p className="text-[#080808]/50 font-medium">
            This AI Agent workshop is Workshop #01.
          </p>
        </div>

        {/* SECTION: LAZY PASS UPSELL */}
        <div className="mt-16 bg-[#080808] text-white rounded-[24px] p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h2 className="text-sm font-mono text-[#E5092F] mb-4">WANT TO KEEP BUILDING?</h2>
            <h3 className="text-4xl font-bold tracking-tight mb-6">LAZY PASS</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-white/70 mb-8">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#E5092F]" /> 52 weekend workshops</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#E5092F]" /> Build challenges</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#E5092F]" /> Community access</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#E5092F]" /> Project showcases</div>
            </div>
            <div className="text-2xl font-bold">₹499 <span className="text-white/50 text-base font-normal">/ year</span></div>
          </div>
          <a
            href="/join"
            className="shrink-0 group flex items-center justify-center gap-2 bg-white text-[#080808] rounded-xl px-8 py-4 font-bold transition-all hover:bg-gray-100 w-full md:w-auto"
          >
            GET LAZY PASS
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* SECTION: FAQ */}
        <div id="faq" className="mt-24 lg:mt-32 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">FAQ</h2>
          <Accordion.Root type="multiple" className="space-y-4">
            {[
              { q: "Is this workshop online?", a: "Yes, the workshop is 100% online." },
              { q: "What time does it start?", a: "Sunday, 27 September 2026 at 10:00 AM IST." },
              { q: "Is it beginner friendly?", a: "Yes! We start from zero. Basic computer familiarity is all you need." },
              { q: "Do I need prior AI experience?", a: "No advanced AI experience is required. We explain everything." },
              { q: "What will I build?", a: "You will build a working AI agent prototype connected to real tools." },
              { q: "What do I need to attend?", a: "A laptop and a stable internet connection." },
              { q: "How do I receive the joining link?", a: "The link will be sent to your registered email upon payment." },
              { q: "What happens after I pay?", a: "You will receive a confirmation email with calendar invites and access instructions." },
            ].map((faq, i) => (
              <Accordion.Item key={i} value={`faq-${i}`} className="border border-[#080808]/10 bg-white rounded-xl overflow-hidden">
                <Accordion.Header>
                  <Accordion.Trigger className="w-full text-left px-6 py-4 font-semibold flex items-center justify-between group">
                    {faq.q}
                    <div className="w-6 h-6 rounded-full border border-[#080808]/10 flex items-center justify-center text-[#080808]/40 group-data-[state=open]:rotate-180 transition-transform">
                      ↓
                    </div>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="px-6 pb-5 text-[#080808]/70 text-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in">
                  {faq.a}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>

        {/* FINAL CTA */}
        <div className="mt-24 lg:mt-32 text-center pb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 max-w-2xl mx-auto">
            READY TO BUILD YOUR FIRST AI AGENT?
          </h2>
          <div className="flex flex-col items-center gap-4 text-sm font-medium text-[#080808]/60 mb-8">
            <div>27 SEPTEMBER 2026</div>
            <div>10:00 AM — 1:00 PM IST</div>
            <div>
              ONLINE · <span className="line-through opacity-60 mr-1">₹999</span> <span className="text-[#E5092F] font-bold">₹1</span>
            </div>
          </div>
          <a
            href="#register"
            className="inline-flex items-center justify-center gap-2 bg-[#E5092F] text-white rounded-xl px-12 py-4 font-bold transition-all hover:bg-[#E5092F]/90"
          >
            BOOK YOUR SEAT →
          </a>
          <p className="mt-6 text-xs text-[#080808]/40 font-mono">
            Workshop #01 · LazyTech
          </p>
        </div>
      </main>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-[#080808]/10 md:hidden z-50">
        {success ? (
          <button 
            disabled
            className="flex w-full items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl py-3.5 font-bold shadow-lg"
          >
            <CheckCircle2 className="h-5 w-5" />
            Registered
          </button>
        ) : (
          <button 
            type="submit"
            form="register-form"
            className="flex w-full items-center justify-center gap-2 bg-[#080808] text-white rounded-xl py-3.5 font-medium shadow-lg"
          >
            <div className="flex items-center border-r border-white/20 pr-3 mr-1">
              <span className="opacity-50 line-through text-xs mr-2">₹999</span>
              <span className="font-bold text-[#E5092F]">₹1</span>
            </div>
            Register Now →
          </button>
        )}
      </div>

    </div>
  );
}
