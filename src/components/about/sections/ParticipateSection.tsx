import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { RevealOnScroll } from "../../landingPage/RevealOnScroll";
import { PATHWAYS, type Pathway } from "../about-content";
import { SectionHeading } from "../primitives";

const CTA_CLASS =
  "group inline-flex items-center gap-2 rounded-full bg-[#0f766e]/10 px-4 py-2.5 text-sm font-medium text-[#0f4d46] transition-colors hover:bg-[#0f766e]/18 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]";

function PathwayCta({ pathway }: { pathway: Pathway }) {
  const content = (
    <>
      {pathway.cta}
      {pathway.isExternal ? <span className="sr-only">(opens in a new tab)</span> : null}
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
      />
    </>
  );

  // In-app routes go through the router; mail and outside links stay plain anchors.
  if (pathway.href.startsWith("/")) {
    return (
      <Link href={pathway.href} className={CTA_CLASS}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={pathway.href}
      {...(pathway.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={CTA_CLASS}
    >
      {content}
    </a>
  );
}

/**
 * The close of the page, on the same deep band the homepage ends on, so both
 * pages resolve into the footer the same way.
 */
export function ParticipateSection() {
  return (
    <section
      id="participate"
      aria-labelledby="participate-title"
      className="relative scroll-mt-40 px-4 sm:px-6 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-44 bg-[#0f4d46] sm:h-56 lg:h-40"
      />

      <div className="relative mx-auto max-w-7xl pb-14 sm:pb-16">
        <SectionHeading
          id="participate-title"
          eyebrow="Join what we are building"
          title="There is a place for you here."
          align="center"
        />

        <ul className="mt-12 grid gap-5 sm:mt-14 lg:grid-cols-3">
          {PATHWAYS.map((pathway, index) => (
            <li key={pathway.title}>
              <RevealOnScroll delay={index * 0.06} className="h-full">
                <div className="flex h-full flex-col rounded-[1.5rem] bg-white p-6 shadow-[0_30px_90px_-50px_rgba(8,28,25,0.6)] ring-1 ring-black/5 sm:rounded-[1.75rem] sm:p-7">
                  <span
                    aria-hidden="true"
                    className="grid size-11 place-items-center rounded-2xl bg-[#0f766e]/10 text-[#0f766e]"
                  >
                    <pathway.icon className="size-5" />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-[#132726] sm:text-2xl">
                    {pathway.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#556a66]">{pathway.line}</p>
                  <div className="mt-8 flex flex-1 items-end">
                    <PathwayCta pathway={pathway} />
                  </div>
                </div>
              </RevealOnScroll>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
