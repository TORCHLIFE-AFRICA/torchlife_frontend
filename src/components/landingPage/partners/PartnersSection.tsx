"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

import { AutoplayToggle } from "../AutoplayToggle";
import { RevealOnScroll } from "../RevealOnScroll";
import { useAutoplayGate } from "../useAutoplayGate";
import { PARTNERS, type Partner } from "./partners";

const CARD_CLASS =
  "grid h-28 w-52 place-items-center rounded-2xl border border-[#e8e0d2] bg-white sm:h-32 sm:w-60";

function PartnerCard({
  partner,
  isDuplicate,
}: {
  partner: Partner;
  /** The trailing copy that completes the loop: shown, but not reachable. */
  isDuplicate?: boolean;
}) {
  const content = partner.logoSrc ? (
    <Image
      src={partner.logoSrc}
      alt={partner.name}
      width={160}
      height={56}
      className="max-h-12 w-auto object-contain px-5"
    />
  ) : (
    // One weight, one size, one tracking for every partner, so the strip reads
    // as a set of wordmarks rather than a row of mismatched type.
    <span className="text-balance px-4 text-center text-[0.78rem] font-semibold uppercase leading-snug tracking-[0.13em] text-[#132726] sm:text-[0.85rem]">
      {partner.name}
    </span>
  );

  if (partner.href && !isDuplicate) {
    return (
      <Link
        href={partner.href}
        className={`${CARD_CLASS} transition-colors hover:border-[#0f766e]/45`}
      >
        {content}
      </Link>
    );
  }

  return <div className={CARD_CLASS}>{content}</div>;
}

/**
 * A "working with" strip, modelled on a logo wall but built from type. The
 * track holds two copies of the list and travels exactly one copy's width, so
 * the loop closes seamlessly; the copy is hidden from assistive tech. Motion
 * runs only while the strip is on screen and unhovered, and a visitor who
 * prefers reduced motion gets a plain scrollable row instead.
 */
export function PartnersSection() {
  const autoplay = useAutoplayGate<HTMLDivElement>();
  const setCount = autoplay.isAvailable ? 2 : 1;

  return (
    <section
      id="partners"
      aria-labelledby="partners-title"
      className="scroll-mt-40 px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-white/70 py-9 shadow-[0_24px_80px_-52px_rgba(8,28,25,0.45)] ring-1 ring-black/5 sm:py-11">
        <RevealOnScroll className="px-6 sm:px-8 lg:px-10">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-10">
              <h2
                id="partners-title"
                className="shrink-0 text-3xl font-semibold tracking-tight text-[#132726] sm:text-4xl"
              >
                Partners
              </h2>
              <p className="max-w-md text-base leading-7 text-[#556a66]">
                The hospitals, clinics, and organizations we work with to make
                verified maternal care possible.
              </p>
            </div>

            {autoplay.isAvailable ? (
              <AutoplayToggle
                isOn={autoplay.isAutoPlayOn}
                onToggle={autoplay.toggle}
                subject="the partner strip"
                className="hidden shrink-0 sm:grid"
              />
            ) : null}
          </div>
        </RevealOnScroll>

        <div
          ref={autoplay.containerRef}
          {...autoplay.holdProps}
          className={`mt-8 sm:mt-10 ${
            autoplay.isAvailable ? "overflow-hidden" : "overflow-x-auto px-6 sm:px-8"
          }`}
        >
          <ul
            aria-label="TorchLife partners"
            className={`flex w-max ${autoplay.isAvailable ? "partner-marquee" : ""}`}
            style={{ animationPlayState: autoplay.isRunning ? "running" : "paused" }}
          >
            {Array.from({ length: setCount }, (_, setIndex) => (
              <Fragment key={setIndex}>
                {PARTNERS.map((partner) => (
                  <li
                    key={`${setIndex}-${partner.name}`}
                    // The margin lives here rather than in a `gap`, so each copy
                    // of the list measures exactly half the track.
                    className="mr-4 sm:mr-5"
                    aria-hidden={setIndex === 1 ? true : undefined}
                  >
                    <PartnerCard partner={partner} isDuplicate={setIndex === 1} />
                  </li>
                ))}
              </Fragment>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
