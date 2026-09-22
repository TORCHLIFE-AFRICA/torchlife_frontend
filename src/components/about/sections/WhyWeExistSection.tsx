import { Building2, CircleHelp, HandHeart, UsersRound } from "lucide-react";

import { RevealOnScroll } from "../../landingPage/RevealOnScroll";
import { SECTION_CLASS, SectionHeading } from "../primitives";

const NEED_STEPS = [
  { label: "Pregnancy progressing", tone: "bg-[#0f766e]" },
  { label: "A complication appears", tone: "bg-[#c89a2b]" },
  { label: "Treatment is needed now", tone: "bg-[#b1362a]" },
] as const;

const HELP_SOURCES = [
  { label: "Family and friends", icon: HandHeart },
  { label: "The wider community", icon: UsersRound },
  { label: "Organizations", icon: Building2 },
] as const;

const GAP_QUESTIONS = ["Is the need real?", "Where will support go?"] as const;

/**
 * The gap, drawn rather than photographed: a need on one side, willing help on
 * the other, and the two questions that keep them apart. It makes the point
 * without a distressed patient in frame, and it contains no invented amounts
 * or case details.
 */
function GapVisual() {
  return (
    <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-0">
      <div className="rounded-[1.5rem] bg-white p-6 shadow-[0_24px_70px_-48px_rgba(8,28,25,0.5)] ring-1 ring-black/5 sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6c7f7b]">
          The healthcare need
        </p>
        <ol className="mt-6 space-y-5">
          {NEED_STEPS.map((step, index) => (
            <li key={step.label} className="relative flex items-center gap-3 pl-1">
              {index < NEED_STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute left-[9px] top-5 h-[calc(100%+0.25rem)] w-px bg-[#e2dacb]"
                />
              ) : null}
              <span aria-hidden="true" className={`relative size-3 shrink-0 rounded-full ${step.tone}`} />
              <span className="text-sm font-medium text-[#183330]">{step.label}</span>
            </li>
          ))}
        </ol>
        <p className="mt-7 border-t border-[#efe8dc] pt-4 text-sm leading-6 text-[#556a66]">
          The cost arrives before the money does.
        </p>
      </div>

      {/* The gap itself: a broken connector, with the questions sitting in the break. */}
      <div className="relative flex flex-col items-center justify-center py-2 md:w-56 md:px-4 md:py-0">
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 border-l border-dashed border-[#c9bea9] md:inset-x-0 md:inset-y-auto md:left-0 md:top-1/2 md:h-px md:w-full md:translate-x-0 md:border-l-0 md:border-t"
        />
        <div className="relative space-y-2 bg-[#f7f2ea] px-2 py-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b1362a]">
            The gap
          </p>
          <ul className="flex flex-col items-center gap-2">
            {GAP_QUESTIONS.map((question) => (
              <li
                key={question}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#183330] shadow-sm ring-1 ring-black/5"
              >
                <CircleHelp aria-hidden="true" className="size-3.5 text-[#c89a2b]" />
                {question}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-[1.5rem] bg-white p-6 shadow-[0_24px_70px_-48px_rgba(8,28,25,0.5)] ring-1 ring-black/5 sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6c7f7b]">
          The willingness to help
        </p>
        <ul className="mt-6 space-y-3">
          {HELP_SOURCES.map((source) => (
            <li
              key={source.label}
              className="flex items-center gap-3 rounded-2xl bg-[#f7f2ea] px-3 py-2.5"
            >
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-xl bg-white text-[#0f766e] ring-1 ring-black/5"
              >
                <source.icon className="size-4" />
              </span>
              <span className="text-sm font-medium text-[#183330]">{source.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-7 border-t border-[#efe8dc] pt-4 text-sm leading-6 text-[#556a66]">
          Help moves once people are confident it should.
        </p>
      </div>
    </div>
  );
}

export function WhyWeExistSection() {
  return (
    <section id="why" aria-labelledby="why-title" className={SECTION_CLASS}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="why-title"
          eyebrow="Why TorchLife exists"
          title="Pregnancy can become expensive when families least expect it."
        >
          <p>
            A pregnancy may begin as an ordinary part of life and suddenly become
            financially difficult when complications, emergency treatment, or
            unexpected healthcare costs arise.
          </p>
          <p>
            At the same time, people and organizations may be willing to help but need
            confidence that the need is real and that their support is going somewhere
            meaningful.
          </p>
          <p className="font-medium text-[#132726]">TorchLife began by focusing on that gap.</p>
        </SectionHeading>

        <RevealOnScroll delay={0.1} className="mx-auto mt-12 max-w-5xl sm:mt-16">
          <GapVisual />
        </RevealOnScroll>
      </div>
    </section>
  );
}
