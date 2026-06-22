import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/src/contexts/AuthContext";
import DonationTicker from "@/src/components/shared/DonationTicker";
import { Toaster } from "@/src/components/ui/toaster";
import { getPublicBaseUrl } from "@/src/lib/site-url";
import "./globals.css";

const siteUrl = getPublicBaseUrl();

const _inter = Inter({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "The Trusted Way To Solve Pregnancy Crisis | TorchLife",
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
    title: "The Trusted Way To Solve Pregnancy Crisis | TorchLife",
    description:
      "TorchLife is a for-profit health-tech platform providing verified, transparent, and fast Pregnancy crowdfunding for maternal care.",
    url: siteUrl,
    siteName: "TorchLife",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "TorchLife hero preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Trusted Way To Solve Pregnancy Crisis | TorchLife",
    description:
      "TorchLife is a for-profit health-tech platform providing verified, transparent, and fast Pregnancy crowdfunding for maternal care.",
    images: ["/twitter-image"],
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
        <AuthProvider>
          {children}
          <DonationTicker />
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
