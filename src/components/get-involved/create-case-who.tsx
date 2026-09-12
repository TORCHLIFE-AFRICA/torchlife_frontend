"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  HeartHandshake,
  MessageCircleHeart,
  UserRound,
  Users,
} from "lucide-react";

const roles = [
  {
    icon: UserRound,
    title: "Pregnant Woman",
    description:
      "Create a campaign for your own pregnancy healthcare needs.",
  },
  {
    icon: HeartHandshake,
    title: "Spouse",
    description:
      "A husband or partner can help create a campaign for his pregnant spouse.",
  },
  {
    icon: Users,
    title: "Family",
    description:
      "A family member can help someone they know start the process.",
  },
  {
    icon: MessageCircleHeart,
    title: "Friend",
    description:
      "A trusted friend can help bring a genuine healthcare need forward.",
  },
  {
    icon: Briefcase,
    title: "Colleague",
    description:
      "A colleague or workplace representative can help raise support for a pregnant employee where appropriate.",
  },
];

export function CreateCaseWho() {
  return (
    <section id="who-can-create" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-brand-teal-tint px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-teal">
            Who can create a case?
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
            Anyone who genuinely cares can start one
          </h2>
          <p className="mt-4 text-base leading-7 text-brand-muted">
            A case can be started by the person in need, or by someone
            trusted who is helping them come forward.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              whileHover={{ y: -4 }}
              className="flex flex-col rounded-3xl border border-brand-card-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-teal-tint text-brand-teal">
                <role.icon className="size-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-brand-ink">
                {role.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-brand-muted">
                {role.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
