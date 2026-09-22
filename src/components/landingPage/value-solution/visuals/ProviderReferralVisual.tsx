import { ArrowUpRight, Check, FileText } from "lucide-react";

import { SITE_PHOTOS } from "../../site-photos";
import {
  Floating,
  MockField,
  MockInitials,
  MockToast,
  TabletFrame,
  VisualBackdrop,
} from "./primitives";

const documents = ["Ultrasound_report.pdf", "Cost_estimate.pdf"];

/**
 * Card 4 — a clinician with a device on the backdrop, the referral they are
 * completing on a tablet, and TorchLife's confirmation of the hand-off.
 */
export function ProviderReferralVisual() {
  return (
    <>
      <VisualBackdrop
        photo={SITE_PHOTOS.clinicianDevice}
        photoPosition="center 35%"
        className="left-[156px] top-[24px] h-[384px] w-[460px]"
      />

      <Floating className="left-[24px] top-[190px]">
        <TabletFrame className="w-[384px] max-w-none">
          <div className="space-y-2 p-3">
            <div className="flex items-center gap-2 border-b border-[#eee6d8] pb-2">
              <MockInitials initials="AB" className="size-6 text-[0.5rem]" />
              <div className="min-w-0">
                <p className="truncate text-[0.6rem] font-semibold text-[#132726]">
                  Sister A. Bello
                </p>
                <p className="text-[0.5rem] text-[#8b9a96]">Maternity · Ward 3</p>
              </div>
              <span className="ml-auto shrink-0 rounded-full bg-[#c89a2b]/15 px-2 py-0.5 text-[0.48rem] font-semibold text-[#8a6607]">
                Needs review
              </span>
            </div>

            <p className="text-[0.66rem] font-semibold text-[#132726]">
              Patient requires support
            </p>

            <div className="grid grid-cols-2 gap-2">
              <MockField label="Healthcare need" value="Emergency caesarean" />
              <MockField label="Estimated cost" value="₦850,000" />
            </div>

            <div>
              <p className="text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-[#8b9a96]">
                Supporting documents
              </p>
              <div className="mt-1 grid grid-cols-2 gap-1">
                {documents.map((document) => (
                  <div
                    key={document}
                    className="flex items-center gap-1.5 rounded-lg border border-[#e4ddd0] bg-[#fbf8f2] px-2 py-1.5"
                  >
                    <FileText className="size-2.5 shrink-0 text-[#0f766e]" />
                    <span className="truncate text-[0.52rem] font-medium text-[#27413d]">
                      {document}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-1 rounded-full bg-[#0f766e] py-1.5 text-[0.6rem] font-semibold text-white">
              Refer to TorchLife
              <ArrowUpRight className="size-3" />
            </div>
          </div>
        </TabletFrame>
      </Floating>

      <Floating className="left-[396px] top-[430px]" delay={1.5}>
        <MockToast
          icon={<Check className="size-4" />}
          title="Referral received"
          detail="TorchLife review started"
        />
      </Floating>
    </>
  );
}
