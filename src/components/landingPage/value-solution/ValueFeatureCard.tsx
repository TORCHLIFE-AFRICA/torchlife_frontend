"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { RevealOnScroll } from "../RevealOnScroll";
import type { ValueCard } from "./value-cards";
import { ScaledCanvas } from "./visuals/ScaledCanvas";

/**
 * One value proposition: copy and action on the left, a product preview on the
 * right. Every card shares this structure; only the visual differs.
 */
export function ValueFeatureCard({ card }: { card: ValueCard }) {
  const Visual = card.visual;
  const titleId = `value-card-${card.id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className="group grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16"
    >
      <RevealOnScroll className="max-w-lg">
        <span className="inline-flex items-center rounded-full bg-[#0f766e]/10 px-3.5 py-2 text-sm font-medium text-[#0d3a34]">
          {card.pill}
        </span>
        <h3
          id={titleId}
          className="mt-5 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-[#132726] sm:text-4xl lg:text-[2.5rem]"
        >
          {card.title}
        </h3>
        <p className="mt-5 text-base leading-7 text-[#556a66] sm:text-lg sm:leading-8">
          {card.description}
        </p>

        <Button
          asChild
          className="mt-8 h-12 rounded-xl bg-[#0f766e] px-6 text-base font-medium text-white shadow-[0_14px_30px_-16px_rgba(15,118,110,0.9)] hover:bg-[#0b5a54] focus-visible:ring-[#0f766e]/40 sm:h-14 sm:px-7"
        >
          <Link href={card.ctaHref} aria-describedby={titleId}>
            {card.ctaLabel}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
          </Link>
        </Button>
      </RevealOnScroll>

      <RevealOnScroll delay={0.12}>
        {/* Decorative product preview: the copy beside it carries the meaning. */}
        <div
          aria-hidden="true"
          className="transition-transform duration-500 ease-out group-hover:-translate-y-1.5 motion-reduce:transform-none motion-reduce:transition-none"
        >
          <ScaledCanvas>
            <Visual />
          </ScaledCanvas>
        </div>
      </RevealOnScroll>
    </article>
  );
}
