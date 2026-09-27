import { RevealOnScroll } from "../RevealOnScroll";
import { StoryVideo } from "./StoryVideo";
import { SITE_METRICS } from "./site-metrics";

/**
 * Published figures and the TorchLife story film. The numbers come from
 * `site-metrics.ts`, which is the single place they may be changed; see the
 * note there before editing any of them.
 */
export function MetricsSection() {
  return (
    <section
      id="impact"
      aria-labelledby="impact-title"
      className="scroll-mt-40 px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <RevealOnScroll className="mx-auto max-w-3xl text-center">
          <h2
            id="impact-title"
            className="text-balance text-3xl font-semibold tracking-tight text-[#132726] sm:text-4xl"
          >
            Supported by{" "}
            <span className="text-[#0f766e]">people and organizations</span> making
            pregnancy care possible
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.08} className="mt-10 sm:mt-12">
          <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-x-4 gap-y-6 rounded-[1.5rem] bg-white px-5 py-6 shadow-[0_30px_90px_-56px_rgba(8,28,25,0.55)] ring-1 ring-black/5 sm:gap-x-6 sm:rounded-[2rem] sm:px-7 lg:grid-cols-4">
            {SITE_METRICS.map((metric) => (
              <li key={metric.id} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#0f766e]/10 text-[#0f766e]"
                >
                  <metric.icon className="size-5" />
                </span>

                {/* The caption leads in the source order so a screen reader
                    hears "Cases verified, 100%"; `order` puts the figure on top. */}
                <div className="flex min-w-0 flex-col">
                  <p className="order-2 mt-1 text-[11px] leading-4 text-[#6c7f7b]">
                    {metric.label}
                  </p>
                  <p className="order-1 text-[1.5rem] font-semibold leading-none tracking-tight text-[#132726] sm:text-[1.75rem]">
                    {metric.value}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </RevealOnScroll>

        <RevealOnScroll delay={0.12} className="mt-12 sm:mt-16">
          <div id="youtube" className="scroll-mt-40">
            <StoryVideo />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
