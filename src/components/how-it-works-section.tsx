"use client"

import { motion } from "framer-motion"
import { SectionWrapper } from "./section-wrapper"
import { FileText, ClipboardCheck, Lock, Banknote } from "lucide-react"

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Start a campaign",
    description: "Simple form, instant sharing. Get your campaign live in minutes.",
  },
  {
    icon: ClipboardCheck,
    step: "02",
    title: "Medical verification",
    description: "Documents reviewed and hospitals contacted for case validation.",
  },
  {
    icon: Lock,
    step: "03",
    title: "Secure funding",
    description: "Transparent collection process with real-time tracking.",
  },
  {
    icon: Banknote,
    step: "04",
    title: "Fast payout",
    description: "Funds sent directly to partner hospitals within 24-48 hours.",
  },
]

export function HowItWorksSection() {
  return (
    <SectionWrapper className="bg-primary text-primary-foreground" id="how-it-works">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-primary-foreground/20 text-primary-foreground rounded-full"
          >
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold mb-4 text-balance"
          >
            From campaign to care in four simple steps
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-primary-foreground/10 rounded-xl p-6 h-full backdrop-blur-sm border border-primary-foreground/20">
                <span className="text-5xl font-bold text-primary-foreground/20 mb-4 block">{step.step}</span>
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <step.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-primary-foreground/80 text-sm leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary-foreground/30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
