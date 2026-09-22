import Image from "next/image";
import type { ReactNode } from "react";
import { Check, ShieldCheck } from "lucide-react";

import { formatMoney } from "@/src/components/dashboard/dashboard-helpers";
import { SITE_PHOTOS } from "../site-photos";
import {
  SAMPLE_CAMPAIGN as CAMPAIGN,
  SAMPLE_HISTORY,
  SAMPLE_PROGRESS,
  SAMPLE_REMAINING,
} from "./sample-campaign";

/*
 * Each preview is a close-up of one layer of SAMPLE_CAMPAIGN, rendered as a
 * small product widget. They are decorative (the card copy carries meaning)
 * and fluid, so they read at 190px wide as well as full width on mobile.
 */

export function PreviewShell({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-2.5 text-[0.7rem] leading-snug text-[#27413d] shadow-[0_10px_24px_-18px_rgba(8,28,25,0.55)] ring-1 ring-black/5">
      {children}
    </div>
  );
}

function PreviewLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-[#8b9a96]">
      {children}
    </p>
  );
}

export function InitialsAvatar({ className = "size-7 text-[0.6rem]" }: { className?: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-[#dcece8] font-semibold text-[#0f766e] ${className}`}
    >
      {CAMPAIGN.patient.initials}
    </span>
  );
}

export function CaseInformationPreview() {
  return (
    <PreviewShell>
      <div className="flex items-center gap-2">
        <InitialsAvatar />
        <div className="min-w-0">
          <p className="truncate font-semibold text-[#132726]">
            {CAMPAIGN.patient.name} · {CAMPAIGN.patient.age}
          </p>
          <p className="truncate text-[0.62rem] text-[#8b9a96]">
            {CAMPAIGN.patient.city} · {CAMPAIGN.hospital}
          </p>
        </div>
      </div>
      <div className="mt-2.5 space-y-2 border-t border-[#f0e9dc] pt-2">
        <div>
          <PreviewLabel>Healthcare need</PreviewLabel>
          <p className="mt-0.5 font-medium text-[#132726]">{CAMPAIGN.need}</p>
        </div>
        <div>
          <PreviewLabel>Why support is needed</PreviewLabel>
          <p className="mt-0.5 text-[#556a66]">{CAMPAIGN.whySupport}</p>
        </div>
      </div>
    </PreviewShell>
  );
}

export function VerificationPreview() {
  return (
    <PreviewShell>
      <div className="flex items-center gap-1.5 rounded-lg bg-[#0f766e] px-2 py-1.5 text-white">
        <ShieldCheck className="size-3.5 shrink-0" />
        <span className="font-semibold">Verified case</span>
      </div>
      <ul className="mt-2 space-y-1.5">
        {CAMPAIGN.verification.checks.map((check) => (
          <li key={check} className="flex items-center gap-1.5">
            <span className="grid size-3.5 shrink-0 place-items-center rounded-full bg-[#dcece8] text-[#0f766e]">
              <Check className="size-2.5" />
            </span>
            <span className="min-w-0 truncate">{check}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 border-t border-[#f0e9dc] pt-2 text-[0.6rem] text-[#8b9a96]">
        Reviewed with {CAMPAIGN.verification.reviewedWith} · {CAMPAIGN.verification.date}
      </p>
    </PreviewShell>
  );
}

export function FinancialBreakdownPreview() {
  return (
    <PreviewShell>
      <div className="flex h-2 overflow-hidden rounded-full">
        {CAMPAIGN.breakdown.map((item) => (
          <span
            key={item.label}
            className={item.tone}
            style={{ width: `${(item.amount / CAMPAIGN.goal) * 100}%` }}
          />
        ))}
      </div>
      <ul className="mt-2.5 space-y-1.5">
        {CAMPAIGN.breakdown.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <span className={`size-2 shrink-0 rounded-sm ${item.tone}`} />
            <span className="min-w-0 flex-1 leading-tight">{item.label}</span>
            <span className="shrink-0 font-medium tabular-nums text-[#132726]">
              {formatMoney(item.amount)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-baseline justify-between gap-2 border-t border-[#f0e9dc] pt-2">
        <span className="font-semibold text-[#132726]">Total required</span>
        <span className="font-semibold tabular-nums text-[#132726]">
          {formatMoney(CAMPAIGN.goal)}
        </span>
      </div>
      <p className="mt-1 text-[0.6rem] text-[#8b9a96]">Paid to {CAMPAIGN.hospital}</p>
    </PreviewShell>
  );
}

export function CampaignProgressPreview() {
  return (
    <PreviewShell>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-base font-semibold leading-tight tabular-nums text-[#132726]">
            {formatMoney(CAMPAIGN.raised)}
          </p>
          <p className="text-[0.62rem] text-[#8b9a96]">
            raised of {formatMoney(CAMPAIGN.goal)}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#0f766e]/10 px-1.5 py-0.5 text-[0.56rem] font-semibold text-[#0f766e]">
          Live
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e7e0d3]">
        <div
          className="h-full rounded-full bg-[#0f766e]"
          style={{ width: `${SAMPLE_PROGRESS}%` }}
        />
      </div>
      <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[0.62rem]">
        <div>
          <dt className="text-[#8b9a96]">Remaining</dt>
          <dd className="font-semibold tabular-nums text-[#132726]">
            {formatMoney(SAMPLE_REMAINING)}
          </dd>
        </div>
        <div>
          <dt className="text-[#8b9a96]">Supporters</dt>
          <dd className="font-semibold tabular-nums text-[#132726]">{CAMPAIGN.supporters}</dd>
        </div>
        <div>
          <dt className="text-[#8b9a96]">Funded</dt>
          <dd className="font-semibold tabular-nums text-[#132726]">{SAMPLE_PROGRESS}%</dd>
        </div>
        <div>
          <dt className="text-[#8b9a96]">Time left</dt>
          <dd className="font-semibold text-[#132726]">{CAMPAIGN.daysLeft} days</dd>
        </div>
      </dl>
    </PreviewShell>
  );
}

export function OutcomeUpdatesPreview() {
  const [latest, earlier] = CAMPAIGN.updates;

  return (
    <PreviewShell>
      <div className="flex gap-2">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
          <Image src={SITE_PHOTOS.newbornGrip} alt="" fill sizes="40px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-[0.58rem] font-semibold text-[#c89a2b]">New · {latest.date}</p>
          <p className="font-semibold text-[#132726]">{latest.title}</p>
          <p className="text-[0.62rem] text-[#556a66]">{latest.detail}</p>
        </div>
      </div>
      <div className="mt-2 flex gap-2 border-t border-[#f0e9dc] pt-2 text-[0.62rem]">
        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#0f766e]" />
        <p className="min-w-0 text-[#556a66]">
          <span className="font-medium text-[#132726]">{earlier.date}</span> · {earlier.title}
        </p>
      </div>
    </PreviewShell>
  );
}

const statusTone: Record<string, string> = {
  "In care": "bg-[#c89a2b]",
  Outcome: "bg-[#0f766e]",
  Funded: "bg-[#5aa99c]",
};

export function SupportHistoryPreview() {
  return (
    <PreviewShell>
      <PreviewLabel>Cases you&apos;ve supported</PreviewLabel>
      <ul className="mt-2 space-y-2">
        {SAMPLE_HISTORY.map((item) => (
          <li key={item.need} className="flex gap-2">
            <div className="relative size-8 shrink-0 overflow-hidden rounded-lg">
              <Image src={item.photo} alt="" fill sizes="32px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-[#132726]">{item.need}</p>
              <p className="truncate text-[0.6rem] tabular-nums text-[#8b9a96]">
                {formatMoney(item.amount)} · {item.date}
              </p>
              <p className="flex items-center gap-1 text-[0.6rem] text-[#556a66]">
                <span className={`size-1.5 shrink-0 rounded-full ${statusTone[item.status]}`} />
                <span className="truncate">
                  {item.status} · {item.latest}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </PreviewShell>
  );
}
