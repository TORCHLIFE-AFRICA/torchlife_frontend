"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./section-wrapper";
import { Button } from "@/src/components/ui/button";
import { ArrowRight, Heart, Users } from "lucide-react";

export function CtaSection() {
  return (
    <SectionWrapper className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-5xl font-bold mb-6 text-balance"
          >
            Ready to make a difference?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg lg:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto"
          >
            Join thousands of donors and campaigners saving lives through
            verified healthcare crowdfunding.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-lg"
              >
                Start a Campaign
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold px-8 py-6 text-lg"
              >
                <Heart className="mr-2 h-5 w-5" />
                Donate Now
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8 py-6 text-lg"
              >
                <Users className="mr-2 h-5 w-5" />
                Volunteer
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
