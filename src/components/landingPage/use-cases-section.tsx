"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./section-wrapper";
import {
  Heart,
  Ambulance,
  AlertCircle,
  MapPin,
  Wallet,
  FileText,
  User2,
} from "lucide-react";

const medicalEmergencies = [
  {
    icon: Heart,
    title: "Emergency C-section",
    description:
      "Rapid funding when complications arise, ensuring mothers receive immediate surgical intervention.",
  },
  {
    icon: Ambulance,
    title: "Obstetric hemorrhage",
    description:
      "Immediate cash flow to partner hospitals for emergency blood transfusions and critical care.",
  },
  {
    icon: AlertCircle,
    title: "Eclampsia & preeclampsia",
    description:
      "Life-saving treatment for mothers experiencing dangerous high blood pressure during pregnancy.",
  },
];

const nonMedicalEmergencies = [
  {
    icon: MapPin,
    title: "Rural access gaps",
    description:
      "Support for pregnant women in remote areas to access healthcare facilities.",
  },
  {
    icon: Wallet,
    title: "Financial barriers",
    description:
      "Coverage for basic care costs when families cannot afford essential maternal services.",
  },
  {
    icon: User2,
    title: "Marital gaps",
    description: "Single mother with little or no access to funds.",
  },
];

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
            TorchLife provides support for both medical and non-medical maternal
            healthcare emergencies
          </motion.p>
        </div>

        {/* Medical Emergencies Section */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-semibold text-foreground mb-6 text-center"
          >
            Medical Emergencies
          </motion.h3>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {medicalEmergencies.map((useCase, index) => (
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
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {useCase.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {useCase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Non-Medical Emergencies Section */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-semibold text-foreground mb-6 text-center"
          >
            Non-Medical Emergencies
          </motion.h3>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {nonMedicalEmergencies.map((useCase, index) => (
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
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {useCase.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {useCase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
