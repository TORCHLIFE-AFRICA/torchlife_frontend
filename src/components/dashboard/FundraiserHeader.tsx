import { ArrowRightLeft, Copy, PencilLine } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import type { FundraiserAction } from "@/src/components/dashboard/types";

type FundraiserHeaderProps = {
  fundraiserTitle: string;
  goalAmount: string;
  actions: FundraiserAction[];
};

const iconMap = {
  edit: PencilLine,
  "copy-link": Copy,
  transfer: ArrowRightLeft,
};

export default function FundraiserHeader({
  fundraiserTitle,
  goalAmount,
  actions,
}: FundraiserHeaderProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{fundraiserTitle}</h1>
        <div className="space-y-2">
          <p className="text-sm font-semibold">{goalAmount} goal</p>
          <div className="h-1.5 w-full rounded-full bg-muted">
            <div className="h-full w-[38%] rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action) => {
          const Icon = iconMap[action.id as keyof typeof iconMap];

          return (
            <Button
              key={action.id}
              type="button"
              variant={action.primary ? "default" : "outline"}
              className={cn(
                "transition-all",
                action.primary && "bg-emerald-600 text-white hover:bg-emerald-700"
              )}
            >
              {Icon ? <Icon className="size-4" /> : null}
              {action.label}
            </Button>
          );
        })}
      </div>
    </section>
  );
}
