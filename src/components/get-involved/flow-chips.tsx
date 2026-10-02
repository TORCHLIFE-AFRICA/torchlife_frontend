"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface FlowChipsProps {
  steps: string[];
}

// Label chips connected by gently-animated arrows, for short state journeys
// like "You support → Case receives support → Progress is updated → ...".
export function FlowChips({ steps }: FlowChipsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-3">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/15 text-primary text-sm font-semibold text-center"
          >
            {step}
          </motion.span>
          {index < steps.length - 1 && (
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
            >
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}
