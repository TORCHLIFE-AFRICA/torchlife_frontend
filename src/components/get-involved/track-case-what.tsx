"use client";

import { motion } from "framer-motion";
import { Activity, Flag, LineChart, MessagesSquare } from "lucide-react";

const followItems = [
  {
    icon: LineChart,
    title: "Case Progress",
    description: "See how much support has been received.",
  },
  {
    icon: MessagesSquare,
    title: "Updates",
    description: "See updates added to the case.",
  },
  {
    icon: Activity,
    title: "Support Activity",
    description: "See relevant progress around the support received.",
  },
  {
    icon: Flag,
    title: "Outcome",
    description:
      "Where appropriate and available, see what happened after support was provided.",
  },
];

export function TrackCaseWhat() {
  return (
    <section id="what-you-can-follow" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-[var(--brand-teal-tint)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-teal)]">
            What you can follow
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--brand-ink)] sm:text-4xl">
            Everything you need to stay in the loop
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {followItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              whileHover={{ y: -4 }}
              className="flex flex-col rounded-[1.5rem] border border-[var(--brand-card-border)] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--brand-teal-tint)] text-[var(--brand-teal)]">
                <item.icon className="size-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[var(--brand-ink)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
