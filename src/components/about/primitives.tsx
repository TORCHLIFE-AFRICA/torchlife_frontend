import type { ReactNode } from "react";

import { cn } from "@/src/lib/utils";
import { RevealOnScroll } from "../landingPage/RevealOnScroll";
import { HORIZON_LABELS, type Horizon } from "./about-content";

/** Horizontal rhythm and vertical spacing shared by every About section. */
export const SECTION_CLASS = "scroll-mt-40 px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8";

type SectionHeadingProps = {
  id: string;
  eyebrow?: string;
  title: string;
  /** Body copy under the title; pass paragraphs. */
  children?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

/**
 * The one heading treatment for the page, so the ten sections share a type
 * scale. `id` lands on the h2 for the section's aria-labelledby.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  children,
  align = "left",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <RevealOnScroll
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.24em]",
            isDark ? "text-[#e2c987]" : "text-[#0f766e]",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className={cn(
          "text-balance text-3xl font-semibold tracking-tight sm:text-4xl",
          eyebrow && "mt-4",
          isDark ? "text-white" : "text-[#132726]",
        )}
      >
        {title}
      </h2>
      {children ? (
        <div
          className={cn(
            "mt-5 space-y-4 text-base leading-7 sm:text-lg sm:leading-8",
            isDark ? "text-white/72" : "text-[#556a66]",
          )}
        >
          {children}
        </div>
      ) : null}
    </RevealOnScroll>
  );
}

const HORIZON_STYLES: Record<Horizon, string> = {
  today: "border-[#0f766e] bg-[#0f766e] text-white",
  next: "border-[#0f766e]/30 bg-[#0f766e]/10 text-[#0f4d46]",
  future: "border-dashed border-[#bfb4a0] bg-white text-[#556a66]",
  "long-term": "border-dashed border-[#d8cfbe] bg-transparent text-[#6c7f7b]",
};

/**
 * Surface for a card describing a stage. Stages that exist are solid, stages
 * still ahead are dashed outlines; the badge text carries the same meaning,
 * so the distinction never depends on seeing the styling.
 */
export const HORIZON_CARD_STYLES: Record<Horizon, string> = {
  today: "bg-white ring-1 ring-[#0f766e]/35 shadow-[0_24px_60px_-40px_rgba(15,118,110,0.55)]",
  next: "bg-white/85 ring-1 ring-black/5",
  future: "border border-dashed border-[#cfc5b3] bg-white/30",
  "long-term": "border border-dashed border-[#d8cfbe] bg-transparent",
};

/**
 * Marks when a stage belongs to. Only "today" is filled solid, because it is
 * the one horizon describing something that exists; the dashed outlines on
 * later horizons read as not-yet-drawn.
 */
export function HorizonBadge({ horizon, className }: { horizon: Horizon; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
        HORIZON_STYLES[horizon],
        className,
      )}
    >
      {horizon === "today" ? (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-white" />
      ) : null}
      {HORIZON_LABELS[horizon]}
    </span>
  );
}
