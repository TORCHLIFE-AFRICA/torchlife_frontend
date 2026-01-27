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
    action: () => window.open("https://wa.me/2347069014391", "_blank"),
  },
  {
    title: "Email Us",
    description: "Send us a detailed message",
    icon: <Mail className="h-6 w-6 text-primary-foreground" />,
    action: () => (window.location.href = "mailto:info@torchlife.org"),
  },
];

export default function AuthClient() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);

  const searchParams = useSearchParams();
  const signIn = searchParams.get("auth");

  useEffect(() => {
    if (signIn === "signIn") {
      setIsSignUp(false);
    }
  }, [signIn]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContactModal(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowContactModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto bg-card rounded-2xl shadow-lg border border-border overflow-hidden"
          >
            <div className="p-8">
              <h1 className="text-2xl font-bold text-center mb-2">
                {isSignUp ? "Create Your Account" : "Welcome Back"}
              </h1>

              <p className="text-muted-foreground text-center mb-8">
                {isSignUp
                  ? "Join our community to support or start campaigns"
                  : "Sign in to access your dashboard"}
              </p>

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

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <Label>Full Name</Label>
                    <Input />
                  </div>
                )}

                <div>
                  <Label>Email</Label>
                  <Input type="email" />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input type="password" />
                </div>

                <Button className="w-full">
                  {isSignUp ? "Create Account" : "Sign In"}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <ModalWithLinks
        open={showContactModal}
        setOpen={setShowContactModal}
        title="We're Upgrading Our Platform!"
        description="Thank you for your interest in TorchLife. We're currently enhancing our platform to serve you better. In the meantime, please contact us directly for immediate assistance."
        options={contactOptions}
        showCloseButton={false}
      />
    </div>
  );
}
