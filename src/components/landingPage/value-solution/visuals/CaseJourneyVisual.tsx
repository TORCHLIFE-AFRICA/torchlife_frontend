import { Check, Play } from "lucide-react";

import { SITE_PHOTOS } from "../../site-photos";
import {
  Floating,
  MockInitials,
  MockStatusDot,
  VisualBackdrop,
} from "./primitives";

const journey = [
  {
    stage: "Need",
    detail: "Emergency caesarean · ₦850,000 required",
    timestamp: "12 Mar",
    state: "done",
  },
  {
    stage: "Support",
    detail: "₦850,000 raised from 214 supporters",
    timestamp: "19 Mar",
    state: "done",
  },
  {
    stage: "Care",
    detail: "Funds released to Lagoon Maternity",
    timestamp: "21 Mar",
    state: "done",
  },
  {
    stage: "Outcome",
    detail: "Mother and baby discharged, both well",
    timestamp: "26 Mar",
    state: "done",
  },
  {
    stage: "Listen to their story",
    detail: "Ngozi shares what your support changed",
    timestamp: "2 Apr",
    state: "current",
  },
] as const;

/** Static waveform heights for the story player. */
const waveform = [30, 55, 40, 75, 50, 90, 60, 45, 80, 35, 65, 50, 70, 40, 55];

/**
 * Card 6 — a newborn's grip on the backdrop for the outcome, with the live case
 * record a supporter returns to and the story waiting at the end of it.
 */
export function CaseJourneyVisual() {
  return (
    <>
      <VisualBackdrop
        photo={SITE_PHOTOS.newbornGrip}
        photoPosition="center"
        className="left-[284px] top-[30px] h-[480px] w-[332px]"
      />

      <Floating className="left-[24px] top-[44px] w-[340px]">
        <div className="overflow-hidden rounded-[1.25rem] bg-white shadow-[0_26px_60px_-30px_rgba(8,28,25,0.6)] ring-1 ring-black/5">
          <div className="flex items-center gap-2.5 border-b border-[#f0e9dc] bg-[#fbf8f2] p-3">
            <MockInitials initials="NE" className="size-10 text-xs ring-2 ring-white" />
            <div className="min-w-0">
              <p className="truncate text-[0.74rem] font-semibold text-[#132726]">Ngozi E.</p>
              <p className="text-[0.54rem] text-[#8b9a96]">Case #TL-2481 · Lagos</p>
            </div>
            <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-[#0f766e]/10 px-2 py-0.5 text-[0.5rem] font-semibold text-[#0f766e]">
              <MockStatusDot />
              Outcome recorded
            </span>
          </div>

          <ol className="p-3">
            {journey.map((step, index) => {
              const isLast = index === journey.length - 1;

              return (
                <li key={step.stage} className="flex gap-2.5">
                  <div className="flex flex-col items-center">
                    <span
                      className={`grid size-4 shrink-0 place-items-center rounded-full ${
                        step.state === "current"
                          ? "bg-[#c89a2b] text-[#17220f]"
                          : "bg-[#0f766e] text-white"
                      }`}
                    >
                      {step.state === "current" ? (
                        <Play className="size-2 fill-current" />
                      ) : (
                        <Check className="size-2.5" />
                      )}
                    </span>
                    {!isLast ? <span className="my-0.5 w-px flex-1 bg-[#d8e2df]" /> : null}
                  </div>

                  <div className={isLast ? "" : "pb-3"}>
                    <div className="flex items-baseline gap-2">
                      <p className="text-[0.66rem] font-semibold text-[#132726]">{step.stage}</p>
                      <span className="text-[0.5rem] font-medium text-[#a3b0ac]">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[0.58rem] leading-relaxed text-[#6f817d]">
                      {step.detail}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Floating>

      <Floating className="left-[340px] top-[430px]" delay={1.4}>
        <div className="flex w-[250px] items-center gap-3 rounded-2xl bg-white px-3.5 py-3 shadow-[0_22px_50px_-24px_rgba(8,28,25,0.6)] ring-1 ring-black/5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#c89a2b] text-[#17220f]">
            <Play className="size-3.5 fill-current" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.66rem] font-semibold text-[#132726]">
              Ngozi&apos;s story
            </p>
            <div className="mt-1 flex h-4 items-center gap-[2px]">
              {waveform.map((height, index) => (
                <span
                  key={index}
                  className={`w-[3px] rounded-full ${index < 6 ? "bg-[#0f766e]" : "bg-[#d8e2df]"}`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
          <span className="shrink-0 text-[0.58rem] font-medium text-[#8b9a96]">1:24</span>
        </div>
      </Floating>
    </>
  );
}
