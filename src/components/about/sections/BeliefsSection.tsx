import { RevealOnScroll } from "../../landingPage/RevealOnScroll";
import { PRINCIPLES } from "../about-content";
import { SectionHeading } from "../primitives";

/**
 * A statement, not a feature grid: one principle per row at display size, on
 * the page's one dark band so it reads as the moment the page slows down.
 */
export function BeliefsSection() {
  return (
    <section
      id="beliefs"
      aria-labelledby="beliefs-title"
      className="scroll-mt-40 px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#071c1a] px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <div
          aria-hidden="true"
          className="absolute -right-32 -top-32 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(15,118,110,0.35),transparent_65%)]"
        />

        <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.6fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              id="beliefs-title"
              eyebrow="What we believe"
              title="Our principles"
              tone="dark"
            />
          </div>

          <ol>
            {PRINCIPLES.map((principle, index) => (
              <li key={principle} className="border-t border-white/10 first:border-t-0">
                <RevealOnScroll
                  delay={index * 0.04}
                  // The first row drops its top padding so it lines up with the heading.
                  className={`grid grid-cols-[2.5rem_1fr] gap-4 sm:grid-cols-[3.5rem_1fr] ${
                    index === 0 ? "pb-6 sm:pb-7" : "py-6 sm:py-7"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="pt-1.5 text-sm font-semibold tabular-nums text-[#e2c987] sm:pt-2"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-balance text-xl font-medium leading-snug tracking-tight text-white sm:text-2xl lg:text-[1.75rem]">
                    {principle}
                  </p>
                </RevealOnScroll>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
