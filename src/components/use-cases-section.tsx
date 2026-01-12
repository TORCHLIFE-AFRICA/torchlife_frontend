"use client"

import { motion } from "framer-motion"
import { SectionWrapper } from "./section-wrapper"
import { Heart, Ambulance, MapPin } from "lucide-react"

const useCases = [
  {
    icon: Heart,
    title: "Emergency C-section",
    description: "Rapid funding when complications arise, ensuring mothers receive immediate surgical intervention.",
  },
  {
    icon: Ambulance,
    title: "Obstetric hemorrhage",
    description: "Immediate cash flow to partner hospitals for emergency blood transfusions and critical care.",
  },
  {
    icon: MapPin,
    title: "Rural clinic access",
    description: "Transport and treatment support for mothers in remote areas needing specialized care.",
  },
]

export function UseCasesSection() {
  return (
    <SectionWrapper className="bg-muted" id="campaigns">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full"
          >
            Use Cases
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance"
          >
            When every minute matters
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            TorchLife provides rapid funding for critical maternal healthcare emergencies
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-card rounded-xl p-6 lg:p-8 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                <useCase.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{useCase.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{useCase.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
