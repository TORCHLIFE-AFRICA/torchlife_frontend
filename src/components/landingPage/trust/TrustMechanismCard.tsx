"use client";

import type { CSSProperties } from "react";

import { cn } from "@/src/lib/utils";
import type { TrustMechanism } from "./trust-mechanisms";

export type StepTimer = {
  durationMs: number;
  isRunning: boolean;
  onComplete: () => void;
};

/**
 * Numbered node on the step line. While autoplay is on, the active node's ring
 * fills over one dwell; its `animationend` is what advances the step, so a
 * paused animation freezes the visual and the timing together.
 */
function StepNode({
  number,
  isActive,
  isComplete,
  timer,
}: {
  number: number;
  isActive: boolean;
  isComplete: boolean;
  timer: StepTimer | null;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative z-10 grid size-9 shrink-0 place-items-center rounded-full border-2 bg-[#f7f2ea] text-sm font-semibold transition-colors duration-300",
        isActive
          ? "border-[#0f766e] text-[#0f766e]"
          : isComplete
            ? "border-[#9fcfc6] text-[#0f766e]"
            : "border-[#ddd3c1] text-[#8b9a96]",
        timer && "border-[#cfe6e1]",
      )}
    >
      {timer ? (
        <svg viewBox="0 0 36 36" className="absolute -inset-0.5 size-9 -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="17"
            fill="none"
            stroke="#0f766e"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1}
            onAnimationEnd={timer.onComplete}
            className="autoplay-step-timer"
            style={
              {
                "--step-duration": `${timer.durationMs}ms`,
                animationPlayState: timer.isRunning ? "running" : "paused",
              } as CSSProperties
            }
          />
        </svg>
      ) : null}
      {number}
    </span>
  );
}

/**
 * One trust mechanism: its step node, copy, and a close-up preview of the
 * campaign region it explains. The whole column is one tab stop.
 */
export function TrustMechanismCard({
  mechanism,
  index,
  activeIndex,
  timer,
  onPreview,
  onSelect,
}: {
  mechanism: TrustMechanism;
  index: number;
  activeIndex: number;
  timer: StepTimer | null;
  onPreview: (index: number) => void;
  onSelect: (index: number) => void;
}) {
  const Preview = mechanism.preview;
  const isActive = index === activeIndex;
  const isComplete = activeIndex >= 0 && index < activeIndex;

  return (
    <li
      onMouseEnter={() => onPreview(index)}
      className={cn(
        "relative flex gap-4 md:flex-col md:gap-3",
        // Phone layout is a vertical timeline: a rail runs down to the next node.
        "before:absolute before:-bottom-5 before:left-[17px] before:top-11 before:w-0.5 before:bg-[#e2dacb] last:before:hidden md:before:hidden",
      )}
    >
      <StepNode
        number={index + 1}
        isActive={isActive}
        isComplete={isComplete}
        timer={isActive ? timer : null}
      />

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col rounded-2xl border border-[#e8decb] bg-[#fbf6ee] p-4 transition-[background-color,border-color,box-shadow,transform] duration-300 motion-reduce:transform-none motion-reduce:transition-none",
          isActive &&
            "-translate-y-1 border-[#0f766e] bg-white shadow-[0_22px_50px_-30px_rgba(15,118,110,0.7)]",
        )}
      >
        <h3 className="text-base font-semibold leading-snug text-[#132726]">
          <button
            type="button"
            aria-current={isActive ? "step" : undefined}
            onClick={() => onSelect(index)}
            onFocus={() => onPreview(index)}
            className="text-left outline-none after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-[#0f766e] focus-visible:after:ring-offset-4 focus-visible:after:ring-offset-[#f7f2ea]"
          >
            {mechanism.title}
          </button>
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#556a66]">{mechanism.description}</p>

        {/* Decorative close-up: the copy above carries the meaning. */}
        <div aria-hidden="true" className="mt-auto pt-4">
          <Preview />
        </div>
      </div>
    </li>
  );
}
