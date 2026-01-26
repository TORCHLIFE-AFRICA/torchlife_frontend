import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://torchlife.vercel.app";

const _inter = Inter({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "TorchLife | Verified Pregnancy Crowdfunding",
  description:
    "TorchLife is a for-profit health-tech platform providing verified, transparent, and fast Pregnancy crowdfunding for maternal care.",
  generator: "v0.app",
  keywords: [
    "healthcare",
    "crowdfunding",
    "maternal care",
    "medical funding",
    "TorchLife",
  ],
  icons: {
    icon: "/apple-touch-icon.png",
    shortcut: "/android-chrome-192x192.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "TorchLife | Verified Pregnancy Crowdfunding",
    description:
      "TorchLife is a for-profit health-tech platform providing verified, transparent, and fast Pregnancy crowdfunding for maternal care.",
    url: siteUrl,
    siteName: "TorchLife",
    images: [
      {
        url: "https://res.cloudinary.com/dzirjoyqd/image/upload/v1769468389/banner_co6jwm.jpg",
        width: 1200,
        height: 630,
        alt: "TorchLife logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TorchLife | Verified Pregnancy Crowdfunding",
    description:
      "TorchLife is a for-profit health-tech platform providing verified, transparent, and fast Pregnancy crowdfunding for maternal care.",
    images: ["/torchlife-logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0F766E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
