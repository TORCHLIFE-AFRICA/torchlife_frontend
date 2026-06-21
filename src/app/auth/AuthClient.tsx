"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Script from "next/script";
import { Navbar } from "@/src/components/landingPage/navbar";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
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

// #region debug-point google-sso-frontend-report
async function reportGoogleSsoDebug(event: string, payload: Record<string, unknown> = {}) {
  try {
    await fetch("http://127.0.0.1:7777/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "google-sso",
        source: "frontend",
        event,
        hypothesisId: payload.hypothesisId ?? null,
        runId: "pre",
        ts: new Date().toISOString(),
        payload,
      }),
      keepalive: true,
    });
  } catch {
    // Intentionally ignore debug transport failures.
  }
}
// #endregion debug-point google-sso-frontend-report

// #region debug-point login-invalid-credentials-frontend-report
async function reportLoginDebug(event: string, payload: Record<string, unknown> = {}) {
  try {
    await fetch("http://127.0.0.1:7777/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "login-invalid-credentials",
        source: "frontend",
        event,
        hypothesisId: payload.hypothesisId ?? null,
        runId: "pre",
        ts: new Date().toISOString(),
        payload,
      }),
      keepalive: true,
    });
  } catch {
    // Intentionally ignore debug transport failures.
  }
}
// #endregion debug-point login-invalid-credentials-frontend-report

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

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, loginWithGoogle, register, isAuthenticated, isLoading } = useAuth();
  const signIn = searchParams.get("auth");
  const returnUrlParam = searchParams.get("returnUrl");
  const [googleReady, setGoogleReady] = useState(false);
  const [googleLoadFailed, setGoogleLoadFailed] = useState(false);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const googleEnabled = googleReady && !googleLoadFailed && !!googleClientId;

  const getSafeReturnUrl = () => {
    if (!returnUrlParam || !returnUrlParam.startsWith("/") || returnUrlParam.startsWith("//")) {
      return "/dashboard";
    }

    return returnUrlParam;
  };

  const getVerificationRoute = (userId: string, userEmail: string) => {
    const query = new URLSearchParams({
      userId,
      email: userEmail,
    });

    if (returnUrlParam) {
      query.set("returnUrl", getSafeReturnUrl());
    }

    return `/auth/verify-email?${query.toString()}`;
  };

  useEffect(() => {
    void reportGoogleSsoDebug("google_sso_auth_client_state", {
      hypothesisId: "A",
      googleReady,
      googleLoadFailed,
      hasGoogleObject: typeof window !== "undefined" ? !!window.google : false,
      hasGoogleClientId: !!googleClientId,
      googleClientIdSuffix: googleClientId ? googleClientId.slice(-24) : null,
      apiBaseUrl: process.env.NEXT_PUBLIC_API_URL ?? null,
      googleEnabled,
      mode: isSignUp ? "signup" : "signin",
    });

    if (!googleReady || typeof window === "undefined" || !window.google) return;
    if (!googleClientId) return;

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response: { credential?: string }) => {
        void reportGoogleSsoDebug("google_sso_callback_received", {
          hypothesisId: "D",
          hasCredential: !!response.credential,
          credentialLength: response.credential?.length ?? 0,
          mode: isSignUp ? "signup" : "signin",
        });

        if (!response.credential) {
          setError("Google authentication failed. Please try again.");
          return;
        }
        setError(null);
        setIsSubmitting(true);
        try {
          void reportGoogleSsoDebug("google_sso_login_request_start", {
            hypothesisId: "B",
            apiBaseUrl: process.env.NEXT_PUBLIC_API_URL ?? null,
            mode: isSignUp ? "signup" : "signin",
          });
          const user = await loginWithGoogle(response.credential);
          void reportGoogleSsoDebug("google_sso_login_request_success", {
            hypothesisId: "E",
            mode: isSignUp ? "signup" : "signin",
            isVerified: user.isVerified,
          });
          router.replace(
            user.isVerified
              ? getSafeReturnUrl()
              : getVerificationRoute(user.id, user.email)
          );
        } catch (submitError) {
          void reportGoogleSsoDebug("google_sso_login_request_failure", {
            hypothesisId: "B",
            message: submitError instanceof Error ? submitError.message : "Unknown Google sign in error",
            mode: isSignUp ? "signup" : "signin",
          });
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
      void reportGoogleSsoDebug("google_sso_button_rendered", {
        hypothesisId: "D",
        mode: isSignUp ? "signup" : "signin",
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
      router.replace(
        user.isVerified
          ? getSafeReturnUrl()
          : getVerificationRoute(user.id, user.email)
      );
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
        router.replace(getVerificationRoute(user.id, user.email));
      } else {
        void reportLoginDebug("auth_signin_submit", {
          hypothesisId: "C",
          isSignUp,
          rawEmailValue: email,
          normalizedIdentifier: email.trim().toLowerCase(),
          passwordLength: password.length,
        });
        const user = await login(email, password);
        void reportLoginDebug("auth_signin_submit_success", {
          hypothesisId: "E",
          userId: user.id,
          email: user.email,
          isVerified: user.isVerified,
        });
        notifySuccess("Login successful", "Welcome back to TorchLife.");
        router.replace(
          user.isVerified
            ? getSafeReturnUrl()
            : getVerificationRoute(user.id, user.email)
        );
      }
    } catch (submitError) {
      void reportLoginDebug("auth_signin_submit_failure", {
        hypothesisId:
          submitError instanceof ApiClientError && submitError.status === 403
            ? "B"
            : "A",
        errorName: submitError instanceof Error ? submitError.name : "UnknownError",
        message: submitError instanceof Error ? submitError.message : "Authentication failed",
        status: submitError instanceof ApiClientError ? submitError.status : null,
        code:
          submitError instanceof ApiClientError &&
            typeof submitError.data.code === "string"
            ? submitError.data.code
            : null,
      });
      if (
        submitError instanceof ApiClientError &&
        submitError.status === 403 &&
        submitError.data.code === "EMAIL_NOT_VERIFIED"
      ) {
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
            : email.trim().toLowerCase();

        if (unverifiedUserId) {
          notifyInfo("Account not verified", "We redirected you to complete email verification.");
          router.replace(getVerificationRoute(unverifiedUserId, unverifiedEmail));
          return;
        }
      }

      const message =
        submitError instanceof Error
          ? submitError.message
          : "Authentication failed. Please try again.";
      setError(message);
      notifyError("Login failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          void reportGoogleSsoDebug("google_sso_script_loaded", {
            hypothesisId: "D",
          });
          setGoogleReady(true);
        }}
        onError={() => {
          void reportGoogleSsoDebug("google_sso_script_failed", {
            hypothesisId: "D",
          });
          setGoogleLoadFailed(true);
        }}
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
                      Reset password?
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
    </div>
  );
}
