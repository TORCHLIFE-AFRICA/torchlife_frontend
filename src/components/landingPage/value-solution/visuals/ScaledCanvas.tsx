"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/src/lib/utils";

/** Fixed design size every value visual is art-directed against. */
export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 540;

/**
 * Renders a fixed-size composition and scales it uniformly to fit its column,
 * so product mockups keep their exact proportions at every breakpoint instead
 * of reflowing. Never scales above the design size.
 */
export function ScaledCanvas({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isMeasured, setIsMeasured] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    const updateScale = () => {
      setScale(Math.min(1, frame.clientWidth / CANVAS_WIDTH));
      setIsMeasured(true);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      className={cn(
        "relative mx-auto w-full max-w-[640px]",
        // Until measured the canvas renders unscaled and would widen the page
        // on small screens. Once scaled it fits exactly, so the clip is lifted
        // and floating elements' soft shadows are not cut off at the edge.
        isMeasured ? "overflow-visible" : "overflow-hidden",
        className,
      )}
      style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
