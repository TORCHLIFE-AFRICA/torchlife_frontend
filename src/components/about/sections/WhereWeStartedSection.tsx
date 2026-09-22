import { cn } from "@/src/lib/utils";
import { RevealOnScroll } from "../../landingPage/RevealOnScroll";
import { ORIGIN_STAGES } from "../about-content";
import { SECTION_CLASS, SectionHeading } from "../primitives";

/**
 * How the company came to be, told as a product evolution: numbered stages on
 * one track, ending on the stage TorchLife is in now. The stages describe the
 * approach, not dated history, so nothing here asserts a milestone.
 */
export function WhereWeStartedSection() {
  const lastIndex = ORIGIN_STAGES.length - 1;

  return (
    <section id="where-we-started" aria-labelledby="started-title" className={SECTION_CLASS}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            id="started-title"
            eyebrow="Where we started"
            title="We started with one problem."
          >
            <p>
              How do you help a pregnant woman access needed healthcare support when
              the money is not available at the moment it is needed?
            </p>
          </SectionHeading>

          <RevealOnScroll
            delay={0.06}
            className="space-y-4 text-base leading-7 text-[#556a66] sm:text-lg sm:leading-8 lg:pt-10"
          >
            <p className="text-xl font-semibold tracking-tight text-[#132726] sm:text-2xl">
              Our first answer is verified financial support.
            </p>
            <p>
              We connect genuine pregnancy healthcare needs with people and
              organizations willing to help.
            </p>
            <p>
              Every case teaches us something about trust, healthcare access, financial
              pressure, and the systems families need around pregnancy.
            </p>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.1} className="mt-12 sm:mt-16">
          <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_30px_90px_-60px_rgba(8,28,25,0.55)] ring-1 ring-black/5 sm:rounded-[2rem] sm:p-10">
            <ol aria-label="How TorchLife began" className="relative grid gap-8 lg:grid-cols-6 lg:gap-5">
              {/* The track: vertical beside the stages on phones, across them on desktop. */}
              <span
                aria-hidden="true"
                className="absolute bottom-4 left-4 top-4 w-px bg-[#e2dacb] lg:bottom-auto lg:left-4 lg:right-0 lg:top-4 lg:h-px lg:w-auto"
              />

              {ORIGIN_STAGES.map((stage, index) => {
                const isCurrent = index === lastIndex;

                return (
                  <li
                    key={stage.label}
                    aria-current={isCurrent ? "step" : undefined}
                    className="relative flex gap-4 lg:flex-col lg:gap-0"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "relative grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold tabular-nums",
                        isCurrent
                          ? "bg-[#0f766e] text-white ring-4 ring-[#0f766e]/15"
                          : "bg-white text-[#0f4d46] ring-1 ring-[#d8cfbe]",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="lg:mt-5">
                      <p className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#132726]">
                        {stage.label}
                        {isCurrent ? (
                          <span className="rounded-full bg-[#0f766e]/10 px-2 py-0.5 text-[10px] tracking-[0.16em] text-[#0f766e]">
                            Now
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#556a66]">{stage.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
