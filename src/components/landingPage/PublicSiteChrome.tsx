"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { CloudinaryImage } from "../ui/clodinary-image";
import { CLOUDINARY_ASSETS } from "@/public/assets/staticImages";

const navigationItems = [
  { label: "Browse Campaigns", href: "/campaigns" },
  { label: "Featured Cases", href: "/#campaigns" },
  { label: "YouTube", href: "/#youtube" },
  { label: "Get Involved", href: "/#get-involved" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1E8GrCUVBF/?mibextid=wwXIfr",
    bgClassName: "bg-[#1877f2]",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
        <path d="M13.54 22v-8.2h2.76l.41-3.2h-3.17V8.56c0-.93.26-1.56 1.6-1.56h1.72V4.14c-.3-.04-1.32-.14-2.5-.14-2.48 0-4.18 1.52-4.18 4.3v2.3H7.36v3.2h2.82V22h3.36Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/torchlife_africa?igsh=MTRlaWQ4OHZ3endzbw==",
    bgClassName: "bg-[linear-gradient(135deg,#f58529,#feda77,#dd2a7b,#8134af,#515bd4)]",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5Zm8.9 1.7a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9ZM12 6.8A5.2 5.2 0 1 1 6.8 12 5.2 5.2 0 0 1 12 6.8Zm0 1.5A3.7 3.7 0 1 0 15.7 12 3.7 3.7 0 0 0 12 8.3Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/torchlife",
    bgClassName: "bg-[#0a66c2]",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
        <path d="M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.56a1.95 1.95 0 1 0-3.9 0 1.95 1.95 0 0 0 3.9 0ZM20.44 13.02c0-3.44-1.84-5.04-4.3-5.04a3.71 3.71 0 0 0-3.34 1.84V8.5H9.42c.04.88 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.68.13-.92a2.21 2.21 0 0 1 2.08-1.48c1.47 0 2.06 1.12 2.06 2.76V20h3.37l.01-6.98Z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/torchlifea?s=21",
    bgClassName: "bg-black",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
        <path d="M18.9 2H22l-6.78 7.76L23.2 22h-6.25l-4.9-7.44L5.56 22H2.44l7.24-8.27L1.2 2h6.4l4.43 6.76L18.9 2Zm-1.1 18h1.73L6.67 3.9H4.81L17.8 20Z" />
      </svg>
    ),
  },
];

export function PublicSiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f7f2ea]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <CloudinaryImage
              publicId={CLOUDINARY_ASSETS.logo}
              alt={"Logo"}
              options={{
                quality: "auto",
                format: "auto",
                width: 150,
                height: 100,
              }}
              className="object-cover"
              priority={true}
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-[#27413d] transition-colors hover:text-[#0f766e]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/auth?auth=signIn">
              <Button
                variant="ghost"
                className="rounded-full px-5 text-[#15332e] hover:bg-[#ecdfc0] hover:text-[#15332e]"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/auth?auth=signIn&returnUrl=%2Fdashboard%3Ftab%3Dcreate-campaign">
              <Button className="rounded-full bg-[#c89a2b] px-5 text-[#17220f] hover:bg-[#b58b26]">
                Start a campaign
              </Button>
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation"
            className="inline-flex size-11 items-center justify-center rounded-full border border-black/10 bg-white/80 lg:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      {isMenuOpen ? (
        <div className="fixed inset-0 top-[73px] z-60 bg-[#091816]/25 backdrop-blur-[2px] lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="absolute inset-0"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="relative mx-4 mt-4 rounded-[1.75rem] border border-white/60 bg-[#f7f2ea] p-4 shadow-[0_30px_100px_-48px_rgba(7,28,26,0.8)]">
            <div className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-[#27413d] transition-colors hover:bg-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link href="/auth?auth=signIn" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full rounded-full">
                  Sign in
                </Button>
              </Link>
              <Link
                href="/auth?auth=signIn&returnUrl=%2Fdashboard%3Ftab%3Dcreate-campaign"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button className="w-full rounded-full bg-[#c89a2b] text-[#17220f] hover:bg-[#b58b26]">
                  Start a campaign
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function PublicSiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-[#f3ece1] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.25fr,0.9fr,1fr] lg:items-start">
        <div className="space-y-5">
          <Image
            src="/torchlife-logo.png"
            alt="TorchLife"
            width={150}
            height={44}
            className="h-12 w-auto sm:h-14"
          />
          <p className="mt-4 max-w-md text-sm leading-6 text-[#556a66]">
            TorchLife is a maternal care fundraising platform focused on verified campaigns,
            transparent progress, and public-friendly giving experiences.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                className={`inline-flex size-11 items-center justify-center rounded-full text-white shadow-sm transition-transform hover:-translate-y-0.5 ${link.bgClassName}`}
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[#e2d7c2] bg-white/55 p-5">
          <p className="text-sm font-semibold text-[#132726]">Platform</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#556a66]">
            <Link href="/campaigns" className="transition-colors hover:text-[#0f766e]">
              Browse campaigns
            </Link>
            <Link
              href="/auth?auth=signIn&returnUrl=%2Fdashboard%3Ftab%3Dcreate-campaign"
              className="transition-colors hover:text-[#0f766e]"
            >
              Start a campaign
            </Link>
            <Link href="/blog" className="transition-colors hover:text-[#0f766e]">
              Blog and updates
            </Link>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[#e2d7c2] bg-white/55 p-5">
          <p className="text-sm font-semibold text-[#132726]">Connect</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#556a66]">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-[#0f766e]"
              >
                {link.label}
              </Link>
            ))}
            <Link href="mailto:info@torchlife.org" className="transition-colors hover:text-[#0f766e]">
              info@torchlife.org
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
