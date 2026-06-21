"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Navbar } from "@/src/components/landingPage/navbar";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { authApi } from "@/src/lib/api/auth";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? "";
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const maskedEmail = useMemo(() => {
    if (!email.includes("@")) return email;
    const [name, domain] = email.split("@");
    return `${name.slice(0, 2)}${"*".repeat(Math.max(1, name.length - 2))}@${domain}`;
  }, [email]);

  useEffect(() => {
    if (!userId || !email) {
      setError("Missing verification details. Sign up or sign in again to continue.");
    }
  }, [email, userId]);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const parsedOtp = Number(otp);
    if (!Number.isInteger(parsedOtp) || otp.trim().length !== 6) {
      setError("Enter the 6-digit OTP sent to your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.verifyEmailOtp(userId, parsedOtp);
      setSuccess("Email verified successfully. Redirecting to your dashboard...");
      window.location.assign("/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to verify OTP right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setSuccess(null);
    setIsResending(true);
    try {
      await authApi.resendEmailOtp(email);
      setSuccess("A new OTP has been sent to your email.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to resend OTP right now."
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleWrongAccount = async () => {
    setError(null);
    setSuccess(null);
    setOtp("");

    try {
      await authApi.logout();
    } catch {
    } finally {
      router.replace("/auth?auth=signUp");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-md rounded-2xl border bg-card p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-center">Verify Your Email</h1>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Enter the 6-digit code sent to {maskedEmail || "your email"} to finish authentication.
            </p>

            <form onSubmit={handleVerify} className="mt-8 space-y-4">
              <div>
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                />
              </div>

              {error ? (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              {success ? (
                <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                  {success}
                </p>
              ) : null}

              <Button type="submit" className="w-full" disabled={isSubmitting || !userId || !email}>
                {isSubmitting ? "Verifying..." : "Verify Email"}
              </Button>
            </form>

            <div className="mt-6 space-y-3 text-center">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResend}
                disabled={isResending || !email}
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </Button>

              <button
                type="button"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                onClick={() => router.replace("/auth?auth=signIn")}
              >
                Back to sign in
              </button>

              <p className="text-xs text-muted-foreground">
                Wrong account?{" "}
                <button
                  type="button"
                  className="underline underline-offset-4"
                  onClick={() => void handleWrongAccount()}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <Navbar />
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="mx-auto max-w-md rounded-2xl border bg-card p-8 shadow-lg">
                <p className="text-center text-sm text-muted-foreground">Loading verification...</p>
              </div>
            </div>
          </section>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
