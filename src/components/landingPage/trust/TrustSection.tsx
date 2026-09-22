"use client";

import { useCallback, useState } from "react";

import { useIsMobile } from "@/src/hooks/use-mobile";
import { AutoplayToggle } from "../AutoplayToggle";
import { RevealOnScroll } from "../RevealOnScroll";
import { useAutoplayGate } from "../useAutoplayGate";
import { CampaignSourceCard } from "./CampaignSourceCard";
import { TrustMechanismCard, type StepTimer } from "./TrustMechanismCard";
import { TRUST_MECHANISMS } from "./trust-mechanisms";

const DWELL_MS = 6000;
const STEP_COUNT = TRUST_MECHANISMS.length;

export function TrustSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();
  // Autoplay only where the campaign and the step row are in view together.
  const autoplay = useAutoplayGate<HTMLDivElement>({ mediaQuery: "(min-width: 1024px)" });
  const { stop: stopAutoplay } = autoplay;

  // Phones get a plain numbered timeline, so nothing should read as selected.
  const shownIndex = isMobile ? -1 : activeIndex;

  const preview = useCallback((index: number) => setActiveIndex(index), []);
  const select = useCallback(
    (index: number) => {
      stopAutoplay();
      setActiveIndex(index);
    },
    [stopAutoplay],
  );
  const advance = useCallback(
    () => setActiveIndex((current) => (current + 1) % STEP_COUNT),
    [],
  );

  const timer: StepTimer | null =
    autoplay.isAvailable && autoplay.isAutoPlayOn
      ? { durationMs: DWELL_MS, isRunning: autoplay.isRunning, onComplete: advance }
      : null;

  return (
    <section
      id="trust"
      aria-labelledby="trust-title"
      className="scroll-mt-40 px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mx-auto max-w-3xl text-center">
          <h2
            id="trust-title"
            className="text-balance text-3xl font-semibold tracking-tight text-[#132726] sm:text-4xl"
          >
            Know what you&apos;re supporting
          </h2>
          <p className="mt-5 text-balance text-base leading-7 text-[#556a66] sm:text-lg">
            Every campaign shows you enough information to understand the healthcare
            need, the funding goal, and where your money is going.
          </p>
        </RevealOnScroll>

        <div ref={autoplay.containerRef} {...autoplay.holdProps} className="mt-12 lg:mt-16">
          <RevealOnScroll className="mx-auto max-w-4xl">
            <CampaignSourceCard activeIndex={shownIndex} onActivate={preview} />
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            {/* Stem joining the campaign to the step line, plus the pause control. */}
            <div className="relative hidden min-h-11 items-center justify-end lg:mt-6 lg:flex xl:mt-0 xl:h-14">
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-0 hidden h-[calc(100%+17px)] w-0.5 -translate-x-1/2 bg-[#e2dacb] xl:block"
              />
              {autoplay.isAvailable ? (
                <AutoplayToggle
                  isOn={autoplay.isAutoPlayOn}
                  onToggle={autoplay.toggle}
                  subject="the trust walkthrough"
                  className="relative"
                />
              ) : null}
            </div>

            <div className="relative mt-10 lg:mt-3 xl:mt-0">
              {/* Single-row step line, filled up to the active step. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[17px] top-[17px] hidden h-0.5 overflow-hidden rounded-full bg-[#e2dacb] xl:block"
                style={{ width: "calc((100% + 1rem) * 5 / 6)" }}
              >
                <div
                  className="h-full bg-[#0f766e] transition-[width] duration-500 ease-out motion-reduce:transition-none"
                  style={{ width: `${(Math.max(shownIndex, 0) / (STEP_COUNT - 1)) * 100}%` }}
                />
              </div>

              <ol
                aria-label="What you can see on every campaign"
                className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:gap-4"
              >
                {TRUST_MECHANISMS.map((mechanism, index) => (
                  <TrustMechanismCard
                    key={mechanism.id}
                    mechanism={mechanism}
                    index={index}
                    activeIndex={shownIndex}
                    timer={timer}
                    onPreview={preview}
                    onSelect={select}
                  />
                ))}
              </ol>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
