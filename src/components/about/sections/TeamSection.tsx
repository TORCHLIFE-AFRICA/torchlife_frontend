import Image from "next/image";

import { RevealOnScroll } from "../../landingPage/RevealOnScroll";
import { TEAM_MEMBERS } from "../about-assets";
import { SECTION_CLASS, SectionHeading } from "../primitives";

/**
 * The people building TorchLife. Members come only from `about-assets.ts`,
 * and the grid is left out entirely until real entries exist there, so this
 * section can never show an invented person or a placeholder face.
 */
export function TeamSection() {
  return (
    <section id="team" aria-labelledby="team-title" className={SECTION_CLASS}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="team-title"
          eyebrow="The people behind TorchLife"
          title="Built by people who care about the problem"
        >
          <p>
            TorchLife is being built by people across technology, healthcare, research,
            design, marketing, operations, partnerships, and community.
          </p>
        </SectionHeading>

        {TEAM_MEMBERS.length > 0 ? (
          <ul className="mt-12 grid gap-x-5 gap-y-10 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_MEMBERS.map((member, index) => (
              <li key={member.name}>
                <RevealOnScroll delay={(index % 4) * 0.05}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#e9e2d6]">
                    <Image
                      src={member.photo.src}
                      alt={member.photo.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-[#132726]">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f766e]">
                    {member.role}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#556a66]">
                    {member.contribution}
                  </p>
                </RevealOnScroll>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
