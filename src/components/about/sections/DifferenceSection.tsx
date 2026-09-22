import { cn } from "@/src/lib/utils";
import { RevealOnScroll } from "../../landingPage/RevealOnScroll";
import { VALUES } from "../about-content";
import { SECTION_CLASS, SectionHeading } from "../primitives";

/**
 * Column spans for an asymmetric layout: two wide cards, then three narrow.
 * On the two-column tablet grid the fifth card takes the full row instead of
 * leaving a hole.
 */
const SPANS = [
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-2",
  "lg:col-span-2",
  "md:col-span-2 lg:col-span-2",
] as const;

export function DifferenceSection() {
  return (
    <section
      id="different"
      aria-labelledby="different-title"
      className={SECTION_CLASS}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="different-title"
          eyebrow="Our approach"
          title="What makes TorchLife different"
        />

        <ul className="mt-12 grid gap-4 sm:mt-14 md:grid-cols-2 lg:grid-cols-6">
          {VALUES.map((value, index) => {
            // Verification leads, dark, because every other commitment rests on it.
            const isLead = index === 0;

            return (
              <li key={value.title} className={SPANS[index]}>
                <RevealOnScroll delay={index * 0.05} className="h-full">
                  <div
                    className={cn(
                      "relative flex h-full min-h-[14rem] flex-col overflow-hidden rounded-[1.5rem] p-6 sm:p-7",
                      isLead
                        ? "bg-[#0f4d46] text-white"
                        : "bg-white ring-1 ring-black/5",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute right-5 top-3 text-7xl font-semibold tabular-nums tracking-tighter",
                        isLead ? "text-white/[0.07]" : "text-[#132726]/[0.05]",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-11 place-items-center rounded-2xl",
                        isLead
                          ? "bg-white/10 text-[#e2c987]"
                          : "bg-[#0f766e]/10 text-[#0f766e]",
                      )}
                    >
                      <value.icon className="size-5" />
                    </span>

                    <div className="mt-auto pt-10">
                      <h3
                        className={cn(
                          "text-xl font-semibold tracking-tight",
                          isLead ? "text-white" : "text-[#132726]",
                        )}
                      >
                        {value.title}
                      </h3>
                      <p
                        className={cn(
                          "mt-2 max-w-md text-sm leading-6",
                          isLead ? "text-white/75" : "text-[#556a66]",
                        )}
                      >
                        {value.line}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
