import { Check, Paperclip } from "lucide-react";

import { SITE_PHOTOS } from "../../site-photos";
import {
  Floating,
  MockField,
  MockProgress,
  MockToast,
  PhoneFrame,
  VisualBackdrop,
} from "./primitives";

const documents = ["Scan_result.pdf", "Hospital_bill.jpg"];

/**
 * Card 1 — an expectant mother on the backdrop (face out of frame, since it
 * sits beside a named form), with the campaign application on a handset.
 */
export function CreateCampaignVisual() {
  return (
    <>
      <VisualBackdrop
        photo={SITE_PHOTOS.pregnancyHands}
        photoPosition="62% center"
        className="left-[40px] top-[36px] h-[468px] w-[360px]"
      />

      <Floating className="left-[330px] top-[44px]">
        <PhoneFrame>
          <div className="px-4 pb-5">
            <div className="flex items-center justify-between">
              <p className="text-[0.7rem] font-semibold text-[#132726]">New campaign</p>
              <span className="rounded-full bg-[#0f766e]/10 px-2 py-0.5 text-[0.5rem] font-semibold text-[#0f766e]">
                Step 2 of 4
              </span>
            </div>
            <MockProgress value={50} className="mt-2" />

            <div className="mt-4 space-y-2.5">
              <MockField label="Patient information" value="Amaka O. · 28 · Lagos" />
              <MockField label="Healthcare need" value="Emergency caesarean section" />
              <MockField label="Amount required" value="₦850,000" />

              <div>
                <p className="text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-[#8b9a96]">
                  Supporting information
                </p>
                <div className="mt-1 space-y-1">
                  {documents.map((document) => (
                    <div
                      key={document}
                      className="flex items-center gap-1.5 rounded-lg border border-[#e4ddd0] bg-white px-2.5 py-1.5"
                    >
                      <Paperclip className="size-2.5 shrink-0 text-[#0f766e]" />
                      <span className="truncate text-[0.55rem] font-medium text-[#27413d]">
                        {document}
                      </span>
                      <Check className="ml-auto size-2.5 shrink-0 text-[#0f766e]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-full bg-[#0f766e] py-2 text-center text-[0.6rem] font-semibold text-white">
              Continue
            </div>
          </div>
        </PhoneFrame>
      </Floating>

      <Floating className="left-[16px] top-[396px]" delay={1.6}>
        <MockToast
          icon={<Check className="size-4" />}
          title="2 documents uploaded"
          detail="Ready for verification"
        />
      </Floating>
    </>
  );
}
