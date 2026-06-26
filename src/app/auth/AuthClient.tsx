"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Script from "next/script";
import { Navbar } from "@/src/components/landingPage/navbar";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/src/components/ui/input-otp";
import { Label } from "@/src/components/ui/label";
import { authApi } from "@/src/lib/api/auth";
import { ApiClientError } from "@/src/lib/api/client";
import { notifyError, notifyInfo, notifySuccess } from "@/src/lib/notify";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme: string;
              size: string;
              text: string;
              shape: string;
              width: number;
            }
          ) => void;
        };
      };
    };
  }
}

function GoogleLogo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.68-.06-1.33-.17-1.96H12v3.71h5.39a4.61 4.61 0 0 1-2 3.03v2.51h3.23c1.89-1.74 2.98-4.29 2.98-7.29Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.61-2.48l-3.23-2.51c-.9.6-2.04.95-3.38.95-2.6 0-4.8-1.75-5.59-4.11H3.07v2.59A9.99 9.99 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.85A5.99 5.99 0 0 1 6.1 12c0-.64.11-1.25.31-1.85V7.56H3.07A9.99 9.99 0 0 0 2 12c0 1.61.39 3.14 1.07 4.44l3.34-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.04c1.47 0 2.78.5 3.81 1.49l2.86-2.86C16.96 3.08 14.7 2 12 2A9.99 9.99 0 0 0 3.07 7.56l3.34 2.59C7.2 7.79 9.4 6.04 12 6.04Z"
      />
    </svg>
  );
}

