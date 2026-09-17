import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { BATCH, BRAND } from "@/data/site";

export function MobileBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden"
        >
          <Link
            to="/join"
            className="tap group flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-mono text-xs uppercase tracking-[0.14em] text-white transition-transform duration-[180ms] active:scale-[0.97]"
          >
            <span>{BATCH.cta}</span>
            <span className="line-through opacity-70">₹{BRAND.regularPrice}</span>
            <span>₹{BRAND.price}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-[180ms] group-hover:translate-x-1" />
          </Link>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
