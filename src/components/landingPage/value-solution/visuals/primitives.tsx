import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/src/lib/utils";

/*
 * Everything in this folder is composed on the fixed ScaledCanvas, so these
 * pieces are positioned in canvas pixels and deliberately avoid responsive
 * variants — `sm:` / `lg:` would react to the viewport, not to the canvas.
 */

/**
 * The soft rounded shape each visual is staged on, optionally holding a real
 * photograph. Position and size come from `className` in canvas pixels.
 */
export function VisualBackdrop({
  photo,
  photoPosition = "center",
  photoClassName,
  className,
}: {
  photo?: string;
  photoPosition?: string;
  /** Extra framing for a photo, e.g. a zoom to crop out a distracting edge. */
  photoClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn("absolute overflow-hidden rounded-[3rem] bg-[#dcece8]", className)}>
      {photo ? (
        <Image
          src={photo}
          alt=""
          fill
          sizes="(min-width: 1024px) 420px, 70vw"
          className={cn("object-cover", photoClassName)}
          style={{ objectPosition: photoPosition }}
        />
      ) : null}
    </div>
  );
}

/**
 * A product UI element floating over the backdrop. Reuses the hero's gentle
 * float; staggered delays keep neighbouring elements out of step.
 */
export function Floating({
  className,
  delay = 0,
  children,
}: {
  className?: string;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("landing-chip-float absolute", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

/**
 * Initials avatar for a named person in a mockup. Named patients and staff
 * never get a stock photo, so no real face reads as a specific person.
 */
export function MockInitials({
  initials,
  className,
}: {
  initials: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-[#dcece8] font-semibold text-[#0f766e] ring-1 ring-black/5",
        className,
      )}
    >
      {initials}
    </span>
  );
}

/** Small floating status toast, used to show a hand-off or confirmation. */
export function MockToast({
  icon,
  title,
  detail,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-[0_22px_50px_-24px_rgba(8,28,25,0.6)] ring-1 ring-black/5">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#0f766e] text-white">
        {icon}
      </span>
      <div>
        <p className="text-[0.72rem] font-semibold text-[#132726]">{title}</p>
        <p className="text-[0.62rem] text-[#6f817d]">{detail}</p>
      </div>
    </div>
  );
}

/** Portrait handset bezel used by the campaign-application mockup. */
export function PhoneFrame({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-[15.5rem] shrink-0 rounded-[2rem] bg-[#132726] p-[0.35rem] shadow-[0_34px_70px_-30px_rgba(8,28,25,0.6)]",
        className,
      )}
    >
      <div className="overflow-hidden rounded-[1.7rem] bg-white">
        <div className="flex items-center justify-between px-4 pb-1.5 pt-3">
          <span className="text-[0.5rem] font-semibold text-[#6f817d]">9:41</span>
          <span className="h-1.5 w-12 rounded-full bg-[#132726]/85" />
          <span className="text-[0.5rem] font-semibold text-[#6f817d]">TorchLife</span>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Landscape tablet bezel used by the provider-referral mockup. */
export function TabletFrame({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-[24rem] rounded-[1.5rem] bg-[#132726] p-[0.4rem] shadow-[0_34px_70px_-30px_rgba(8,28,25,0.6)]",
        className,
      )}
    >
      <div className="overflow-hidden rounded-[1.2rem] bg-white">{children}</div>
    </div>
  );
}

/** Desktop application chrome used by the organisation-dashboard mockup. */
export function AppWindowFrame({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-[1.25rem] border border-[#dfd5c3] bg-white shadow-[0_30px_70px_-34px_rgba(8,28,25,0.5)]",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-[#eee6d8] bg-[#faf6ef] px-3 py-2">
        <span className="size-2 rounded-full bg-[#e3b7ad]" />
        <span className="size-2 rounded-full bg-[#e8d5a6]" />
        <span className="size-2 rounded-full bg-[#b8d6cf]" />
        <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-[0.5rem] font-medium text-[#6f817d] ring-1 ring-black/5">
          torchlife.co/partners
        </span>
      </div>
      {children}
    </div>
  );
}

/** Labelled form row, styled to read as a filled product input. */
export function MockField({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-[#8b9a96]">
        {label}
      </p>
      <div className="mt-1 rounded-lg border border-[#e4ddd0] bg-[#fbf8f2] px-2.5 py-1.5 text-[0.6rem] font-medium text-[#27413d]">
        {value}
      </div>
    </div>
  );
}

export function MockProgress({
  value,
  className,
  barClassName = "bg-[#0f766e]",
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-[#e7e0d3]", className)}>
      <div className={cn("h-full rounded-full", barClassName)} style={{ width: `${clamped}%` }} />
    </div>
  );
}

export function MockStatusDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex size-1.5", className)}>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />
      <span className="relative inline-flex size-1.5 rounded-full bg-current" />
    </span>
  );
}
