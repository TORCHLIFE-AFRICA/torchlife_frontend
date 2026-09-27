"use client";

import { Pause, Play } from "lucide-react";

import { cn } from "@/src/lib/utils";

const toneClasses = {
  dark: "border-white/25 text-white hover:bg-white/10 focus-visible:outline-white",
  light:
    "border-[#d8cfbe] bg-white text-[#0f766e] hover:bg-[#f1ebe0] focus-visible:outline-[#0f766e]",
} as const;

/**
 * Pause control for auto-advancing content (WCAG 2.2.2). `subject` completes
 * the label, e.g. "automatic stage rotation".
 */
export function AutoplayToggle({
  isOn,
  onToggle,
  subject,
  tone = "light",
  className,
}: {
  isOn: boolean;
  onToggle: () => void;
  subject: string;
  tone?: keyof typeof toneClasses;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={isOn ? `Pause ${subject}` : `Play ${subject}`}
      aria-pressed={isOn}
      onClick={onToggle}
      className={cn(
        "grid size-11 place-items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        toneClasses[tone],
        className,
      )}
    >
      {isOn ? <Pause className="size-4" /> : <Play className="size-4" />}
    </button>
  );
}