export default function AuthClient() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [philanthropicName, setPhilanthropicName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationUserId, setVerificationUserId] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationOtp, setVerificationOtp] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState<string | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, loginWithGoogle, refreshMe, register, isAuthenticated, isLoading } = useAuth();
  const signIn = searchParams.get("auth");
  const returnUrlParam = searchParams.get("returnUrl");
  const [googleReady, setGoogleReady] = useState(false);
  const [googleLoadFailed, setGoogleLoadFailed] = useState(false);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const googleEnabled = googleReady && !googleLoadFailed && !!googleClientId;
  const normalizedEmail = email.trim().toLowerCase();

  const getSafeReturnUrl = () => {
    if (!returnUrlParam || !returnUrlParam.startsWith("/") || returnUrlParam.startsWith("//")) {
      return "/dashboard";
    }

    return returnUrlParam;
  };

  const maskedVerificationEmail = React.useMemo(() => {
    if (!verificationEmail.includes("@")) return verificationEmail;
    const [name, domain] = verificationEmail.split("@");
    return `${name.slice(0, 2)}${"*".repeat(Math.max(1, name.length - 2))}@${domain}`;
  }, [verificationEmail]);

  const openVerificationModal = (userId: string, userEmail: string) => {
    setVerificationUserId(userId);
    setVerificationEmail(userEmail);
    setVerificationOtp("");
    setVerificationError(null);
    setVerificationSuccess(null);
    setIsOtpModalOpen(true);
  };

  const handleUnverifiedAccount = (submitError: unknown) => {
    if (
      !(submitError instanceof ApiClientError) ||
      submitError.status !== 403 ||
      submitError.data.code !== "EMAIL_NOT_VERIFIED"
    ) {
      return false;
    }

    const unverifiedUserId =
      typeof submitError.data.data === "object" &&
        submitError.data.data &&
        typeof (submitError.data.data as { userId?: unknown }).userId === "string"
        ? ((submitError.data.data as { userId: string }).userId)
        : null;
    const unverifiedEmail =
      typeof submitError.data.data === "object" &&
        submitError.data.data &&
        typeof (submitError.data.data as { email?: unknown }).email === "string"
        ? ((submitError.data.data as { email: string }).email)
        : normalizedEmail;

    if (!unverifiedUserId) {
      return false;
    }

    notifyInfo("Account not verified", "Enter the code sent to your email to finish verification.");
    openVerificationModal(unverifiedUserId, unverifiedEmail);
    return true;
  };

  const tryRecoverFailedSignup = async () => {
    if (!normalizedEmail || !password) {
      return false;
    }

    try {
      const recoveredUser = await login(normalizedEmail, password);
      notifyInfo("Account recovered", "Your account was created. Continue with email verification.");
      if (recoveredUser.isVerified) {
        router.replace(getSafeReturnUrl());
      } else {
        openVerificationModal(recoveredUser.id, recoveredUser.email);
      }
      return true;
    } catch (recoveryError) {
      if (handleUnverifiedAccount(recoveryError)) {
        return true;
      }
      return false;
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVerificationError(null);
    setVerificationSuccess(null);

    const parsedOtp = Number(verificationOtp);
    if (!Number.isInteger(parsedOtp) || verificationOtp.trim().length !== 6) {
      setVerificationError("Enter the 6-digit OTP sent to your email.");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      await authApi.verifyEmailOtp(verificationUserId, parsedOtp);
      setVerificationSuccess("Email verified successfully. Redirecting now...");
      notifySuccess("Email verified", "Your account is ready.");
      await refreshMe().catch(() => undefined);
      router.replace(getSafeReturnUrl());
    } catch (submitError) {
      setVerificationError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to verify OTP right now."
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setVerificationError(null);
    setVerificationSuccess(null);
    setIsResendingOtp(true);
    try {
      await authApi.resendEmailOtp(verificationEmail);
      setVerificationSuccess("A new OTP has been sent to your email.");
    } catch (submitError) {
      setVerificationError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to resend OTP right now."
      );
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleWrongAccount = async () => {
    setVerificationOtp("");
    setVerificationError(null);
    setVerificationSuccess(null);

    try {
      await authApi.logout();
    } catch {
    } finally {
      setIsOtpModalOpen(false);
      setIsSignUp(true);
    }
  };

  useEffect(() => {
    if (!googleReady || typeof window === "undefined" || !window.google) return;
    if (!googleClientId) return;

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response: { credential?: string }) => {
        if (!response.credential) {
          setError("Google authentication failed. Please try again.");
          return;
        }
        setError(null);
        setIsSubmitting(true);
        try {
          const user = await loginWithGoogle(response.credential);
          if (user.isVerified) {
            router.replace(getSafeReturnUrl());
          } else {
            openVerificationModal(user.id, user.email);
          }
        } catch (submitError) {
          setError(
            submitError instanceof Error
              ? submitError.message
              : "Google sign in failed. Please try again."
          );
        } finally {
          setIsSubmitting(false);
        }
      },
    });

    const target = document.getElementById("google-signin-button");
    if (target) {
      target.innerHTML = "";
      window.google.accounts.id.renderButton(target, {
        theme: "outline",
        size: "large",
        text: isSignUp ? "signup_with" : "signin_with",
        shape: "pill",
        width: 360,
      });
    }
  }, [googleClientId, googleEnabled, googleLoadFailed, googleReady, isSignUp, loginWithGoogle, router]);

  useEffect(() => {
    if (signIn === "signIn") {
      setIsSignUp(false);
    }
  }, [signIn]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.isVerified) {
        router.replace(getSafeReturnUrl());
        return;
      }

      openVerificationModal(user.id, user.email);
    }
  }, [isAuthenticated, isLoading, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        const user = await register({
          email,
          password,
          firstName,
          lastName,
          philanthropicName,
          phoneNumber,
        });
        notifySuccess("Account created", "Check your email to complete verification.");
        openVerificationModal(user.id, user.email);
      } else {
        const user = await login(email, password);
        notifySuccess("Login successful", "Welcome back to TorchLife.");
        if (user.isVerified) {
          router.replace(getSafeReturnUrl());
        } else {
          openVerificationModal(user.id, user.email);
        }
      }
    } catch (submitError) {
      if (
        isSignUp &&
        submitError instanceof ApiClientError &&
        submitError.status === 500 &&
        submitError.message === "User creation failed."
      ) {
        const recovered = await tryRecoverFailedSignup();
        if (recovered) {
          return;
        }
      }
      if (handleUnverifiedAccount(submitError)) {
        return;
      }

      const message =
        isSignUp &&
          submitError instanceof ApiClientError &&
          submitError.status === 500 &&
          submitError.message === "User creation failed."
          ? "We could not finish setting up your account right now. If this email was just registered, try signing in to continue verification."
          : submitError instanceof Error
            ? submitError.message
            : "Authentication failed. Please try again.";
      setError(message);
      notifyError(isSignUp ? "Sign up failed" : "Login failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setGoogleReady(true)}
        onError={() => setGoogleLoadFailed(true)}
      />
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
                  <>
                    <div>
                      <Label>First Name</Label>
                      <Input
                        required
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Last Name</Label>
                      <Input
                        required
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Philanthropic Name</Label>
                      <Input
                        required
                        value={philanthropicName}
                        onChange={(event) => setPhilanthropicName(event.target.value)}
                        placeholder="How you want to be recognized"
                      />
                    </div>

                    <div>
                      <Label>Phone Number</Label>
                      <Input
                        required
                        inputMode="tel"
                        placeholder="+2348012345678"
                        value={phoneNumber}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                      />
                    </div>
                  </>
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
                  <div className="relative">
                    <Input
                      required
                      type={showPassword ? "text" : "password"}
                      minLength={8}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((previous) => !previous)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                </div>

                {isSignUp ? (
                  <div>
                    <Label>Confirm Password</Label>
                    <div className="relative">
                      <Input
                        required
                        type={showConfirmPassword ? "text" : "password"}
                        minLength={8}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowConfirmPassword((previous) => !previous)}
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
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

                {!isSignUp ? (
                  <div className="text-right">
                    <Link
                      href="/auth/reset-password"
                      className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                ) : null}
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Or continue with
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
                  <GoogleLogo />
                  <span>{isSignUp ? "Sign up with Google" : "Sign in with Google"}</span>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  Use your Google account for a faster {isSignUp ? "sign up" : "sign in"} experience.
                </p>

                {googleClientId ? null : (
                  <p className="rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
                    Google SSO is not configured yet. Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to enable it.
                  </p>
                )}

                {googleLoadFailed ? (
                  <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    Unable to load Google sign-in right now. Please refresh and try again.
                  </p>
                ) : null}

                <div
                  id="google-signin-button"
                  className="flex min-h-11 justify-center"
                  aria-label={isSignUp ? "Sign up with Google" : "Sign in with Google"}
                />

                {!googleEnabled && googleClientId && !googleLoadFailed ? (
                  <div className="flex h-11 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                    Loading Google sign-in...
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Verify your email</DialogTitle>
            <DialogDescription className="text-center">
              Enter the 6-digit code sent to {maskedVerificationEmail || "your email"} to finish your account setup.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                value={verificationOtp}
                onChange={(value) => setVerificationOtp(value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                containerClassName="justify-center"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {verificationError ? (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {verificationError}
              </p>
            ) : null}

            {verificationSuccess ? (
              <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                {verificationSuccess}
              </p>
            ) : null}

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                disabled={isVerifyingOtp || verificationOtp.trim().length !== 6}
              >
                {isVerifyingOtp ? "Verifying..." : "Verify Email"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendOtp}
                disabled={isResendingOtp || !verificationEmail}
              >
                {isResendingOtp ? "Resending..." : "Resend OTP"}
              </Button>
              <button
                type="button"
                className="block w-full text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
                onClick={() => void handleWrongAccount()}
              >
                Use another account
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
