"use client"

import { motion } from "framer-motion"
import { SectionWrapper } from "./section-wrapper"
import { ShieldCheck, Eye, Zap } from "lucide-react"

const values = [
  {
    icon: ShieldCheck,
    title: "Trust",
    description: "Every case is verified before approval. Our rigorous vetting process ensures authenticity.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Contributors track funds in real time. Know exactly where your money goes.",
  },
  {
    icon: Zap,
    title: "Speed",
    description: "Fast disbursement to approved facilities. No delays when lives are at stake.",
  },
]

export function CoreValuesSection() {
  return (
    <SectionWrapper className="bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-accent/20 text-accent-foreground rounded-full"
          >
            Our Values
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance"
          >
            Built on principles that matter
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
              >
                <value.icon className="w-8 h-8 text-primary" />
              </motion.div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
