"use client";

import { RevealOnScroll } from "../RevealOnScroll";
import { ValueFeatureCard } from "./ValueFeatureCard";
import { VALUE_CARDS } from "./value-cards";

export function ValueSolutionSection() {
  return (
    <section
      id="value-solution"
      className="scroll-mt-40 px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mx-auto max-w-4xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-[#132726] sm:text-4xl">
            Helping pregnant women with verified healthcare needs connect with people
            and organizations willing to make a difference.
          </h2>
          <p className="mt-5 text-balance text-base leading-7 text-[#556a66] sm:text-lg">
            One platform. Different ways to make care possible.
          </p>
        </RevealOnScroll>

        <div className="mt-16 space-y-20 sm:space-y-24 lg:mt-20 lg:space-y-28">
          {VALUE_CARDS.map((card) => (
            <ValueFeatureCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
