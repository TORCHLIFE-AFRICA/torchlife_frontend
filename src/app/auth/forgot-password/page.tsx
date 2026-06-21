"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { Navbar } from "@/src/components/landingPage/navbar";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { authApi } from "@/src/lib/api/auth";

// #region debug-point reset-password-frontend-report
async function reportResetPasswordDebug(
  event: string,
  payload: Record<string, unknown> = {}
) {
  try {
    await fetch("http://127.0.0.1:7777/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "reset-password-endpoint",
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
// #endregion debug-point reset-password-frontend-report

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      void reportResetPasswordDebug("reset_password_submit", {
        hypothesisId: "B",
        identifier: identifier.trim(),
        oldPasswordLength: oldPassword.length,
        newPasswordLength: newPassword.length,
      });
      await authApi.resetPassword(
        identifier.trim(),
        oldPassword,
        newPassword
      );
      void reportResetPasswordDebug("reset_password_submit_success", {
        hypothesisId: "D",
        identifier: identifier.trim(),
      });
      setSuccess("Password reset successful. You can now sign in with your new password.");
      setIdentifier("");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (submitError) {
      void reportResetPasswordDebug("reset_password_submit_failure", {
        hypothesisId: "E",
        identifier: identifier.trim(),
        message:
          submitError instanceof Error
            ? submitError.message
            : "Unable to reset password right now.",
      });
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to reset password right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-md rounded-2xl border bg-card p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-center">Reset Password</h1>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Update your password using your email address or phone number, your current password, and a new password.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <Label htmlFor="identifier">Email or Phone Number</Label>
                <Input
                  id="identifier"
                  required
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="you@example.com or +2348012345678"
                />
              </div>

              <div>
                <Label htmlFor="old-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="old-password"
                    required
                    minLength={8}
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(event) => setOldPassword(event.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    aria-label={showOldPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowOldPassword((previous) => !previous)}
                  >
                    {showOldPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    required
                    minLength={8}
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowNewPassword((previous) => !previous)}
                  >
                    {showNewPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    required
                    minLength={8}
                    type={showConfirmPassword ? "text" : "password"}
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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/auth?auth=signIn" className="font-medium text-primary underline-offset-4 hover:underline">
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
