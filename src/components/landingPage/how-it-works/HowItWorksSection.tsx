"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { AutoplayToggle } from "../AutoplayToggle";
import { RevealOnScroll } from "../RevealOnScroll";
import { useAutoplayGate } from "../useAutoplayGate";
import { HOW_IT_WORKS_STAGES } from "./stages";

const LAST_INDEX = HOW_IT_WORKS_STAGES.length - 1;
const AUTO_ADVANCE_MS = 5000;

export function HowItWorksSection() {
  const trackRef = useRef<HTMLOListElement>(null);
  // Index of a selection whose smooth scroll is still in flight.
  const pendingSelectionRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoplay = useAutoplayGate<HTMLDivElement>();
  const { shouldReduceMotion, isRunning: isAutoPlayRunning, stop: stopAutoplay } =
    autoplay;

  /**
   * Card bounds in the track's own scroll coordinates. `offsetLeft` is static
   * and measured from the same origin as `scrollLeft`, so the two compare
   * directly — subtracting a baseline would skew them by the inline padding.
   */
  const getCardBounds = (track: HTMLElement, index: number) => {
    const card = (Array.from(track.children) as HTMLElement[])[index];

    if (!card) {
      return null;
    }

    return { start: card.offsetLeft, end: card.offsetLeft + card.offsetWidth };
  };

  const selectIndex = useCallback(
    (index: number) => {
      setActiveIndex(index);
      pendingSelectionRef.current = index;

      const track = trackRef.current;
      if (!track) {
        return;
      }

      const bounds = getCardBounds(track, index);
      if (!bounds) {
        return;
      }

      // Scroll the smallest amount that brings the card fully into view. The
      // last cards can never sit flush left, so aligning to the start would
      // clamp and leave the selection unreachable. The track's own padding is
      // reused as a gutter, so a revealed card never sits hard against an edge.
      const gutter = Number.parseFloat(getComputedStyle(track).paddingLeft) || 0;
      const maxScroll = track.scrollWidth - track.clientWidth;
      const viewStart = track.scrollLeft;
      const viewEnd = viewStart + track.clientWidth;
      let next = viewStart;

      if (bounds.start - gutter < viewStart) {
        next = bounds.start - gutter;
      } else if (bounds.end + gutter > viewEnd) {
        next = bounds.end + gutter - track.clientWidth;
      }

      next = Math.max(0, Math.min(next, maxScroll));

      if (next === viewStart) {
        pendingSelectionRef.current = null;
        return;
      }

      track.scrollTo({
        left: next,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
    },
    [shouldReduceMotion],
  );

  const selectFromUser = useCallback(
    (index: number) => {
      stopAutoplay();
      selectIndex(index);
    },
    [selectIndex, stopAutoplay],
  );

  useEffect(() => {
    if (!isAutoPlayRunning) {
      return;
    }

    // Keyed on activeIndex, so each advance schedules the next one and any
    // manual navigation restarts the dwell time rather than cutting it short.
    const timer = window.setTimeout(() => {
      selectIndex((activeIndex + 1) % HOW_IT_WORKS_STAGES.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [isAutoPlayRunning, activeIndex, selectIndex]);

  // After a swipe, move the selection only if it scrolled out of view, so
  // manual scrolling never fights the tabs.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    let frame = 0;

    const syncActiveIndex = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const cards = Array.from(track.children) as HTMLElement[];
        const viewStart = track.scrollLeft;
        const viewEnd = viewStart + track.clientWidth;

        const isFullyVisible = (card: HTMLElement) =>
          card.offsetLeft >= viewStart - 1 &&
          card.offsetLeft + card.offsetWidth <= viewEnd + 1;

        // A selection's own smooth scroll passes through frames where the
        // target is not yet visible; letting those through would snap the
        // highlight back to whichever card is currently leftmost.
        const pending = pendingSelectionRef.current;
        if (pending !== null) {
          const pendingCard = cards[pending];
          if (pendingCard && isFullyVisible(pendingCard)) {
            pendingSelectionRef.current = null;
          }
          return;
        }

        setActiveIndex((current) => {
          const activeCard = cards[current];
          if (activeCard && isFullyVisible(activeCard)) {
            return current;
          }

          const nextVisible = cards.findIndex(isFullyVisible);
          return nextVisible === -1 ? current : nextVisible;
        });
      });
    };

    // Any direct interaction hands control back to the scroll position, so a
    // stalled programmatic scroll can never freeze the highlight.
    const releasePendingSelection = () => {
      pendingSelectionRef.current = null;
      stopAutoplay();
    };
    const manualEvents = ["pointerdown", "wheel", "touchstart", "keydown"] as const;

    track.addEventListener("scroll", syncActiveIndex, { passive: true });
    manualEvents.forEach((eventName) =>
      track.addEventListener(eventName, releasePendingSelection, { passive: true }),
    );

    return () => {
      track.removeEventListener("scroll", syncActiveIndex);
      manualEvents.forEach((eventName) =>
        track.removeEventListener(eventName, releasePendingSelection),
      );
      cancelAnimationFrame(frame);
    };
  }, [stopAutoplay]);

  return (
    <section
      id="how-it-works"
      className="scroll-mt-40 px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <div
            ref={autoplay.containerRef}
            className="overflow-hidden rounded-[2rem] bg-[linear-gradient(155deg,#0d3a34_0%,#124e46_55%,#0f766e_100%)] py-8 shadow-[0_30px_90px_-48px_rgba(8,28,25,0.8)] sm:py-10 lg:py-12"
          >
            <div className="flex flex-col gap-6 px-5 sm:px-7 lg:flex-row lg:items-end lg:justify-between lg:px-10">
              <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                How TorchLife connects the pregnancy healthcare ecosystem
              </h2>

              <div className="flex shrink-0 items-center gap-2">
                {autoplay.isAvailable ? (
                  <AutoplayToggle
                    isOn={autoplay.isAutoPlayOn}
                    onToggle={autoplay.toggle}
                    subject="automatic stage rotation"
                    tone="dark"
                    className="mr-1"
                  />
                ) : null}
                <button
                  type="button"
                  aria-label="Previous stage"
                  disabled={activeIndex === 0}
                  onClick={() => selectFromUser(activeIndex - 1)}
                  className="grid size-11 place-items-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-35"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next stage"
                  disabled={activeIndex === LAST_INDEX}
                  onClick={() => selectFromUser(activeIndex + 1)}
                  className="grid size-11 place-items-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-35"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>

            <div {...autoplay.holdProps}>
            <div
              role="group"
              aria-label="Jump to a stage"
              className="mt-6 flex flex-wrap gap-2 px-5 sm:px-7 lg:px-10"
            >
              {HOW_IT_WORKS_STAGES.map((stage, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={stage.id}
                    type="button"
                    aria-current={isActive ? "step" : undefined}
                    onClick={() => selectFromUser(index)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                      isActive
                        ? "bg-white text-[#0d3a34]"
                        : "bg-white/10 text-white/75 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    {stage.title}
                  </button>
                );
              })}
            </div>

            <ol
              ref={trackRef}
              tabIndex={0}
              aria-label="Stages of the TorchLife process"
              className="relative mt-8 flex snap-x snap-mandatory scroll-pl-5 gap-4 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:scroll-pl-7 sm:px-7 lg:snap-none lg:scroll-pl-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
            >
              {HOW_IT_WORKS_STAGES.map((stage, index) => {
                const isActive = index === activeIndex;

                return (
                  <li
                    key={stage.id}
                    className="w-[17rem] shrink-0 snap-start sm:w-[19rem] lg:w-[21rem]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                      <Image
                        src={stage.photo}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 21rem, (min-width: 640px) 19rem, 17rem"
                        className="object-cover"
                        style={{ objectPosition: stage.photoPosition }}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,28,25,0)_45%,rgba(8,28,25,0.85)_100%)]" />
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.16em] text-[#0d3a34]">
                        {stage.step}
                      </span>
                      <p className="absolute inset-x-3 bottom-3 text-[0.7rem] font-medium leading-tight text-white/90">
                        {stage.party}
                      </p>
                    </div>

                    <h3
                      className={`mt-4 text-lg font-semibold transition-colors duration-300 ${
                        isActive ? "text-white" : "text-white/55"
                      }`}
                    >
                      {stage.title}
                    </h3>
                    <p
                      className={`mt-2 text-sm leading-6 transition-colors duration-300 ${
                        isActive ? "text-white/70" : "text-white/40"
                      }`}
                    >
                      {stage.description}
                    </p>
                  </li>
                );
              })}
            </ol>
            </div>

            <div className="mt-6 px-5 sm:px-7 lg:px-10">
              <div
                className="h-0.5 overflow-hidden rounded-full bg-white/15"
                role="presentation"
              >
                <div
                  className="h-full rounded-full bg-white/70 transition-[width] duration-300 motion-reduce:transition-none"
                  style={{
                    width: `${((activeIndex + 1) / HOW_IT_WORKS_STAGES.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
