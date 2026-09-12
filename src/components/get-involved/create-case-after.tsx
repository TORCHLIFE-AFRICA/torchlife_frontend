"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, ShieldCheck } from "lucide-react";

import { Button } from "@/src/components/ui/button";

const START_CASE_HREF =
  "/auth?auth=signIn&returnUrl=%2Fdashboard%3Ftab%3Dcreate-campaign";

const stages = [
  "Submit",
  "Review",
  "Verify",
  "Approve",
  "Publish",
  "Support",
  "Update",
];

export function CreateCaseAfter() {
  return (
    <section id="after-submission" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-brand-teal-tint px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-teal">
            What happens after submission?
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
            Every campaign follows the same clear path
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-12 flex max-w-5xl flex-wrap items-center justify-center gap-x-1 gap-y-4 sm:gap-x-2"
        >
          {stages.map((stage, index) => (
            <div key={stage} className="flex items-center gap-1 sm:gap-2">
              <span
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] sm:px-5 sm:py-2.5 sm:text-sm ${
                  index === 0
                    ? "bg-brand-teal text-white"
                    : "bg-white text-brand-ink-soft ring-1 ring-black/5"
                }`}
              >
                {stage}
              </span>
              {index < stages.length - 1 && (
                <ChevronRight className="size-4 shrink-0 text-brand-card-border" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Closing CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-5xl overflow-hidden rounded-4xl bg-brand-ink-strong px-6 py-10 text-center text-white shadow-[0_30px_100px_-44px_rgba(7,28,26,0.9)] sm:px-10 sm:py-14"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
            <ShieldCheck className="size-4" />
            Verified. Transparent. Fast.
          </span>
          <h2 className="mx-auto mt-5 max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to start a campaign?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/70 sm:text-base">
            It only takes a few minutes to submit, and our team takes it from
            there.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={START_CASE_HREF}>
              <Button
                size="lg"
                className="w-full rounded-full bg-brand-gold px-8 text-base font-semibold text-[#17220f] hover:bg-brand-gold-dark sm:w-auto"
              >
                Start a Campaign
                <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/faq">
              <Button
                size="lg"
                variant="ghost"
                className="w-full rounded-full text-white hover:bg-white/10 hover:text-white sm:w-auto"
              >
                Learn about verification
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
