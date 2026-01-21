"use client"

import { motion } from "framer-motion"
import { SectionWrapper } from "./section-wrapper"

const phrases = [
  "Verified. Transparent. Fast.",
  "Fast funding when every minute matters.",
  "Real care. Real hospitals. Real impact.",
]

export function CatchPhrasesSection() {
  return (
    <SectionWrapper className="bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          {phrases.map((phrase, index) => (
            <motion.div
              key={phrase}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="text-center"
            >
              <p className="text-xl lg:text-2xl font-bold text-foreground">&ldquo;{phrase}&rdquo;</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
