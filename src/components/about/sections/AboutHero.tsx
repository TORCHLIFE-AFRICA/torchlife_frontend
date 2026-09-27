import Image from "next/image";

import { RevealOnScroll } from "../../landingPage/RevealOnScroll";
import { ABOUT_HERO_PHOTO } from "../about-assets";

/**
 * Opens on the company rather than on a cause: a plain statement of what
 * TorchLife builds, then the team who build it. The photograph only renders
 * once a real team image is supplied in `about-assets.ts`.
 */
export function AboutHero() {
  return (
    <section
      aria-labelledby="about-title"
      className="relative overflow-hidden px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8"
    >
      {/* A faint grid: the one decorative nod to the product side of the story. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[linear-gradient(to_right,rgba(19,39,38,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(19,39,38,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top_left,black_20%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.12),transparent_55%)]"
      />

      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="max-w-4xl">
          <p className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#0f766e] shadow-sm ring-1 ring-black/5">
            About TorchLife
          </p>
          <h1
            id="about-title"
            className="mt-6 text-balance text-4xl font-semibold tracking-tight text-[#132726] sm:text-5xl lg:text-6xl lg:leading-[1.05]"
          >
            Building better ways to support pregnancy healthcare
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#556a66] sm:text-lg sm:leading-8">
            TorchLife is building trusted infrastructure around maternal healthcare,
            starting with verified financial support for pregnancy-related healthcare
            needs.
          </p>
        </RevealOnScroll>

        {ABOUT_HERO_PHOTO ? (
          <RevealOnScroll delay={0.1} className="mt-12 sm:mt-16">
            <figure className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/65 p-2 shadow-[0_40px_120px_-52px_rgba(10,30,28,0.4)] sm:rounded-[2rem] sm:p-3">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.35rem] sm:aspect-[2/1] sm:rounded-[1.6rem]">
                <Image
                  src={ABOUT_HERO_PHOTO.src}
                  alt={ABOUT_HERO_PHOTO.alt}
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover"
                  style={{ objectPosition: ABOUT_HERO_PHOTO.position }}
                />
              </div>
            </figure>
          </RevealOnScroll>
        ) : null}
      </div>
    </section>
  );
}
