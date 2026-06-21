"use client";

import { formatCountdown, useCountdown } from "@/src/hooks/use-countdown";

type CountdownLabelProps = {
  deadline?: Date | null;
  expiredLabel?: string;
};

export default function CountdownLabel({
  deadline,
  expiredLabel = "Expired",
}: CountdownLabelProps) {
  const countdown = useCountdown(deadline);

  if (countdown.expired) {
    return <>{expiredLabel}</>;
  }

  return <>{formatCountdown(countdown)}</>;
}
