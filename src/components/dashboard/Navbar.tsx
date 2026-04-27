import { Bell, Menu, Search } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import logo from "@/public/torchlifelogo.png";
import Image from "next/image";
type NavbarProps = {
  userName: string;
  notificationCount?: number;
  onMobileMenuToggle: () => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  className?: string;
};

export default function Navbar({
  userName,
  notificationCount = 0,
  onMobileMenuToggle,
  searchQuery,
  onSearchQueryChange,
  className,
}: NavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
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
          <div className="relative hidden lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder="Search dashboard"
              aria-label="Search dashboard content"
              className="h-10 w-56 rounded-full border bg-background pl-9 pr-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring xl:w-64"
            />
          </div>
          <nav className="hidden items-center gap-5 text-sm text-muted-foreground sm:flex">
            <a className="transition-colors hover:text-foreground" href="#">
              For individuals
            </a>
            <a className="transition-colors hover:text-foreground" href="#">
              For charities
            </a>
          </nav>
        </div>

        <Link href="/" className="">
          <Image src={logo} alt="TorchLife Africa" width={100} height={40} />
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="#"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground lg:inline"
          >
            Your fundraisers
          </a>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative rounded-full"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            {notificationCount > 0 ? (
              <span className="absolute right-1 top-1 size-2 rounded-full bg-emerald-500" />
            ) : null}
          </Button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border px-2 py-1 transition-colors hover:bg-muted/60"
          >
            <Avatar className="size-7">
              <AvatarImage src="/placeholder-user.jpg" alt={userName} />
              <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:inline">{userName}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
