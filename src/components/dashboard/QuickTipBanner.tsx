import { Lightbulb } from "lucide-react";

import { Button } from "@/src/components/ui/button";

type QuickTipBannerProps = {
  message: string;
};

export default function QuickTipBanner({ message }: QuickTipBannerProps) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 rounded-full bg-amber-100 p-2 text-amber-700">
            <Lightbulb className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-amber-900">Quick tip</p>
            <p className="text-sm text-amber-800">{message}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
        >
          Share
        </Button>
      </div>
    </section>
  );
}
