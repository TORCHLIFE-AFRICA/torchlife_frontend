"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BellRing, ShieldCheck } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { formatMoney } from "@/src/components/dashboard/dashboard-helpers";

const VIEW_CASES_HREF = "/dashboard";
const BROWSE_CASES_HREF = "/campaigns";

// Illustrative preview only. Wire this up to the real case once the
// tracking view ships, e.g. via campaignApi.getCampaign(id) and
// getCampaignProgress / getCampaignRaised / getCampaignGoal from
// dashboard-helpers, plus the latest CaseUpdate for the case.
const sampleCase = {
  title: "Emergency Pregnancy Care",
  progress: 72,
  raised: 360000,
  goal: 500000,
  currency: "NGN",
  latestUpdate: "Hospital review completed",
  updatedLabel: "Updated 2 hours ago",
};

export function TrackCaseHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-14 pt-10 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(15,118,110,0.14),transparent_54%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-teal)] shadow-sm ring-1 ring-black/5">
            <BellRing className="size-3.5" />
            Get Involved
          </span>

          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-[var(--brand-ink)] sm:text-5xl lg:text-6xl">
            Stay connected to the story
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[var(--brand-muted)] sm:text-lg lg:mx-0">
            Supporting a case should not mean losing sight of what happens
            next.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Link href={VIEW_CASES_HREF}>
              <Button
                size="lg"
                className="w-full rounded-full bg-[var(--brand-gold)] px-8 text-base font-semibold text-[#17220f] hover:bg-[var(--brand-gold-dark)] sm:w-auto"
              >
                View My Cases
                <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
            <Link href={BROWSE_CASES_HREF}>
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full border-[var(--brand-card-border)] bg-white/80 px-8 text-base text-[var(--brand-ink-soft)] hover:bg-white sm:w-auto"
              >
                Browse Cases
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-[var(--brand-ink-soft)] lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 ring-1 ring-black/5">
              <ShieldCheck className="size-4 text-[var(--brand-teal)]" />
              Progress and updates, in one place
            </span>
          </div>
        </motion.div>

        {/* Visual: case status dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-5 shadow-[0_40px_120px_-48px_rgba(10,30,28,0.35)] sm:p-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-[var(--brand-teal-tint)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-teal)]">
                Case Status
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#eaf3f1] px-3 py-1 text-[11px] font-semibold text-[var(--brand-teal)]">
                <span className="size-1.5 rounded-full bg-[var(--brand-teal)]" />
                Live
              </span>
            </div>

            <h3 className="mt-4 text-xl font-semibold text-[var(--brand-ink)] sm:text-2xl">
              {sampleCase.title}
            </h3>

            <div className="mt-5">
              <div className="flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold tracking-tight text-[var(--brand-teal-deep)] sm:text-4xl">
                  {sampleCase.progress}%
                </p>
                <p className="pb-1 text-xs font-medium text-[var(--brand-muted)] sm:text-sm">
                  {formatMoney(sampleCase.raised, sampleCase.currency)} of{" "}
                  {formatMoney(sampleCase.goal, sampleCase.currency)}
                </p>
              </div>
              <div className="mt-2.5 h-2.5 rounded-full bg-[#e6ddc8]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sampleCase.progress}%` }}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                  className="h-2.5 rounded-full bg-[var(--brand-gold)]"
                />
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[var(--brand-surface)] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-muted)]">
                Latest update
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--brand-ink)]">
                {sampleCase.latestUpdate}
              </p>
              <p className="mt-1 text-xs text-[var(--brand-muted)]">
                {sampleCase.updatedLabel}
              </p>
            </div>

            <p className="mt-4 text-center text-[11px] text-[var(--brand-muted)]">
              Sample preview &mdash; your dashboard shows real, live case data.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
