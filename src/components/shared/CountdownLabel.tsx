"use client";

import { formatCountdown, useCountdown } from "@/src/hooks/use-countdown";

type CountdownLabelProps = {
  deadline?: Date | null;
  expiredLabel?: string;
  className?: string;
  liveLabel?: boolean;
};

export default function CountdownLabel({
  deadline,
  expiredLabel = "Expired",
  className,
  liveLabel = false,
}: CountdownLabelProps) {
  const countdown = useCountdown(deadline);

  if (countdown.expired) {
    return <span className={className}>{expiredLabel}</span>;
  }

  return <span className={className}>{liveLabel ? `LIVE ${formatCountdown(countdown)}` : formatCountdown(countdown)}</span>;
}
