"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ClipboardList, LifeBuoy, UserCog } from "lucide-react";

import { Button } from "@/src/components/ui/button";

const helpItems = [
  {
    icon: UserCog,
    title: "Case Manager",
    description:
      "Contact the campaign manager where contact details are provided.",
  },
  {
    icon: LifeBuoy,
    title: "TorchLife Support",
    description:
      "Contact the TorchLife support team for platform-related questions.",
  },
  {
    icon: ClipboardList,
    title: "Case Updates",
    description: "Check the case page or dashboard for available updates.",
  },
];

export function TrackCaseHelp() {
  return (
    <section id="need-more-information" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-[var(--brand-teal-tint)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-teal)]">
            Need more information?
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--brand-ink)] sm:text-4xl">
            Help is never far away
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {helpItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-[1.5rem] border border-[var(--brand-card-border)] bg-white p-6 shadow-sm"
            >
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--brand-teal-tint)] text-[var(--brand-teal)]">
                <item.icon className="size-6" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-[var(--brand-ink)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex justify-center"
        >
          <Link href="mailto:info@torchlife.org">
            <Button
              size="lg"
              className="rounded-full bg-[var(--brand-teal)] px-8 text-base font-semibold text-white hover:bg-[var(--brand-teal-dark)]"
            >
              Contact Support
              <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
