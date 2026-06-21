"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { paymentApi, type DonationTickerItem } from "@/src/lib/api/payments";

const formatMoney = (value: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export default function DonationTicker() {
  const [items, setItems] = useState<DonationTickerItem[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await paymentApi.getDonationTicker();
        if (mounted) {
          setItems(data);
        }
      } catch {
        if (mounted) {
          setItems([]);
        }
      }
    };

    void load();
    const refreshTimer = window.setInterval(() => {
      void load();
    }, 60000);

    return () => {
      mounted = false;
      window.clearInterval(refreshTimer);
    };
  }, []);

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    const rotationTimer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, 4000);

    return () => window.clearInterval(rotationTimer);
  }, [items]);

  const activeItem = useMemo(() => {
    if (items.length === 0) {
      return null;
    }

    return items[index % items.length];
  }, [index, items]);

  if (!activeItem) {
    return null;
  }

  const content = (
    <div className="pointer-events-auto fixed bottom-4 left-1/2 z-50 w-[min(92vw,34rem)] -translate-x-1/2 rounded-full border bg-background/95 px-4 py-3 text-sm shadow-lg backdrop-blur">
      <span className="font-semibold">{activeItem.donorLabel}</span>{" "}
      just donated{" "}
      <span className="font-semibold">
        {formatMoney(activeItem.amount, activeItem.currency)}
      </span>
      {activeItem.campaign?.title ? ` to ${activeItem.campaign.title}` : ""}
    </div>
  );

  if (activeItem.campaign?.publicId) {
    return (
      <Link href={`/campaign/${activeItem.campaign.publicId}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
