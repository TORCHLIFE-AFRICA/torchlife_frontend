"use client";

import { motion } from "framer-motion";
import {
  Building2,
  FileCheck2,
  IdCard,
  Phone,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";

const requirements = [
  {
    icon: IdCard,
    title: "Basic information",
    description: "Information about the person requesting support.",
  },
  {
    icon: Stethoscope,
    title: "Healthcare information",
    description: "Relevant information about the pregnancy healthcare need.",
  },
  {
    icon: Building2,
    title: "Hospital information",
    description:
      "Details of the relevant healthcare provider, where applicable.",
  },
  {
    icon: FileCheck2,
    title: "Supporting documents",
    description: "Documents required to help establish the case.",
  },
  {
    icon: Phone,
    title: "Contact information",
    description:
      "A reliable way for the campaign manager or TorchLife team to communicate with the relevant people.",
  },
];

export function CreateCaseNeed() {
  return (
    <section id="what-we-need" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-brand-teal-tint px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-teal">
            What do we need?
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
            What we ask for, and why
          </h2>
          <p className="mt-4 text-base leading-7 text-brand-muted">
            Just enough for our team to verify and support the campaign
            responsibly.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {requirements.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="rounded-3xl border border-brand-card-border bg-white p-6 shadow-sm"
            >
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-teal-tint text-brand-teal">
                <item.icon className="size-6" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-brand-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-brand-muted">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-8 flex max-w-3xl items-start gap-3 rounded-2xl border border-(--brand-gold)/30 bg-(--brand-gold)/10 p-4 sm:p-5"
        >
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-brand-gold-dark" />
          <p className="text-sm leading-6 text-brand-ink-soft">
            We do not publish sensitive health information unnecessarily.
            Documents shared with us are used only to verify and support the
            campaign.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
