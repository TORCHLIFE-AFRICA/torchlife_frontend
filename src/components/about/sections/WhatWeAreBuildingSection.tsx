import { ArrowDown, ArrowRight } from "lucide-react";

import { cn } from "@/src/lib/utils";
import { RevealOnScroll } from "../../landingPage/RevealOnScroll";
import { SYSTEM_STAGES, type Horizon } from "../about-content";
import {
  HORIZON_CARD_STYLES,
  HorizonBadge,
  SECTION_CLASS,
  SectionHeading,
} from "../primitives";

const LEGEND = [
  { horizon: "today", text: "What TorchLife does now." },
  { horizon: "next", text: "What we are working toward next." },
  { horizon: "future", text: "The direction we are building in." },
  { horizon: "long-term", text: "The outcome we are building for." },
] as const satisfies readonly { horizon: Horizon; text: string }[];

export function WhatWeAreBuildingSection() {
  const lastIndex = SYSTEM_STAGES.length - 1;

  return (
    <section id="what-we-are-building" aria-labelledby="building-title" className={SECTION_CLASS}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="building-title"
          eyebrow="What we are building"
          title="Crowdfunding is where we start. It is not where we stop."
        >
          <p>
            Our current product focuses on verified financial support for
            pregnancy-related healthcare needs.
          </p>
          <p>
            As we learn from real families, supporters, healthcare providers, and
            partners, we are building toward a broader system for trusted maternal
            healthcare support.
          </p>
        </SectionHeading>

        <RevealOnScroll delay={0.1} className="mt-12 sm:mt-16">
          <ol
            aria-label="The system TorchLife is building toward"
            className="grid gap-8 lg:grid-cols-6 lg:gap-5"
          >
            {SYSTEM_STAGES.map((stage, index) => (
              <li
                key={stage.label}
                className={cn(
                  "relative flex flex-col rounded-[1.35rem] p-5",
                  HORIZON_CARD_STYLES[stage.horizon],
                )}
              >
                <HorizonBadge horizon={stage.horizon} className="self-start" />
                <p className="mt-4 text-base font-semibold leading-snug tracking-tight text-[#132726]">
                  {stage.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#556a66]">{stage.detail}</p>

                {index < lastIndex ? (
                  <>
                    <ArrowDown
                      aria-hidden="true"
                      className="absolute -bottom-6 left-1/2 size-4 -translate-x-1/2 text-[#9aa9a5] lg:hidden"
                    />
                    <ArrowRight
                      aria-hidden="true"
                      className="absolute -right-[18px] top-1/2 hidden size-4 -translate-y-1/2 text-[#9aa9a5] lg:block"
                    />
                  </>
                ) : null}
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-[1.35rem] bg-[#efe8dc]/70 p-5 sm:p-6">
            <p className="text-sm font-medium text-[#132726]">
              Only the stages marked Today exist as TorchLife products. The rest
              describe where we are heading, not what we offer now.
            </p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {LEGEND.map((item) => (
                <div key={item.horizon} className="flex items-center gap-3">
                  <dt>
                    <HorizonBadge horizon={item.horizon} />
                  </dt>
                  <dd className="text-xs leading-5 text-[#556a66]">{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
