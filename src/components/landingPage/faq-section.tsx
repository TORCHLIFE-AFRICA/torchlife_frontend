"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./section-wrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import Link from "next/link";

const faqs: {
  question: string;
  answer: React.ReactNode;
}[] = [
  {
    question: "How are cases verified?",
    answer: (
      <>
        <p>
          Every campaign goes through a verification process before it goes
          live. We confirm medical details with the hospital or care provider
          involved, review documents, and speak directly with the people
          handling the case.
        </p>
        <p className="mt-3">
          No campaign is published without verification. This ensures every
          donation is going to a real person with a real medical need.
        </p>
      </>
    ),
  },
  {
    question: "Can I track where my money goes?",
    answer: (
      <>
        <p>Yes. Transparency is core to TorchLife.</p>
        <ul className="list-disc pl-5 mt-3 space-y-1">
          <li>Campaign progress</li>
          <li>How much has been raised</li>
          <li>When funds are released</li>
          <li>Updates on treatment or care</li>
        </ul>
        <p className="mt-3">
          We believe donors deserve to see the impact of their kindness in real
          time.
        </p>
      </>
    ),
  },
  {
    question: "What happens if a campaign does not reach its goal?",
    answer: (
      <>
        <ul className="list-disc pl-5 space-y-1">
          <li>Funds already donated are not lost</li>
          <li>They are safely held in the donor’s TorchLife wallet</li>
          <li>Donors can choose to redirect funds to another verified case</li>
        </ul>
        <p className="mt-3">
          No money disappears. Everything is accounted for.
        </p>
      </>
    ),
  },
  {
    question: "Do donors pay any fees?",
    answer: (
      <>
        <p>
          No. Donors are not charged any platform fee.
          <strong> 100% of your donation</strong> goes toward the campaign you
          support.
        </p>
        <p className="mt-3 text-sm">
          Payment processor charges may apply depending on your payment method,
          but TorchLife does not take from donations.
        </p>
      </>
    ),
  },
  {
    question: "How does TorchLife sustain itself?",
    answer: (
      <>
        <p>
          TorchLife operates on a simple principle: impact first, sustainability
          second.
        </p>
        <p className="mt-3">
          We only earn when a fundraiser chooses a premium withdrawal option.
          This helps us verify cases, maintain the platform, support hospitals,
          and keep operations running smoothly.
        </p>
      </>
    ),
  },
  {
    question: "Is TorchLife a nonprofit?",
    answer: (
      <p>
        TorchLife is a Impact-driven platform built to save lives through
        transparent medical crowdfunding. While we operate with strong ethical
        and social impact values, our structure allows us to sustainably support
        operations and reach more women who need urgent care.
      </p>
    ),
  },
  {
    question: "Who can start a campaign?",
    answer: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Pregnant women in need of care</li>
        <li>Family members</li>
        <li>Medical professionals</li>
        <li>Trusted representatives</li>
      </ul>
    ),
  },
  {
    question: "How fast can funds be released?",
    answer: (
      <>
        <p>Speed saves lives.</p>
        <p className="mt-3">
          For urgent medical cases, we verify quickly and release funds directly
          to hospitals when approved. This allows treatment to begin while full
          fundraising continues.
        </p>
      </>
    ),
  },
  {
    question: "Can I donate without creating an account?",
    answer: (
      <p>
        Yes. You can view campaigns freely and donate with minimal information.
        An account is only required if you want to track donations or create a
        campaign.
      </p>
    ),
  },
  {
    question: "Why should I trust TorchLife?",
    answer: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Verification, not assumptions</li>
        <li>Transparency, not promises</li>
        <li>Urgency, not delays</li>
        <li>People, not profits</li>
      </ul>
    ),
  },
];

export function FaqSection() {
  return (
    <SectionWrapper className="bg-muted" id="faqs">
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
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
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
  );
}
