"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/src/components/landingPage/navbar";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useSearchParams } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { ModalWithLinks } from "@/src/components/ui/modal-with-links";

const contactOptions = [
  {
    title: "WhatsApp Support",
    description: "Chat with our team directly",
    icon: <Phone className="h-6 w-6 text-primary-foreground" />,
    action: () => window.open("https://wa.me/2348000000000", "_blank"),
  },
  {
    title: "Email Us",
    description: "Send us a detailed message",
    icon: <Mail className="h-6 w-6 text-primary-foreground" />,
    action: () => (window.location.href = "mailto:help@gmail.com"),
  },
];

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const query = useSearchParams();
  const signIn = query.get("auth");
  useEffect(() => {
    if (signIn === "signIn") {
      setIsSignUp(false);
    }
  }, [signIn]);

  // Show modal automatically after 4 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowContactModal(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Instead of submitting, show the contact modal
    setShowContactModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Auth Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto bg-card rounded-2xl shadow-lg border border-border overflow-hidden"
          >
            <div className="p-8">
              {/* Title */}
              <h1 className="text-2xl font-bold text-center mb-2">
                {isSignUp ? "Create Your Account" : "Welcome Back"}
              </h1>
              <p className="text-muted-foreground text-center mb-8">
                {isSignUp
                  ? "Join our community to support or start campaigns"
                  : "Sign in to access your dashboard"}
              </p>

              {/* Tabs */}
              <div className="flex mb-8 rounded-lg bg-muted p-1">
                <Button
                  variant={isSignUp ? "default" : "ghost"}
                  className="flex-1"
                  onClick={() => setIsSignUp(true)}
                >
                  Sign Up
                </Button>
                <Button
                  variant={!isSignUp ? "default" : "ghost"}
                  className="flex-1"
                  onClick={() => setIsSignUp(false)}
                >
                  Sign In
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter your full name" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                    />
                  </div>

                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                      />
                    </div>
                  )}

                  {isSignUp && (
                    <div className="text-sm text-muted-foreground">
                      By signing up, you agree to our
                      <a href="#" className="text-primary hover:underline ml-1">
                        Terms
                      </a>{" "}
                      and
                      <a href="#" className="text-primary hover:underline ml-1">
                        Privacy Policy
                      </a>
                    </div>
                  )}

                  <Button type="submit" className="w-full">
                    {isSignUp ? "Create Account" : "Sign In"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Modal */}
      <div>
        {/* <button onClick={() => setShowContactModal(true)}>
          Open Contact Modal
        </button> */}
        <ModalWithLinks
          open={showContactModal}
          setOpen={setShowContactModal}
          title="We're Upgrading Our Platform!"
          description="Thank you for your interest in TorchLife. We're currently enhancing our platform to serve you better. In the meantime, please contact us directly for immediate assistance."
          options={contactOptions}
        />
      </div>
    </div>
  );
}
