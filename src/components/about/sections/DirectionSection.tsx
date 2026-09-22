import { ArrowDown } from "lucide-react";

import { cn } from "@/src/lib/utils";
import { RevealOnScroll } from "../../landingPage/RevealOnScroll";
import { PILLARS, ROADMAP } from "../about-content";
import {
  HORIZON_CARD_STYLES,
  HorizonBadge,
  SECTION_CLASS,
  SectionHeading,
} from "../primitives";

/**
 * The four things TorchLife is built around, then the roadmap. The roadmap is
 * ambition, so it is labelled as direction in its heading, in a note beside it,
 * and on every stage; only the first stage describes something that exists.
 */
export function DirectionSection() {
  const lastIndex = ROADMAP.length - 1;

  return (
    <section id="direction" aria-labelledby="direction-title" className={SECTION_CLASS}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="direction-title"
          eyebrow="Where we are going"
          title="We are building for trust, integrity, and access."
        >
          <p>TorchLife is built around four things.</p>
        </SectionHeading>

        <ol className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar, index) => (
            <li key={pillar.title}>
              <RevealOnScroll
                delay={index * 0.05}
                className="h-full rounded-[1.5rem] bg-white p-6 ring-1 ring-black/5"
              >
                <span
                  aria-hidden="true"
                  className="text-sm font-semibold tabular-nums text-[#0f766e]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-[#132726]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#556a66]">{pillar.line}</p>
              </RevealOnScroll>
            </li>
          ))}
        </ol>

        <RevealOnScroll delay={0.1} className="mt-16 sm:mt-20">
          <div className="grid gap-10 rounded-[1.75rem] bg-[#efe8dc]/70 p-6 sm:rounded-[2rem] sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <h3
                id="roadmap-title"
                className="text-2xl font-semibold tracking-tight text-[#132726] sm:text-3xl"
              >
                Roadmap
              </h3>
              <p className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f766e] ring-1 ring-black/5">
                Direction, not a product list
              </p>
              <p className="mt-5 max-w-md text-sm leading-6 text-[#556a66] sm:text-base sm:leading-7">
                This is where TorchLife is heading. Only the first stage exists today;
                the stages after it describe our ambition, not services we currently
                offer.
              </p>
            </div>

            <ol aria-labelledby="roadmap-title">
              {ROADMAP.map((step, index) => (
                <li key={step.horizon}>
                  <div
                    className={cn(
                      "flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center sm:gap-5",
                      HORIZON_CARD_STYLES[step.horizon],
                    )}
                  >
                    <HorizonBadge
                      horizon={step.horizon}
                      className="self-start justify-center sm:w-28 sm:self-center"
                    />
                    <p className="text-base font-semibold tracking-tight text-[#132726] sm:text-lg">
                      {step.label}
                    </p>
                  </div>
                  {index < lastIndex ? (
                    <ArrowDown
                      aria-hidden="true"
                      className="mx-auto my-2 size-4 text-[#9aa9a5]"
                    />
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
