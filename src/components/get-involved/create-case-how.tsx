"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  ClipboardList,
  FileText,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create your account",
    description: "Sign up in minutes with your basic details.",
  },
  {
    icon: FileText,
    title: "Submit the campaign",
    description: "Tell us who the campaign is for and what's needed.",
  },
  {
    icon: ClipboardList,
    title: "Provide supporting information",
    description: "Share the details and documents that back up the request.",
  },
  {
    icon: ShieldCheck,
    title: "TorchLife reviews the campaign",
    description: "Our team checks and verifies everything submitted.",
  },
  {
    icon: CheckCircle2,
    title: "Campaign goes live when approved",
    description: "Once verified, the campaign is published for support.",
  },
];

export function CreateCaseHow() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-brand-surface px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-teal ring-1 ring-black/5">
            How it works
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
            How to create a campaign
          </h2>
        </div>

        <div className="relative mt-14">
          {/* Connecting line - desktop only */}
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-brand-card-border lg:block" />

          <div className="grid gap-8 lg:grid-cols-5 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative flex flex-col items-center text-center lg:items-start lg:text-left"
              >
                <div
                  className={`relative z-10 inline-flex size-14 items-center justify-center rounded-2xl text-white shadow-sm ${
                    index % 2 === 0 ? "bg-brand-teal" : "bg-brand-gold"
                  }`}
                >
                  <step.icon className="size-6" />
                  <span className="absolute -right-2 -top-2 inline-flex size-6 items-center justify-center rounded-full bg-white text-xs font-bold text-brand-ink ring-1 ring-black/5">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-brand-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-brand-muted">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
