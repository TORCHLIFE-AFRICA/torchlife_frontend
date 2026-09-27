import Image from "next/image";
import type { ReactNode } from "react";
import { HeartHandshake, ShieldCheck } from "lucide-react";

import { formatMoney } from "@/src/components/dashboard/dashboard-helpers";
import { cn } from "@/src/lib/utils";
import { InitialsAvatar } from "./previews";
import {
  SAMPLE_CAMPAIGN as CAMPAIGN,
  SAMPLE_PROGRESS,
  SAMPLE_REMAINING,
} from "./sample-campaign";

type ZoneProps = {
  index: number;
  activeIndex: number;
  onActivate: (index: number) => void;
  className?: string;
  children: ReactNode;
};

/**
 * One region of the campaign, tagged with the number of the trust card that
 * explains it. The highlight only applies from `md` up, where the cards and
 * the campaign are compared side by side; on phones every region stays calm.
 */
function Zone({ index, activeIndex, onActivate, className, children }: ZoneProps) {
  const isActive = index === activeIndex;

  return (
    <div
      onMouseEnter={() => onActivate(index)}
      className={cn(
        "relative rounded-2xl border border-[#efe8db] bg-[#fdfbf7] p-3 transition-[background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none",
        isActive &&
          "md:border-[#0f766e] md:bg-[#f1f8f6] md:shadow-[0_0_0_4px_rgba(15,118,110,0.12)]",
        className,
      )}
    >
      <span
        className={cn(
          "absolute -top-2.5 right-3 grid size-5 place-items-center rounded-full bg-[#ece5d8] text-[0.62rem] font-semibold text-[#6f817d] transition-colors duration-300",
          isActive && "md:bg-[#0f766e] md:text-white",
        )}
      >
        {index + 1}
      </span>
      {children}
    </div>
  );
}

function ZoneLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#8b9a96]">
      {children}
    </p>
  );
}

/**
 * The campaign every trust mechanism points back to. Decorative: the six cards
 * beside it carry the meaning for assistive technology.
 */
export function CampaignSourceCard({
  activeIndex,
  onActivate,
}: {
  activeIndex: number;
  onActivate: (index: number) => void;
}) {
  const zone = { activeIndex, onActivate };
  const [latestUpdate] = CAMPAIGN.updates;

  return (
    <div
      aria-hidden="true"
      className="grid gap-4 rounded-[1.75rem] bg-white p-4 shadow-[0_30px_80px_-44px_rgba(8,28,25,0.55)] ring-1 ring-black/5 sm:p-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
    >
      <div className="grid content-start gap-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src={CAMPAIGN.photo}
            alt=""
            fill
            sizes="(min-width: 768px) 24rem, 90vw"
            className="object-cover"
            style={{ objectPosition: "center 55%" }}
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[0.66rem] font-semibold text-[#9f4334] shadow-sm">
            Urgent
          </span>
        </div>

        <Zone index={0} {...zone}>
          <div className="flex items-center gap-2.5">
            <InitialsAvatar className="size-9 text-xs" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#132726]">{CAMPAIGN.need}</p>
              <p className="truncate text-xs text-[#8b9a96]">
                {CAMPAIGN.patient.name}, {CAMPAIGN.patient.age} · {CAMPAIGN.hospital},{" "}
                {CAMPAIGN.patient.city}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs leading-5 text-[#556a66]">{CAMPAIGN.careRequired}.</p>
        </Zone>

        <Zone index={1} {...zone}>
          <div className="flex items-center gap-2">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#0f766e] text-white">
              <ShieldCheck className="size-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#132726]">Verified case</p>
              <p className="truncate text-[0.68rem] text-[#8b9a96]">
                Documents reviewed with {CAMPAIGN.verification.reviewedWith} ·{" "}
                {CAMPAIGN.verification.date}
              </p>
            </div>
          </div>
        </Zone>
      </div>

      <div className="grid content-start gap-4">
        <Zone index={2} {...zone}>
          <ZoneLabel>Where the money goes</ZoneLabel>
          <ul className="mt-2 space-y-1.5">
            {CAMPAIGN.breakdown.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-xs">
                <span className={`size-2 shrink-0 rounded-sm ${item.tone}`} />
                <span className="min-w-0 flex-1 truncate text-[#27413d]">{item.label}</span>
                <span className="shrink-0 font-medium tabular-nums text-[#132726]">
                  {formatMoney(item.amount)}
                </span>
              </li>
            ))}
          </ul>
        </Zone>

        <Zone index={3} {...zone}>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xl font-semibold tabular-nums text-[#132726]">
              {formatMoney(CAMPAIGN.raised)}
            </p>
            <p className="text-xs text-[#8b9a96]">
              raised of <span className="tabular-nums">{formatMoney(CAMPAIGN.goal)}</span>
            </p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e7e0d3]">
            <div
              className="h-full rounded-full bg-[#0f766e]"
              style={{ width: `${SAMPLE_PROGRESS}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-[#556a66]">
            <span className="font-semibold tabular-nums text-[#132726]">
              {formatMoney(SAMPLE_REMAINING)}
            </span>{" "}
            to go · {CAMPAIGN.supporters} supporters · {CAMPAIGN.daysLeft} days left
          </p>
        </Zone>

        <Zone index={4} {...zone}>
          <ZoneLabel>Latest update · {latestUpdate.date}</ZoneLabel>
          <p className="mt-1 text-xs font-semibold text-[#132726]">{latestUpdate.title}</p>
          <p className="text-xs text-[#556a66]">{latestUpdate.detail}</p>
        </Zone>

        <Zone index={5} {...zone} className="flex items-center gap-2.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#c89a2b]/15 text-[#8a6607]">
            <HeartHandshake className="size-3.5" />
          </span>
          <p className="text-xs text-[#556a66]">
            You supported this case with{" "}
            <span className="font-semibold tabular-nums text-[#132726]">
              {formatMoney(CAMPAIGN.yourSupport.amount)}
            </span>{" "}
            on {CAMPAIGN.yourSupport.date}
          </p>
        </Zone>
      </div>
    </div>
  );
}
