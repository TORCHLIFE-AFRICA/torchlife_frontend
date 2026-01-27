"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/src/components/landingPage/navbar";
import { Footer } from "@/src/components/landingPage/footer";
import { Button } from "@/src/components/ui/button";
import {
  Heart,
  MessageSquare,
  Share2,
  ArrowLeft,
  Bookmark,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const blogPosts = [
  {
    id: 1,
    slug: "how-torchlife-is-revolutionizing-maternal-healthcare-funding",
    title: "How TorchLife is Revolutionizing Pregnancy Funding",
    excerpt:
      "Discover how our verification process ensures every campaign reaches those who truly need help.",
    content: `
      <p>TorchLife's innovative approach to maternal healthcare funding combines cutting-edge technology with compassionate human verification. Our team works tirelessly to ensure that every campaign is thoroughly vetted, connecting donors with real stories and real needs.</p>
      
      <h2>The Crisis in Maternal Healthcare</h2>
      <p>Nigeria has one of the highest maternal mortality rates in the world, with approximately 917 deaths per 100,000 live births. This crisis disproportionately affects rural communities where access to quality healthcare is limited.</p>
      
      <p>Many expectant mothers cannot afford the cost of safe delivery, prenatal care, or emergency medical interventions. This leads to preventable deaths and complications that could be avoided with proper funding and resources.</p>
      
      <h2>Our Verification Process</h2>
      <p>At TorchLife, we understand that trust is everything. That's why we've developed a rigorous verification process to ensure every campaign is legitimate:</p>
      
      <ul>
        <li><strong>Initial Screening:</strong> Every campaign application is reviewed by our team to check for basic eligibility criteria.</li>
        <li><strong>Document Verification:</strong> We verify all medical documents, hospital bills, and patient information.</li>
        <li><strong>Hospital Visit:</strong> Our field officers conduct in-person visits to verify the patient's condition and treatment needs.</li>
        <li><strong>Ongoing Monitoring:</strong> We continue to monitor campaigns after they're launched to ensure funds are used appropriately.</li>
      </ul>
      
      <h2>Impact Stories</h2>
      <p>Since our launch, TorchLife has helped fund over 500 maternal healthcare campaigns, saving countless lives across Nigeria. Here are just a few examples:</p>
      
      <ul>
        <li>A young mother in Kaduna received emergency C-section funding, saving both her and her baby's life.</li>
        <li>A rural clinic in Enugu received equipment upgrades to better serve their community.</li>
        <li>200 expectant mothers received free prenatal care through our community outreach programs.</li>
      </ul>
      
      <h2>How You Can Help</h2>
      <p>There are many ways to support our mission:</p>
      
      <ul>
        <li>Donate to a campaign that resonates with you.</li>
        <li>Share campaigns with your network to increase their reach.</li>
        <li>Start a campaign for someone in need.</li>
        <li>Volunteer your time or expertise to help our team.</li>
      </ul>
      
      <p>Together, we can revolutionize maternal healthcare funding and save more lives across Nigeria.</p>
    `,
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
    slug: "understanding-the-maternal-healthcare-crisis-in-nigeria",
    title: "Understanding the Maternal Healthcare Crisis in Nigeria",
    excerpt:
      "An in-depth look at the challenges facing expectant mothers and how crowdfunding can help.",
    content: `
      <p>Nigeria faces significant challenges in maternal healthcare, with high mortality rates and limited access to quality services in rural areas. This article explores the root causes and how community-driven solutions like TorchLife are making a difference.</p>
      
      <h2>Root Causes</h2>
      <p>Several factors contribute to Nigeria's maternal healthcare crisis:</p>
      
      <ul>
        <li><strong>Poverty:</strong> Many families cannot afford basic healthcare services.</li>
        <li><strong>Distance to Facilities:</strong> Rural communities often lack nearby hospitals or clinics.</li>
        <li><strong>Shortage of Healthcare Workers:</strong> Nigeria has a severe shortage of doctors, nurses, and midwives.</li>
        <li><strong>Cultural Barriers:</strong> Some traditional beliefs prevent women from seeking medical care.</li>
        <li><strong>Limited Infrastructure:</strong> Many healthcare facilities lack essential equipment and supplies.</li>
      </ul>
      
      <h2>The Role of Crowdfunding</h2>
      <p>Crowdfunding has emerged as a powerful tool to address these challenges by:</p>
      
      <ul>
        <li>Providing direct financial support to those in need.</li>
        <li>Raising awareness about maternal healthcare issues.</li>
        <li>Building community support for healthcare initiatives.</li>
        <li>Complementing government efforts to improve healthcare access.</li>
      </ul>
      
      <h2>Looking Forward</h2>
      <p>While the challenges are significant, there is hope. With continued investment in healthcare infrastructure, increased access to education for healthcare workers, and innovative solutions like crowdfunding, Nigeria can reduce its maternal mortality rate and improve outcomes for mothers and babies.</p>
    `,
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
    slug: "5-ways-to-maximize-your-campaign-reach",
    title: "5 Ways to Maximize Your Campaign Reach",
    excerpt:
      "Expert tips on sharing your story and connecting with donors who want to make a difference.",
    content: `
      <p>Creating a compelling campaign is just the first step. Learn how to effectively share your story, engage with your community, and leverage social media to maximize your campaign's impact and reach your funding goals.</p>
      
      <h2>1. Tell a Compelling Story</h2>
      <p>People give to people, not just causes. Share the human story behind your campaign, including personal details, challenges, and hopes for the future. Use photos and videos to create an emotional connection with potential donors.</p>
      
      <h2>2. Leverage Social Media</h2>
      <p>Share your campaign across all your social media platforms, including Facebook, Twitter, Instagram, and WhatsApp. Use hashtags to increase visibility and encourage others to share your campaign with their networks.</p>
      
      <h2>3. Engage with Your Community</h2>
      <p>Respond to comments, update your campaign regularly, and thank donors publicly. Building relationships with your supporters can lead to more donations and increased sharing.</p>
      
      <h2>4. Partner with Influencers</h2>
      <p>Reach out to local influencers, community leaders, and organizations that align with your cause. Their support can help you reach a wider audience and build credibility for your campaign.</p>
      
      <h2>5. Host Fundraising Events</h2>
      <p>Organize virtual or in-person events to raise awareness and funds for your campaign. This could include webinars, charity auctions, or community gatherings.</p>
      
      <p>By implementing these strategies, you can increase your campaign's reach, engage more donors, and ultimately raise more funds for your cause.</p>
    `,
    image: "/people-using-smartphone-social-media-charity.jpg",
    date: "Dec 20, 2025",
    category: "Tips",
    author: "Michael Adebayo",
    authorImage: "/placeholder-user.jpg",
    readTime: "4 min read",
    likes: 156,
    comments: 32,
  },
];

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.id as string;
  const post = blogPosts.find((p) => p.slug === slug);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes || 0);
  const [bookmarked, setBookmarked] = useState(false);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="py-24">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist or has been
              removed.
            </p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Blog Post */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/blog">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to all posts
              </Button>
            </Link>
          </motion.div>

          {/* Post Header */}
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4"
            >
              <span className="inline-block px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full">
                {post.category}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance"
            >
              {post.title}
            </motion.h1>

            {/* Author Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="relative h-12 w-12 rounded-full overflow-hidden">
                <Image
                  src={post.authorImage || "/placeholder-user.jpg"}
                  alt={post.author}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-medium">{post.author}</div>
                <div className="text-sm text-muted-foreground">
                  {post.date} • {post.readTime}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-3">
                {/* <Button
                  variant="ghost"
                  size="icon"
                  className={`${liked ? "text-primary" : ""}`}
                  onClick={handleLike}
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-primary" : ""}`} />
                  <span className="sr-only">Like</span>
                </Button>
                <span className="text-sm">{likeCount}</span> */}
                {/* <Button
                  variant="ghost"
                  size="icon"
                  className={`${bookmarked ? "text-primary" : ""}`}
                  onClick={handleBookmark}
                >
                  <Bookmark
                    className={`h-4 w-4 ${bookmarked ? "fill-primary" : ""}`}
                  />
                  <span className="sr-only">Bookmark</span>
                </Button> */}
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
            </motion.div>

            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative h-80 md:h-96 overflow-hidden rounded-xl mb-10"
            >
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Post Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Comments Section */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-12 pt-8 border-t border-border"
            >
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5" />
                <h3 className="text-xl font-semibold">
                  Comments ({post.comments})
                </h3>
              </div>

              <div className="space-y-6"> */}
            {/* Sample Comment */}
            {/* <div className="flex gap-4">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0">
                    <Image
                      src="/placeholder-user.jpg"
                      alt="Commenter"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Jane Doe</span>
                        <span className="text-xs text-muted-foreground">
                          2 days ago
                        </span>
                      </div>
                      <p className="text-sm">
                        This article is very informative. Thank you for sharing
                        these insights about maternal healthcare in Nigeria.
                      </p>
                    </div>
                  </div>
                </div> */}

            {/* Add Comment */}
            {/* <div className="flex gap-4">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 bg-muted">
                    <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      You
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Add a comment..."
                      className="w-full rounded-lg border border-border p-4 focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <Button>Post Comment</Button>
                    </div>
                  </div>
                </div> */}
            {/* </div> */}
            {/* </motion.div> */}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
