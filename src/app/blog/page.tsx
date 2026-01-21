"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/src/components/landingPage/navbar";
import { Footer } from "@/src/components/landingPage/footer";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Search, Filter, Heart, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "How TorchLife is Revolutionizing Maternal Healthcare Funding",
    excerpt:
      "Discover how our verification process ensures every campaign reaches those who truly need help.",
    content:
      "TorchLife's innovative approach to maternal healthcare funding combines cutting-edge technology with compassionate human verification. Our team works tirelessly to ensure that every campaign is thoroughly vetted, connecting donors with real stories and real needs.",
    image: "/african-mother-baby-hospital-healthcare.jpg",
    date: "Jan 5, 2026",
    category: "Impact Stories",
    author: "Dr. Amara Johnson",
    authorImage: "/placeholder-user.jpg",
    readTime: "5 min read",
    likes: 128,
    comments: 24,
  },
  {
    id: 2,
    title: "Understanding the Maternal Healthcare Crisis in Nigeria",
    excerpt:
      "An in-depth look at the challenges facing expectant mothers and how crowdfunding can help.",
    content:
      "Nigeria faces significant challenges in maternal healthcare, with high mortality rates and limited access to quality services in rural areas. This article explores the root causes and how community-driven solutions like TorchLife are making a difference.",
    image: "/maternal-healthcare-africa-clinic.jpg",
    date: "Dec 28, 2025",
    category: "Research",
    author: "Sarah Okafor",
    authorImage: "/placeholder-user.jpg",
    readTime: "7 min read",
    likes: 95,
    comments: 18,
  },
  {
    id: 3,
    title: "5 Ways to Maximize Your Campaign Reach",
    excerpt:
      "Expert tips on sharing your story and connecting with donors who want to make a difference.",
    content:
      "Creating a compelling campaign is just the first step. Learn how to effectively share your story, engage with your community, and leverage social media to maximize your campaign's impact and reach your funding goals.",
    image: "/people-using-smartphone-social-media-charity.jpg",
    date: "Dec 20, 2025",
    category: "Tips",
    author: "Michael Adebayo",
    authorImage: "/placeholder-user.jpg",
    readTime: "4 min read",
    likes: 156,
    comments: 32,
  },
  {
    id: 4,
    title: "The Power of Community: How Collective Giving Saves Lives",
    excerpt:
      "Stories of how small donations from many people come together to create life-changing impacts.",
    content:
      "Every donation, no matter how small, contributes to a larger movement of hope and healing. This article shares heartwarming stories of how collective giving has transformed the lives of mothers and babies across Nigeria.",
    image: "/african-mother-baby-hospital-healthcare.jpg",
    date: "Dec 15, 2025",
    category: "Impact Stories",
    author: "Grace Okon",
    authorImage: "/placeholder-user.jpg",
    readTime: "6 min read",
    likes: 112,
    comments: 21,
  },
  {
    id: 5,
    title: "Behind the Scenes: Our Medical Verification Process",
    excerpt:
      "A transparent look at how we ensure every campaign is legitimate and every donation reaches its intended recipient.",
    content:
      "Trust is the foundation of TorchLife. Learn about our rigorous medical verification process, which includes hospital visits, document checks, and ongoing monitoring to ensure accountability and transparency.",
    image: "/medical-verification-company-logo.jpg",
    date: "Dec 10, 2025",
    category: "About Us",
    author: "Dr. Chinedu Eze",
    authorImage: "/placeholder-user.jpg",
    readTime: "5 min read",
    likes: 89,
    comments: 15,
  },
  {
    id: 6,
    title: "How Technology is Improving Maternal Health Outcomes",
    excerpt:
      "Exploring the intersection of technology and healthcare in rural African communities.",
    content:
      "From mobile health apps to telemedicine services, technology is playing a crucial role in improving maternal health outcomes in underserved areas. Discover the innovative solutions that are bridging the healthcare gap.",
    image: "/pregnant-african-woman-smiling-in-modern-hospital-.jpg",
    date: "Dec 5, 2025",
    category: "Technology",
    author: "Tolu Ogunleye",
    authorImage: "/placeholder-user.jpg",
    readTime: "6 min read",
    likes: 134,
    comments: 27,
  },
];

const categories = [
  "All",
  "Impact Stories",
  "Research",
  "Tips",
  "About Us",
  "Technology",
];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  useEffect(() => {
    let result = blogPosts;

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((post) => post.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.excerpt.toLowerCase().includes(term) ||
          post.content.toLowerCase().includes(term),
      );
    }

    setFilteredPosts(result);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              TorchLife Blog
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">
              Stories, insights, and updates about maternal healthcare funding
              and our mission to save lives
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-12"
          >
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search blog posts..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by:</span>
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Results Info */}
          <div className="mb-8 text-sm text-muted-foreground">
            Showing {filteredPosts.length} of {blogPosts.length} blog posts
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow"
              >
                <Link href={`/blog/${post.id}`}>
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
                      <span className="text-xs text-muted-foreground">
                        {post.date} • {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden">
                          <Image
                            src={post.authorImage || "/placeholder-user.jpg"}
                            alt={post.author}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {post.author}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Heart className="h-3.5 w-3.5" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                No blog posts found
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
              >
                Reset filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
