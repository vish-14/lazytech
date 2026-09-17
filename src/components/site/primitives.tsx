import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MaskLines, Reveal } from "@/components/site/motion";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3 text-graphite", className)}>
      <span aria-hidden className="inline-block h-[1px] w-8 bg-primary" />
      {children}
    </p>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center rounded-full border border-border px-3 py-1.5 text-graphite",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Primary/secondary action. Press scales to .97, arrow slides 4px on hover. */
export function Btn({
  to,
  href,
  children,
  variant = "signal",
  className,
  onClick,
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  variant?: "signal" | "ghost" | "paper";
  className?: string | undefined;
  onClick?: () => void;
}) {
  const styles = {
    signal: "bg-primary text-white hover:bg-[#e5342a]",
    ghost: "border border-border text-foreground hover:border-foreground",
    paper: "bg-paper text-[#101010] hover:bg-white",
  }[variant];

  const inner = (
    <>
      <span>{children}</span>
      <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-[180ms] ease-out group-hover:translate-x-1" />
    </>
  );

  const cls = cn(
    "group tap inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] transition-[transform,background-color,border-color] duration-[180ms] ease-out active:scale-[0.97]",
    styles,
    className,
  );

  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={(to ?? "/") as "/"} className={cls} onClick={onClick}>
      {inner}
    </Link>
  );
}

/** Project-artifact style card: hairline, small radius, lift + signal border on hover. */
export function ArtifactCard({
  children,
  className,
  active = false,
}: {
  children: ReactNode;
  className?: string | undefined;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "artifact h-full p-5 sm:p-6",
        active && "border-primary bg-[#171313]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHead({
  eyebrow,
  line1,
  line2,
  body,
  className,
}: {
  eyebrow: string;
  line1: string;
  line2?: string | undefined;
  body?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <h2 className="mt-5 text-[clamp(2rem,5.4vw,3.6rem)] uppercase">
        <MaskLines
          lines={[line1, ...(line2 ? [<span className="text-primary">{line2}</span>] : [])]}
        />
      </h2>
      {body ? (
        <Reveal delay={0.06}>
          <p className="mt-5 max-w-xl text-[17px] leading-[1.6] text-graphite">{body}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
