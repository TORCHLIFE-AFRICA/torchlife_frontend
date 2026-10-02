"use client";

import { motion } from "framer-motion";
import {
  Target,
  Share2,
  Building2,
  Repeat2,
  ShieldCheck,
  FileText,
  TrendingUp,
  Heart,
  HeartHandshake,
  UserPlus,
  Stethoscope,
  Users,
  Lightbulb,
  Award,
  type LucideIcon,
} from "lucide-react";

// Page.tsx files stay Server Components (they export `metadata`), so a
// component reference like `icon: Target` can't be passed to this
// "use client" grid as a prop — React can't serialize a function across the
// server/client boundary. Icons are looked up by name here instead, entirely
// on the client.
const ICONS = {
  Target,
  Share2,
  Building2,
  Repeat2,
  ShieldCheck,
  FileText,
  TrendingUp,
  Heart,
  HeartHandshake,
  UserPlus,
  Stethoscope,
  Users,
  Lightbulb,
  Award,
} satisfies Record<string, LucideIcon>;

export type FeatureIconName = keyof typeof ICONS;

export interface FeatureItem {
  icon: FeatureIconName;
  title: string;
  description: string;
}

interface FeatureCardGridProps {
  items: FeatureItem[];
  columns?: string;
}

// Icon + title + description card grid — reused for "Ways to support",
// "Support with confidence" and "What partnership can look like". A
// gradient icon badge and a hover-revealed top accent give it more depth
// than a flat bordered box.
export function FeatureCardGrid({
  items,
  columns = "md:grid-cols-2 lg:grid-cols-4",
}: FeatureCardGridProps) {
  return (
    <div className={`grid gap-6 ${columns}`}>
      {items.map((item, index) => {
        const Icon = ICONS[item.icon];
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all"
          >
            <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
