import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TorchLife | Verified Healthcare Crowdfunding",
  description:
    "TorchLife is a for-profit health-tech platform providing verified, transparent, and fast healthcare crowdfunding for maternal care.",
  generator: "v0.app",
  keywords: ["healthcare", "crowdfunding", "maternal care", "medical funding", "TorchLife"],
  icons: {
    icon: [
      {
        url: "/torchlife-logo.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/torchlife-logo.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/torchlife-logo.png",
        type: "image/png",
      },
    ],
    apple: "/torchlife-logo.png",
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
