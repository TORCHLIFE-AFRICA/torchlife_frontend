"use client";

import { useState, type ComponentType } from "react";
import { Send, Sprout, UsersRound } from "lucide-react";

import type { ImpactArea } from "@/src/components/dashboard/types";

type ImpactAreasSectionProps = {
  areas: ImpactArea[];
};

function normalizeProgressLabel(value: string) {
  return value.replace(/\s*of\s*/i, "/");
}

const iconById: Record<string, ComponentType<{ className?: string }>> = {
  boost: Sprout,
  share: Send,
  team: UsersRound,
};

export default function ImpactAreasSection({ areas }: ImpactAreasSectionProps) {
  const [selectedAreaId, setSelectedAreaId] = useState<string>(areas[0]?.id ?? "");

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Biggest impact areas</h2>
      <div className="space-y-3" role="radiogroup" aria-label="Impact area progress">
        {areas.map((area) => {
          const progress = normalizeProgressLabel(area.progressLabel);
          const radioId = `impact-progress-${area.id}`;
          const Icon = iconById[area.id] ?? Sprout;

          return (
            <article
              key={area.id}
              className="flex items-center gap-4 rounded-2xl border bg-card p-4 transition-shadow hover:shadow-sm"
            >
              <div className="rounded-xl bg-muted p-3">
                <Icon className="size-5 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">{area.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    id={radioId}
                    type="radio"
                    name="impact-area-progress"
                    className="size-4 accent-emerald-600"
                    checked={selectedAreaId === area.id}
                    onChange={() => setSelectedAreaId(area.id)}
                  />
                  <label htmlFor={radioId} className="cursor-pointer">
                    {progress}
                  </label>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
