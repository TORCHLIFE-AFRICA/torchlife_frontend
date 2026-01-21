"use client"

import { motion } from "framer-motion"
import { SectionWrapper } from "./section-wrapper"
import { PenLine, Share2, CreditCard, BarChart3 } from "lucide-react"

const steps = [
  { icon: PenLine, title: "Start a campaign", color: "bg-primary" },
  { icon: Share2, title: "Share the story", color: "bg-accent" },
  { icon: CreditCard, title: "Donate securely", color: "bg-primary" },
  { icon: BarChart3, title: "Track impact", color: "bg-accent" },
]

export function StepsToHelpSection() {
  return (
    <SectionWrapper className="bg-muted">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full"
          >
            Get Involved
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance"
          >
            How you can help
          </motion.h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mb-3`}
              >
                <step.icon className="w-7 h-7 text-primary-foreground" />
              </motion.div>
              <p className="font-medium text-foreground text-center">{step.title}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute transform translate-x-[120px]">
                  <div className="w-8 h-0.5 bg-border" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
