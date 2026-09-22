"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  /** Stagger offset in seconds, so siblings can cascade into view. */
  delay?: number;
  /** Distance in pixels the content travels before settling. */
  offset?: number;
};

/**
 * Reveals content once as it scrolls into view. Falls back to a plain fade-free
 * render when the visitor has asked for reduced motion.
 */
export function RevealOnScroll({
  children,
  className,
  delay = 0,
  offset = 28,
}: RevealOnScrollProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      // Paired with the <noscript> rule in the root layout, so revealed
      // content stays visible if the animation never runs.
      data-reveal=""
      className={className}
      // Always the same element type, so the reduced-motion branch cannot
      // introduce a hydration mismatch. Reduced motion keeps the fade but
      // drops the travel, which is the vestibular-safe part.
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: offset }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : 0.6,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
