import { RevealOnScroll } from "../../landingPage/RevealOnScroll";
import { SITE_METRICS, type SiteMetric } from "../../landingPage/metrics/site-metrics";
import { SECTION_CLASS, SectionHeading } from "../primitives";

type ProgressSectionProps = {
  /**
   * Defaults to the verified figures in `site-metrics.ts`, the same source the
   * homepage reads, so the two pages cannot disagree. Pass fetched figures here
   * once a stats endpoint exists.
   */
  metrics?: readonly SiteMetric[];
};

/**
 * Laid out like a report rather than a banner: ruled columns and restrained
 * type, so the figures read as records rather than promotion.
 */
export function ProgressSection({ metrics = SITE_METRICS }: ProgressSectionProps) {
  return (
    <section id="progress" aria-labelledby="progress-title" className={SECTION_CLASS}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="progress-title" eyebrow="Our progress" title="Progress so far" />

        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <li key={metric.id}>
              <RevealOnScroll delay={index * 0.05} className="border-t-2 border-[#0f766e] pt-5">
                {/* Label first in the source so it is announced before the figure. */}
                <div className="flex flex-col">
                  <p className="order-2 mt-3 text-sm font-semibold text-[#132726]">
                    {metric.label}
                  </p>
                  <p className="order-1 text-4xl font-semibold tabular-nums tracking-tight text-[#132726] sm:text-5xl">
                    {metric.value}
                  </p>
                </div>
              </RevealOnScroll>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
