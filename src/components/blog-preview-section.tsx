"use client"

import { motion } from "framer-motion"
import { SectionWrapper } from "./section-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const blogPosts = [
  {
    title: "How TorchLife is Revolutionizing Maternal Healthcare Funding",
    excerpt: "Discover how our verification process ensures every campaign reaches those who truly need help.",
    image: "/african-mother-baby-hospital-healthcare.jpg",
    date: "Jan 5, 2026",
    category: "Impact Stories",
  },
  {
    title: "Understanding the Maternal Healthcare Crisis in Nigeria",
    excerpt: "An in-depth look at the challenges facing expectant mothers and how crowdfunding can help.",
    image: "/maternal-healthcare-africa-clinic.jpg",
    date: "Dec 28, 2025",
    category: "Research",
  },
  {
    title: "5 Ways to Maximize Your Campaign Reach",
    excerpt: "Expert tips on sharing your story and connecting with donors who want to make a difference.",
    image: "/people-using-smartphone-social-media-charity.jpg",
    date: "Dec 20, 2025",
    category: "Tips",
  },
]

export function BlogPreviewSection() {
  return (
    <SectionWrapper className="bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full"
            >
              From the Blog
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl lg:text-4xl font-bold text-foreground text-balance"
            >
              Latest stories & insights
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 md:mt-0"
          >
            <Link href="/blog">
              <Button variant="outline" className="group bg-transparent">
                View all posts
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow"
            >
              <Link href="/blog">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
