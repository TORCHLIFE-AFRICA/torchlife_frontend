"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const journeyStages = [
  "Case Created",
  "Need Verified",
  "Case Published",
  "Support Received",
  "Progress Update",
  "Outcome",
];

export function TrackCaseTransparency() {
  return (
    <section className="scroll-mt-24 bg-[var(--brand-surface)] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-teal)] ring-1 ring-black/5">
            Transparency is part of the product
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--brand-ink)] sm:text-4xl">
            We want you to know what happens after you help.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--brand-muted)]">
            From case information to progress updates, TorchLife is designed
            to make the journey easier to follow.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-12 flex max-w-5xl flex-wrap items-center justify-center gap-y-4"
        >
          {journeyStages.map((stage, index) => (
            <div key={stage} className="flex items-center">
              <div className="flex flex-col items-center gap-2 px-2 text-center sm:px-3">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--brand-teal)] text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span className="max-w-[6.5rem] text-xs font-semibold leading-tight text-[var(--brand-ink-soft)] sm:max-w-none sm:text-sm">
                  {stage}
                </span>
              </div>
              {index < journeyStages.length - 1 && (
                <ChevronRight className="size-5 shrink-0 text-[var(--brand-card-border)]" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
