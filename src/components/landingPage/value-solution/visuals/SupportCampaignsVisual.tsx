import Image from "next/image";

import { SITE_PHOTOS } from "../../site-photos";
import { Floating, MockProgress, VisualBackdrop } from "./primitives";

const campaigns = [
  {
    need: "Emergency caesarean section",
    photo: SITE_PHOTOS.caseCaesarean,
    required: "₦850,000",
    raised: "₦612,000",
    progress: 72,
    position: "left-[24px] top-[92px]",
    delay: 0,
  },
  {
    need: "Pre-eclampsia treatment",
    photo: SITE_PHOTOS.casePreEclampsia,
    required: "₦420,000",
    raised: "₦189,000",
    progress: 45,
    position: "left-[64px] top-[212px]",
    delay: 1.2,
  },
  {
    need: "Neonatal intensive care",
    photo: SITE_PHOTOS.caseNeonatal,
    required: "₦1,200,000",
    raised: "₦324,000",
    progress: 27,
    position: "left-[104px] top-[332px]",
    delay: 2.4,
  },
] as const;

/**
 * Card 2 — supporters on the backdrop, with a cascade of campaign cards
 * previewing the real browse feed.
 */
export function SupportCampaignsVisual() {
  return (
    <>
      <VisualBackdrop
        photo={SITE_PHOTOS.supportersPhone}
        // Anchored low and zoomed slightly to crop the razor wire along the top
        // of the original frame out of view.
        photoPosition="center bottom"
        photoClassName="origin-bottom scale-[1.14]"
        className="left-[256px] top-[30px] h-[480px] w-[360px]"
      />

      {campaigns.map((campaign) => (
        <Floating
          key={campaign.need}
          className={campaign.position}
          delay={campaign.delay}
        >
          <div className="flex w-[380px] items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_22px_50px_-26px_rgba(8,28,25,0.55)] ring-1 ring-black/5">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
              <Image src={campaign.photo} alt="" fill sizes="64px" className="object-cover" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.74rem] font-semibold text-[#132726]">
                {campaign.need}
              </p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-[0.7rem] font-semibold text-[#0f766e]">
                  {campaign.raised}
                </span>
                <span className="text-[0.58rem] text-[#8b9a96]">
                  raised of {campaign.required}
                </span>
              </div>
              <MockProgress value={campaign.progress} className="mt-2 h-1" />
            </div>

            <div className="shrink-0 rounded-full bg-[#c89a2b] px-3 py-1.5 text-[0.6rem] font-semibold text-[#17220f]">
              Support
            </div>
          </div>
        </Floating>
      ))}
    </>
  );
}
