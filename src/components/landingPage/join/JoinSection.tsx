import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { COMMUNITY_WHATSAPP_URL, PARTNER_MAILTO } from "../contact-links";
import { RevealOnScroll } from "../RevealOnScroll";
import { SITE_PHOTOS } from "../site-photos";

const JOIN_CARDS = [
  {
    id: "community",
    title: "Join our community",
    description:
      "TorchLife is built with the people who believe in it. Follow the cases as they open, share them further, and help shape what we build next.",
    cta: "Join the WhatsApp community",
    href: COMMUNITY_WHATSAPP_URL,
    isExternal: true,
    photo: SITE_PHOTOS.communityGathering,
    // Captioned by role, never as a specific patient: see site-photos.ts.
    alt: "Supporters gathered together in conversation",
  },
  {
    id: "partner",
    title: "Partner with us",
    description:
      "Bring your hospital, organization, or network into this. Tell us where you can help, and we'll show you exactly what that could look like.",
    cta: "Partner with us",
    href: PARTNER_MAILTO,
    isExternal: false,
    photo: SITE_PHOTOS.partnersHandshake,
    alt: "Two partners shaking hands after a meeting",
  },
] as const;

/**
 * Closing invitations. The cards sit across the top edge of a deep band, so
 * the page resolves into a single colour instead of stopping at the footer.
 */
export function JoinSection() {
  return (
    <section
      id="join"
      aria-labelledby="join-title"
      className="relative px-4 sm:px-6 lg:px-8"
    >
      {/* The band the cards overlap. Fixed heights keep the overlap sensible
          once the cards stack on narrow screens. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-[#0f4d46] sm:h-52 md:h-72"
      />

      <h2 id="join-title" className="sr-only">
        Get involved with TorchLife
      </h2>

      <div className="relative mx-auto max-w-5xl pb-14 sm:pb-16">
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
          {JOIN_CARDS.map((card, index) => (
            // h-full so both cards match height and their buttons line up.
            <RevealOnScroll key={card.id} delay={index * 0.08} className="h-full">
              <article className="flex h-full flex-col rounded-[1.5rem] bg-white p-3 shadow-[0_30px_90px_-50px_rgba(8,28,25,0.6)] sm:rounded-[1.75rem]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.15rem] bg-[#e9e2d6] sm:rounded-[1.35rem]">
                  <Image
                    src={card.photo}
                    alt={card.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 520px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col px-2 pb-2 pt-5 sm:px-3 sm:pb-3">
                  <h3 className="text-xl font-semibold tracking-tight text-[#132726] sm:text-2xl">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#556a66]">
                    {card.description}
                  </p>

                  <div className="mt-6 flex flex-1 items-end">
                    <a
                      href={card.href}
                      {...(card.isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group inline-flex items-center gap-2 rounded-full bg-[#0f766e]/10 px-4 py-2.5 text-sm font-medium text-[#0f4d46] transition-colors hover:bg-[#0f766e]/18 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]"
                    >
                      {card.cta}
                      {card.isExternal ? (
                        <span className="sr-only">(opens in a new tab)</span>
                      ) : null}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                    </a>
                  </div>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
