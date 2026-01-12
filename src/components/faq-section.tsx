"use client"

import { motion } from "framer-motion"
import { SectionWrapper } from "./section-wrapper"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion"

const faqs = [
  {
    question: "How are cases verified?",
    answer:
      "Our medical team reviews documents and contacts the hospital.",
  },
  {
    question: "Can I track where my money goes?",
    answer:
      "Yes – each campaign has a live tracker.",
  },
  {
    question: "What happens if a campaign doesn't reach its goal?",
    answer:
      "Funds are returned to donors or redirected to the nearest urgent case.",
  },
  {
    question: "Is TorchLife a nonprofit?",
    answer:
      "No",
  },
  // {
  //   question: "How fast are funds disbursed to hospitals?",
  //   answer:
  //     "Once a campaign reaches its goal and verification is complete, funds are typically disbursed to partner hospitals within 24-48 hours. For emergency cases, we have an expedited process that can release funds within hours.",
  // },
]

export function FaqSection() {
  return (
    <SectionWrapper className="bg-muted">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full"
            >
              FAQs
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance"
            >
              Frequently asked questions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground"
            >
              Everything you need to know about TorchLife
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card rounded-lg border border-border px-6"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
