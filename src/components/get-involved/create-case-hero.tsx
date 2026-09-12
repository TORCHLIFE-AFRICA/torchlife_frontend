"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/src/components/ui/button";

const START_CASE_HREF =
  "/auth?auth=signIn&returnUrl=%2Fdashboard%3Ftab%3Dcreate-campaign";

export function CreateCaseHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-14 pt-10 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8">
      <div className="absolute inset-x-0 top-0 -z-10 h-136 bg-[radial-gradient(circle_at_top,rgba(15,118,110,0.14),transparent_54%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-teal shadow-sm ring-1 ring-black/5">
            <Sparkles className="size-3.5" />
            Get Involved
          </span>

          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
            Start a Campaign
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-brand-muted sm:text-lg lg:mx-0">
            When pregnancy care becomes difficult to afford, you should not
            have to figure everything out alone.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Link href={START_CASE_HREF}>
              <Button
                size="lg"
                className="w-full rounded-full bg-brand-gold px-8 text-base font-semibold text-[#17220f] hover:bg-brand-gold-dark sm:w-auto"
              >
                Start a Campaign
                <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#who-can-create">
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full border-brand-card-border bg-white/80 px-8 text-base text-brand-ink-soft hover:bg-white sm:w-auto"
              >
                Who can create a campaign?
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-brand-ink-soft lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 ring-1 ring-black/5">
              <ShieldCheck className="size-4 text-brand-teal" />
              Reviewed and verified before it goes live
            </span>
          </div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/60 p-3 shadow-[0_40px_120px_-48px_rgba(10,30,28,0.35)]">
            <div className="relative aspect-4/5 overflow-hidden rounded-[1.6rem]">
              <Image
                src="/pregnant-african-woman-smiling-in-modern-hospital-.jpg"
                alt="A pregnant woman starting her case on her phone"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 480px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,118,110,0.05)_0%,rgba(15,39,38,0.45)_100%)]" />
            </div>
          </div>

          {/* Overlapping "spouse assisting" card */}
          <motion.div
            initial={{ opacity: 0, y: 16, x: -8 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute -bottom-8 -left-4 w-40 rounded-2xl border border-white/80 bg-white p-2.5 shadow-[0_24px_60px_-24px_rgba(10,30,28,0.4)] sm:-bottom-10 sm:-left-8 sm:w-48"
          >
            <div className="relative aspect-4/3 overflow-hidden rounded-xl">
              <Image
                src="/people-using-smartphone-social-media-charity.jpg"
                alt="A husband helping his pregnant spouse complete registration"
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
            <p className="mt-2 line-clamp-2 text-[11px] font-medium leading-snug text-brand-ink-soft">
              A spouse helping to register a case
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
