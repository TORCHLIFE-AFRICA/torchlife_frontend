import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://torchlife.vercel.app"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "TorchLife | Verified Healthcare Crowdfunding",
  description:
    "TorchLife is a for-profit health-tech platform providing verified, transparent, and fast healthcare crowdfunding for maternal care.",
  generator: "v0.app",
  keywords: ["healthcare", "crowdfunding", "maternal care", "medical funding", "TorchLife"],
  icons: {
    icon: [
      {
        url: "/torchlife-logo.png",
        rel: "icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/torchlife-logo.png",
        rel: "icon",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    shortcut: "/torchlife-logo.png",
    apple: "/torchlife-logo.png",
  },
  openGraph: {
    title: "TorchLife | Verified Healthcare Crowdfunding",
    description:
      "TorchLife is a for-profit health-tech platform providing verified, transparent, and fast healthcare crowdfunding for maternal care.",
    url: siteUrl,
    siteName: "TorchLife",
    images: [
      {
        url: "/torchlife-logo.png",
        width: 1200,
        height: 630,
        alt: "TorchLife logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TorchLife | Verified Healthcare Crowdfunding",
    description:
      "TorchLife is a for-profit health-tech platform providing verified, transparent, and fast healthcare crowdfunding for maternal care.",
    images: ["/torchlife-logo.png"],
  },
}

export const viewport: Viewport = {
  themeColor: "#0F766E",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
