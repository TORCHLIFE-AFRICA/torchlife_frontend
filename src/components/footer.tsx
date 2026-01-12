"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Twitter, Instagram, Linkedin } from "lucide-react"

const footerLinks = {
  platform: [
    { label: "Browse Campaigns", href: "#campaigns" },
    { label: "Start a Campaign", href: "#" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Partner Hospitals", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "/blog" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#contact" },
    { label: "FAQs", href: "#" },
    { label: "Trust & Safety", href: "#" },
  ],
}

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background" id="contact">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/torchlifelogo.png"
                alt="TorchLife Logo"
                width={160}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-background/70 mb-6 max-w-sm leading-relaxed">
              TorchLife is a for-profit health-tech platform providing verified, transparent, and fast healthcare
              crowdfunding for maternal care.
            </p>
            <div className="space-y-2 text-sm text-background/70">
              <p>
                <span className="font-medium text-background">Email:</span>{" "}
                <a href="mailto:info@torchlife.org" className="hover:text-accent transition-colors">
                  info@torchlife.org
                </a>
              </p>
              <p>
                <span className="font-medium text-background">Phone:</span>{" "}
                <a href="tel:+2348000000000" className="hover:text-accent transition-colors">
                  +234 800 000 0000
                </a>
              </p>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-background mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/60">© 2026 TorchLife. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-background/60 hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-background/60 hover:text-accent transition-colors">
              Terms of Service
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
