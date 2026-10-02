"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Users,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { WaveDivider } from "@/src/components/get-involved/wave-divider";

// page.tsx stays a Server Component (exports `metadata`), so icons for the
// floating badge are looked up by name here rather than passed as component
// references — see feature-card-grid.tsx for why.
const BADGE_ICONS = { ShieldCheck, HeartHandshake, Users, CheckCircle2 } satisfies Record<
  string,
  LucideIcon
>;

interface CtaLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FloatingBadge {
  icon: keyof typeof BADGE_ICONS;
  title: string;
  subtitle: string;
}

interface PageHeroProps {
  pill: string;
  title: string;
  description: string;
  primaryCta: CtaLink;
  secondaryCta?: CtaLink;
  image: string;
  imageAlt: string;
  floatingBadge?: FloatingBadge;
}

// Shared hero for the /get-involved/* dedicated pages. Two-column layout
// (copy + CTAs left, photo right) on the brand teal, with a floating status
// card overlapping the image — the same device the Moniepoint reference
// screenshots use for their hero stat callouts — plus a wave transition into
// the next section instead of a hard color cut.
export function PageHero({
  pill,
  title,
  description,
  primaryCta,
  secondaryCta,
  image,
  imageAlt,
  floatingBadge,
}: PageHeroProps) {
  const BadgeIcon = floatingBadge ? BADGE_ICONS[floatingBadge.icon] : null;

  return (
    <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-primary text-primary-foreground overflow-hidden">
      {/* Ambient depth */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle,_white_1px,_transparent_1px)] [background-size:28px_28px]"
        aria-hidden
      />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 mb-5 text-sm font-medium bg-white/15 rounded-full backdrop-blur"
            >
              {pill}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold leading-tight mb-5 text-balance"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg text-primary-foreground/85 max-w-xl mb-8"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <HeroCta cta={primaryCta} solid />
              {secondaryCta && <HeroCta cta={secondaryCta} />}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative pb-8 sm:pb-0"
          >
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image src={image} alt={imageAlt} fill className="object-cover" priority />
            </div>

            {floatingBadge && BadgeIcon && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute -bottom-2 left-4 right-4 sm:left-auto sm:right-6 sm:w-64 bg-card text-card-foreground border border-border rounded-2xl shadow-2xl p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <BadgeIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">{floatingBadge.title}</p>
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                    {floatingBadge.subtitle}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <WaveDivider />
    </section>
  );
}

function HeroCta({ cta, solid = false }: { cta: CtaLink; solid?: boolean }) {
  const className = solid
    ? "bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-6"
    : "border-white/60 text-primary-foreground hover:bg-white hover:text-primary font-semibold px-8 py-6 bg-transparent";

  const content = (
    <>
      {cta.label}
      {solid && <ArrowRight className="ml-2 h-5 w-5" />}
    </>
  );

  if (cta.external) {
    return (
      <Button asChild size="lg" variant={solid ? "default" : "outline"} className={className}>
        <a href={cta.href} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      </Button>
    );
  }

  return (
    <Button asChild size="lg" variant={solid ? "default" : "outline"} className={className}>
      <Link href={cta.href}>{content}</Link>
    </Button>
  );
}
