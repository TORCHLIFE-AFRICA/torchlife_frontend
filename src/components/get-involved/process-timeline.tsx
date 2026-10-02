"use client";

import { motion } from "framer-motion";

export interface ProcessStep {
  title: string;
  description: string;
}

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

// Numbered step flow: horizontal with a connecting line that draws itself in
// on scroll on desktop, a vertical timeline on mobile — matches the doc's
// spec for "How verification works" ("horizontal on desktop / vertical
// timeline on mobile"). Built generic so Create/Track can reuse it.
export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <>
      <div className="hidden lg:flex items-start">
        {steps.map((step, index) => (
          <div key={step.title} className="flex items-start flex-1 last:flex-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center w-44"
            >
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 ring-4 ring-primary/10 shadow-lg shadow-primary/20 text-primary-foreground flex items-center justify-center font-bold mb-4 shrink-0">
                {index + 1}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
            {index < steps.length - 1 && (
              <div className="relative flex-1 h-0.5 mt-6 mx-2 bg-border overflow-hidden rounded-full">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
                  style={{ originX: 0 }}
                  className="absolute inset-0 bg-gradient-to-r from-primary to-primary/30"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="lg:hidden space-y-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4"
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 ring-4 ring-primary/10 text-primary-foreground flex items-center justify-center font-bold shrink-0">
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/40 to-border mt-2" />
              )}
            </div>
            <div className="pb-2">
              <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
