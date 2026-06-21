import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import type { ComponentType } from "react";

import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

export type SidebarItem = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

type SidebarProps = {
  items: SidebarItem[];
  activeItem: string;
  onSelectItem: (itemId: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isDesktopCollapsed: boolean;
  onToggleDesktopCollapse: () => void;
};

export default function Sidebar({
  items,
  activeItem,
  onSelectItem,
  isMobileOpen,
  onCloseMobile,
  isDesktopCollapsed,
  onToggleDesktopCollapse,
}: SidebarProps) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 transition-opacity md:hidden",
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onCloseMobile}
        aria-hidden
      />

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-72 border-r bg-background transition-transform duration-300 md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <span className="font-semibold">Dashboard</span>
          <Button variant="ghost" size="icon" onClick={onCloseMobile} aria-label="Close menu">
            <X className="size-5" />
          </Button>
        </div>
        <SidebarNav items={items} activeItem={activeItem} onSelectItem={onSelectItem} compact={false} />
      </aside>

      <aside
        className={cn(
          "hidden shrink-0 border-r bg-background transition-all duration-300 md:sticky md:top-16 md:block md:h-[calc(100vh-4rem)]",
          isDesktopCollapsed ? "w-24" : "w-64"
        )}
      >
        <div className="flex h-full flex-col overflow-hidden pt-6">
          <div className="mb-4 flex justify-end px-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onToggleDesktopCollapse}
              aria-label={isDesktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isDesktopCollapsed ? (
                <PanelLeftOpen className="size-4" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
            </Button>
          </div>
          <SidebarNav
            items={items}
            activeItem={activeItem}
            onSelectItem={onSelectItem}
            compact={isDesktopCollapsed}
          />
        </div>
      </aside>
    </>
  );
}

type SidebarNavProps = {
  items: SidebarItem[];
  activeItem: string;
  onSelectItem: (itemId: string) => void;
  compact: boolean;
};

function SidebarNav({ items, activeItem, onSelectItem, compact }: SidebarNavProps) {
  const footerItem = items.find((item) => item.id === "logout");
  const primaryItems = items.filter((item) => item.id !== "logout");

  return (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto px-3 pb-6">
      <div className="space-y-2">
        {primaryItems.map((item) => {
          const isActive = item.id === activeItem;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectItem(item.id)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors duration-200",
                isActive ? "font-semibold text-foreground" : "text-foreground/80 hover:text-foreground",
                compact && "justify-center px-2"
              )}
            >
              <span
                className={cn(
                  "relative inline-flex size-8 items-center justify-center rounded-full border",
                  isActive
                    ? "border-emerald-200 bg-emerald-100 text-emerald-600"
                    : "border-muted-foreground/15 bg-background text-muted-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
              </span>
              <span className={cn("truncate", compact && "hidden")}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {footerItem ? (
        <div className="mt-auto border-t pt-4">
          {(() => {
            const Icon = footerItem.icon;
            return (
              <button
                type="button"
                onClick={() => onSelectItem(footerItem.id)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-destructive transition-colors duration-200 hover:bg-destructive/5",
                  compact && "justify-center px-2"
                )}
              >
                <span className="relative inline-flex size-8 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10 text-destructive">
                  <Icon className="size-4 shrink-0" />
                </span>
                <span className={cn("truncate", compact && "hidden")}>{footerItem.label}</span>
              </button>
            );
          })()}
        </div>
      ) : null}
    </nav>
  );
}
