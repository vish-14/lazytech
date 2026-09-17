"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade + small rise on scroll into view. Opacity and translateY only. */
export function Reveal({
  children,
  delay = 0,
  y = 14,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number | undefined;
  y?: number;
  className?: string | undefined;
  as?: "div" | "section" | "li" | "span";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.24, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: EASE } },
};

export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string | undefined;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={groupVariants}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/** Headline that reveals line by line (opacity + translateY, 180-240ms). */
export function MaskLines({
  lines,
  className,
  lineClassName,
  delay = 0,
}: {
  lines: ReactNode[];
  className?: string | undefined;
  lineClassName?: string | undefined;
  delay?: number | undefined;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
    );
    io.observe(el);
    const fallback = window.setTimeout(() => setShown(true), 900);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <span ref={ref} className={cn("block", className)}>
      {lines.map((line, i) => (
        <span key={i} className="block pb-[0.04em]">
          <span
            className={cn("block will-change-transform", lineClassName)}
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? "translateY(0)" : "translateY(14px)",
              transition: `opacity 220ms ease-out ${delay + i * 0.07}s, transform 220ms ease-out ${delay + i * 0.07}s`,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}

/** Cycling terminal-style value. Pauses on hover/focus of its container. */
export function Cycler({
  values,
  interval = 2100,
  paused = false,
  className,
}: {
  values: string[];
  interval?: number;
  paused?: boolean;
  className?: string | undefined;
}) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (paused || reduce) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % values.length), interval);
    return () => window.clearInterval(id);
  }, [paused, reduce, interval, values.length]);

  return (
    <span className={cn("inline-flex items-baseline", className)} aria-live="polite">
      <span key={values[i]} className={reduce ? undefined : "cycle-in"}>
        {values[i]}
      </span>
    </span>
  );
}

/** Terminal-style typewriter: types a value, holds, deletes, moves on. */
export function Typewriter({
  values,
  paused = false,
  className,
  typeSpeed = 45,
  deleteSpeed = 26,
  hold = 1400,
}: {
  values: string[];
  paused?: boolean;
  className?: string | undefined;
  typeSpeed?: number;
  deleteSpeed?: number;
  hold?: number;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(() => values[0] ?? "");
  const [deleting, setDeleting] = useState(false);

  const full = values[index % values.length] ?? "";

  useEffect(() => {
    if (reduce) {
      setText(full);
      return;
    }
    if (paused) return;

    if (!deleting && text === full) {
      const id = window.setTimeout(() => setDeleting(true), hold);
      return () => window.clearTimeout(id);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % values.length);
      return;
    }
    const id = window.setTimeout(
      () => setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1)),
      deleting ? deleteSpeed : typeSpeed,
    );
    return () => window.clearTimeout(id);
  }, [text, deleting, full, paused, reduce, values.length, typeSpeed, deleteSpeed, hold]);

  return (
    <span className={cn("inline-flex items-baseline", className)} aria-live="polite">
      <span>{text}</span>
      <span aria-hidden className="type-caret" />
    </span>
  );
}

/** Subtle pointer-follow lift, disabled on touch/reduced motion. */
export function Magnetic({
  children,
  className,
}: {
  children: ReactNode;
  className?: string | undefined;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 300, damping: 22, mass: 0.3 });
  const y = useSpring(0, { stiffness: 300, damping: 22, mass: 0.3 });

  if (reduce) return <span className={className}>{children}</span>;

  return (
    <motion.span
      ref={ref}
      className={cn("inline-flex", className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width - 0.5) * 8);
        y.set(((e.clientY - r.top) / r.height - 0.5) * 6);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/** Seamless looping ticker strip. */
export function Marquee({
  items,
  className,
  speed = 38,
  separator = "/",
}: {
  items: string[];
  className?: string | undefined;
  speed?: number;
  separator?: string;
}) {
  const row = [...items, ...items];
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="marquee-track flex w-max gap-8" style={{ animationDuration: `${speed}s` }}>
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="eyebrow flex shrink-0 items-center gap-8">
            {item}
            <span aria-hidden className="opacity-40">
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Slow parallax drift for decorative layers. */
export function Parallax({
  children,
  distance = 30,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string | undefined;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? {} : { y }}>{children}</motion.div>
    </div>
  );
}

/** Thin reading-progress rail under the nav. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-primary"
    />
  );
}
