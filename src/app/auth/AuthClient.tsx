"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/src/components/landingPage/navbar";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";

export default function AuthClient() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, isAuthenticated, isLoading } = useAuth();
  const signIn = searchParams.get("auth");

  useEffect(() => {
    if (signIn === "signIn") {
      setIsSignUp(false);
    }
  }, [signIn]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        await register({
          name,
          email,
          password,
          confirmPassword,
        });
        window.alert("Account created successfully. Please sign in to continue.");
        setIsSignUp(false);
        router.replace("/auth?auth=signIn");
        return;
      } else {
        await login(email, password);
        router.replace("/dashboard");
      }
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Authentication failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
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
                    <Input
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>
                )}

                <div>
                  <Label>Email</Label>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input
                    required
                    type="password"
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>

                {isSignUp ? (
                  <div>
                    <Label>Confirm Password</Label>
                    <Input
                      required
                      type="password"
                      minLength={8}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                  </div>
                ) : null}

                {error ? (
                  <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                ) : null}

                <Button className="w-full" disabled={isSubmitting || isLoading}>
                  {isSubmitting
                    ? "Please wait..."
                    : isSignUp
                      ? "Create Account"
                      : "Sign In"}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
