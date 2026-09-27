"use client";

import { useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
} from "react";

type AutoplayGateOptions = {
  /** Only offer autoplay while this media query matches, e.g. wide layouts. */
  mediaQuery?: string;
};

/**
 * Decides when auto-advancing content may move. It runs only while its
 * container is on screen, the tab is visible, nothing inside is hovered or
 * focused, and the visitor has not asked for reduced motion. Explicit
 * navigation should call `stop`; the pause control calls `toggle`.
 */
export function useAutoplayGate<T extends HTMLElement>({
  mediaQuery,
}: AutoplayGateOptions = {}) {
  const containerRef = useRef<T>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isAutoPlayOn, setIsAutoPlayOn] = useState(true);
  const [isHeld, setIsHeld] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [matchesMedia, setMatchesMedia] = useState(!mediaQuery);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.35 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const syncTabVisibility = () =>
      setIsTabVisible(document.visibilityState === "visible");

    syncTabVisibility();
    document.addEventListener("visibilitychange", syncTabVisibility);
    return () =>
      document.removeEventListener("visibilitychange", syncTabVisibility);
  }, []);

  useEffect(() => {
    if (!mediaQuery) {
      return;
    }

    const query = window.matchMedia(mediaQuery);
    const syncMedia = () => setMatchesMedia(query.matches);

    syncMedia();
    query.addEventListener("change", syncMedia);
    return () => query.removeEventListener("change", syncMedia);
  }, [mediaQuery]);

  const isAvailable = matchesMedia && !shouldReduceMotion;
  const isRunning =
    isAvailable && isAutoPlayOn && !isHeld && isInView && isTabVisible;

  /** Spread onto the region whose hover or focus should hold the motion. */
  const holdProps = useMemo(
    () => ({
      onMouseEnter: () => setIsHeld(true),
      onMouseLeave: () => setIsHeld(false),
      onFocusCapture: () => setIsHeld(true),
      onBlurCapture: (event: FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsHeld(false);
        }
      },
    }),
    [],
  );

  const stop = useCallback(() => setIsAutoPlayOn(false), []);
  const toggle = useCallback(() => setIsAutoPlayOn((current) => !current), []);

  return {
    containerRef,
    shouldReduceMotion,
    isAutoPlayOn,
    isAvailable,
    isRunning,
    holdProps,
    stop,
    toggle,
  };
}
