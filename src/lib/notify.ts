"use client";

import { toast } from "@/src/hooks/use-toast";

type NotifyLevel = "success" | "error" | "warning" | "info";

const variantByLevel = {
  success: "success",
  error: "destructive",
  warning: "warning",
  info: "info",
} as const;

export function notify(level: NotifyLevel, title: string, description?: string) {
  toast({
    title,
    description,
    variant: variantByLevel[level],
  });
}

export const notifySuccess = (title: string, description?: string) =>
  notify("success", title, description);

export const notifyError = (title: string, description?: string) =>
  notify("error", title, description);

export const notifyWarning = (title: string, description?: string) =>
  notify("warning", title, description);

export const notifyInfo = (title: string, description?: string) =>
  notify("info", title, description);
