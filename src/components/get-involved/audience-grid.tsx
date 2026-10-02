"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  Users,
  Building2,
  HandCoins,
  Hospital,
  Briefcase,
  Landmark,
  Globe2,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

// No real, consented photography exists yet for these personas. Rather than
// fill the gap with stock photos of strangers standing in for "a company"
// or "a philanthropist" — which is exactly the manufactured-trust / fake
// stock-photo look the content doc rules out — every card is an original
// brand-gradient illustration: a purpose-matched icon in a glass badge over
// a teal/gold gradient, echoing the hero's orb + dot-grid language. Drop-in
// replaceable with real photography later (swap the card body, keep the API).
const ICONS = {
  Smartphone,
  Users,
  Building2,
  HandCoins,
  Hospital,
  Briefcase,
  Landmark,
  Globe2,
  Stethoscope,
} satisfies Record<string, LucideIcon>;

export type AudienceIconName = keyof typeof ICONS;

export interface AudienceItem {
  icon: AudienceIconName;
  title: string;
  description: string;
}

interface AudienceGridProps {
  items: AudienceItem[];
  columns?: string;
}

export function AudienceGrid({
  items,
  columns = "sm:grid-cols-2 lg:grid-cols-4",
}: AudienceGridProps) {
  return (
    <div className={`grid gap-5 ${columns}`}>
      {items.map((item, index) => {
        const Icon = ICONS[item.icon];
        const isAccent = index % 2 === 1;

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -4 }}
            className="group relative aspect-4/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
          >
            <div
              className={
                isAccent
                  ? "absolute inset-0 bg-gradient-to-br from-accent via-accent/80 to-primary/90"
                  : "absolute inset-0 bg-gradient-to-br from-primary via-primary/85 to-accent/70"
              }
            />
            <div
              className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle,_white_1px,_transparent_1px)] [background-size:20px_20px]"
              aria-hidden
            />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" aria-hidden />
            <div className="absolute -bottom-10 -left-8 w-28 h-28 bg-black/10 rounded-full blur-2xl" aria-hidden />
            <Icon
              className="absolute -right-5 -bottom-5 w-28 h-28 text-white/10 rotate-[-12deg] transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-105"
              strokeWidth={1}
              aria-hidden
            />

            <div className="relative h-full flex flex-col justify-between p-5">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center transition-all duration-300 group-hover:bg-white/25 group-hover:scale-105">
                <Icon className="w-7 h-7 text-white" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1.5 text-balance">
                  {item.title}
                </h3>
                <p className="text-white/85 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
