"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

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
  const [isDismissed, setIsDismissed] = useState(false);

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

  if (isDismissed) {
    return null;
  }

  const body = (
    <div className="pr-8 text-sm">
      <span className="font-semibold">{activeItem.donorLabel}</span>{" "}
      just donated{" "}
      <span className="font-semibold">
        {formatMoney(activeItem.amount, activeItem.currency)}
      </span>
      {activeItem.campaign?.title ? ` to ${activeItem.campaign.title}` : ""}
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        key={activeItem.id ?? `${activeItem.donorLabel}-${activeItem.amount}-${index}`}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) > 120) {
            setIsDismissed(true);
          }
        }}
        className="pointer-events-auto fixed bottom-4 left-1/2 z-50 w-[min(92vw,34rem)] -translate-x-1/2 rounded-2xl border bg-background/95 px-4 py-3 shadow-lg backdrop-blur"
      >
        <button
          type="button"
          aria-label="Dismiss donation update"
          className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          onClick={() => setIsDismissed(true)}
        >
          <X className="size-4" />
        </button>

        {activeItem.campaign?.publicId ? (
          <Link href={`/campaign/${activeItem.campaign.publicId}`} className="block">
            {body}
          </Link>
        ) : (
          body
        )}
      </motion.div>
    </AnimatePresence>
  );
}
