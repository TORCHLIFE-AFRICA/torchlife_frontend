"use client";

import { useMemo, useSyncExternalStore } from "react";

type CountdownParts = {
  expired: boolean;
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

let now = Date.now();
const listeners = new Set<() => void>();
let timerStarted = false;

function emit() {
  now = Date.now();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (!timerStarted) {
    timerStarted = true;
    setInterval(emit, 1000);
  }

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return now;
}

function toCountdown(deadline?: Date | null, currentTime?: number): CountdownParts {
  if (!deadline) {
    return {
      expired: true,
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const totalMs = Math.max(0, deadline.getTime() - (currentTime ?? Date.now()));
  const totalSeconds = Math.floor(totalMs / 1000);

  return {
    expired: totalMs <= 0,
    totalMs,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function formatCountdown(parts: CountdownParts) {
  if (parts.expired) {
    return "Expired";
  }

  return `${parts.days}d ${parts.hours}h ${parts.minutes}m ${parts.seconds}s`;
}

export function useCountdown(deadline?: Date | null) {
  const currentTime = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return useMemo(() => toCountdown(deadline, currentTime), [deadline, currentTime]);
}
