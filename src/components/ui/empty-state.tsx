"use client";

import { ArrowRight, FileX2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border bg-linear-to-br from-primary/5 via-background to-muted/40 px-6 py-16 text-center shadow-sm",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl border bg-background">
        <FileX2 className="size-6 text-muted-foreground" />
      </div>
      <h2 className="mt-5 text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-lg text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-6 gap-2" onClick={onAction}>
          {actionLabel}
          <ArrowRight className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}

