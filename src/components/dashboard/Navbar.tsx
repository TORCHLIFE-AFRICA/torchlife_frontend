import { Bell, Menu, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { cn } from "@/src/lib/utils";
import logo from "@/public/torchlifelogo.png";

type NavbarProps = {
  userName: string;
  onMobileMenuToggle: () => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  searchPlaceholder: string;
  onProfileClick: () => void;
  className?: string;
};

export default function Navbar({
  userName,
  onMobileMenuToggle,
  searchQuery,
  onSearchQueryChange,
  searchPlaceholder,
  onProfileClick,
  className,
}: NavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/75",
        className
      )}
    >
      <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMobileMenuToggle}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
          <Link href="/" className="shrink-0">
            <Image src={logo} alt="TorchLife Africa" width={108} height={40} priority />
          </Link>
        </div>

        <div className="hidden justify-center md:flex">
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="h-10 w-full rounded-full border bg-background pl-9 pr-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-4">
          <div className="relative w-full max-w-48 md:hidden">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder="Search"
              aria-label="Search"
              className="h-10 w-full rounded-full border bg-background pl-9 pr-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="relative rounded-full"
                aria-label="Notifications"
              >
                <Bell className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex-col items-start gap-1">
                <span className="font-medium">Welcome to TorchLife, {userName}</span>
                <span className="text-xs text-muted-foreground">No notifications yet</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            onClick={onProfileClick}
            className="flex items-center gap-2 rounded-full border px-2 py-1 transition-colors hover:bg-muted/60"
            aria-label="Open profile"
          >
            <Avatar className="size-7">
              <AvatarImage src="/placeholder-user.jpg" alt={userName} />
              <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">
              {userName}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
