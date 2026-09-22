import { Check, TrendingUp } from "lucide-react";

import { SITE_PHOTOS } from "../../site-photos";
import {
  AppWindowFrame,
  Floating,
  MockInitials,
  MockProgress,
  MockStatusDot,
  MockToast,
  VisualBackdrop,
} from "./primitives";

const programmes = [
  { name: "Safe Delivery Fund", allocated: "₦4.2M", progress: 78 },
  { name: "Neonatal Care Grant", allocated: "₦2.8M", progress: 54 },
  { name: "Rural Outreach", allocated: "₦1.6M", progress: 31 },
] as const;

const monthlyCases = [38, 52, 44, 68, 61, 84];

const supportedCases = [
  { initials: "AO", need: "Caesarean section", status: "Funded" },
  { initials: "NE", need: "Neonatal ICU", status: "In care" },
  { initials: "KT", need: "Pre-eclampsia", status: "Outcome" },
] as const;

/**
 * Card 3 — an organisation partner dashboard: identify, fund, then track impact.
 */
export function OrganizationDashboardVisual() {
  const peakCases = Math.max(...monthlyCases);

  return (
    <>
      <VisualBackdrop
        photo={SITE_PHOTOS.csrLead}
        photoPosition="center 35%"
        className="left-[300px] top-[24px] h-[410px] w-[316px]"
      />

      <Floating className="left-[24px] top-[112px] w-[440px]">
        <AppWindowFrame>
          <div className="space-y-2.5 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="grid size-5 place-items-center rounded-md bg-[#0f766e] text-[0.5rem] font-bold text-white">
                  H
                </span>
                <p className="text-[0.62rem] font-semibold text-[#132726]">
                  Horizon Foundation
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[0.52rem] font-semibold text-[#0f766e]">
                <MockStatusDot />
                Live
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-[#eee6d8] bg-[#fbf8f2] p-2.5">
                <p className="text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-[#8b9a96]">
                  Active programmes
                </p>
                <p className="mt-0.5 text-lg font-semibold leading-none text-[#132726]">3</p>
                <div className="mt-2 space-y-1.5">
                  {programmes.map((programme) => (
                    <div key={programme.name}>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-[0.54rem] font-medium text-[#27413d]">
                          {programme.name}
                        </span>
                        <span className="shrink-0 text-[0.52rem] font-semibold text-[#0f766e]">
                          {programme.allocated}
                        </span>
                      </div>
                      <MockProgress value={programme.progress} className="mt-1 h-[3px]" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#eee6d8] bg-[#fbf8f2] p-2.5">
                <p className="text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-[#8b9a96]">
                  Cases supported
                </p>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <p className="text-lg font-semibold leading-none text-[#132726]">347</p>
                  <span className="inline-flex items-center gap-0.5 text-[0.52rem] font-semibold text-[#0f766e]">
                    <TrendingUp className="size-2.5" />
                    18%
                  </span>
                </div>
                <div className="mt-2 flex h-12 items-end gap-1">
                  {monthlyCases.map((count, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t-sm bg-[#0f766e]/75"
                      style={{ height: `${(count / peakCases) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#eee6d8] bg-white p-2.5">
              <div className="flex items-baseline justify-between">
                <p className="text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-[#8b9a96]">
                  Total impact
                </p>
                <p className="text-[0.74rem] font-semibold text-[#132726]">₦12.4M deployed</p>
              </div>
              <div className="mt-2 space-y-1">
                {supportedCases.map((item) => (
                  <div key={item.need} className="flex items-center gap-2">
                    <MockInitials initials={item.initials} className="size-5 text-[0.42rem]" />
                    <span className="min-w-0 flex-1 truncate text-[0.54rem] font-medium text-[#27413d]">
                      {item.need}
                    </span>
                    <span className="shrink-0 rounded-full bg-[#0f766e]/10 px-1.5 py-0.5 text-[0.46rem] font-semibold text-[#0f766e]">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AppWindowFrame>
      </Floating>

      <Floating className="left-[392px] top-[452px]" delay={1.8}>
        <MockToast
          icon={<Check className="size-4" />}
          title="Case #TL-2481 funded"
          detail="Tracking outcome"
        />
      </Floating>
    </>
  );
}
