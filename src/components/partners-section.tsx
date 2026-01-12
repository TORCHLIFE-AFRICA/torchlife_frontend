"use client"

import { motion } from "framer-motion"
import { SectionWrapper } from "./section-wrapper"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const partners = [
  {
    name: "Nigerian Health Alliance",
    logo: "/nigerian-health-alliance-medical-logo.jpg",
  },
  {
    name: "EcoBank",
    logo: "/ecobank-financial-logo.jpg",
  },
  {
    name: "Local Clinics Network",
    logo: "/medical-clinic-network-logo.jpg",
  },
  {
    name: "HealthFirst NGO",
    logo: "/healthcare-ngo-organization-logo.jpg",
  },
  {
    name: "MedVerify",
    logo: "/medical-verification-company-logo.jpg",
  },
]

export function PartnersSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % partners.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlay])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + partners.length) % partners.length)
    setIsAutoPlay(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % partners.length)
    setIsAutoPlay(false)
  }

  const getVisibleLogos = () => {
    return [
      partners[currentIndex],
      partners[(currentIndex + 1) % partners.length],
      partners[(currentIndex + 2) % partners.length],
    ]
  }

  return (
    <SectionWrapper className="bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full"
          >
            Our Partners
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance"
          >
            Trusted partners in healthcare
          </motion.h2>
        </div>

        <div className="relative flex items-center justify-center gap-4 lg:gap-8">
          {/* Left arrow */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPrevious}
            className="absolute left-0 z-10 p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            aria-label="Previous partner"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          {/* Logo carousel container */}
          <div className="flex justify-center items-center gap-6 lg:gap-12 px-16 lg:px-20 py-8 w-full overflow-hidden">
            {getVisibleLogos().map((partner, idx) => (
              <motion.div
                key={`${currentIndex}-${idx}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`flex-shrink-0 transition-all duration-300 ${
                  idx === 0 ? "opacity-50 scale-90" : idx === 1 ? "scale-100" : "opacity-50 scale-90"
                }`}
              >
                <div className="flex items-center justify-center h-24 w-32 lg:h-28 lg:w-40 bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    width={120}
                    height={100}
                    className="h-full w-full object-contain"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right arrow */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNext}
            className="absolute right-0 z-10 p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            aria-label="Next partner"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {partners.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                setIsAutoPlay(false)
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-primary w-8" : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
              }`}
              whileHover={{ scale: 1.2 }}
              aria-label={`Go to partner ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
