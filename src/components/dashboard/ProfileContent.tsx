"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ExternalLink, Eye, EyeOff, Mail } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { authApi } from "@/src/lib/api/auth";
import { userApi } from "@/src/lib/api/users";
import { useAuth } from "@/src/contexts/AuthContext";
import type { User } from "@/src/types";

type ProfileContentProps = {
  user: User;
};

const communityLinks = [
  { label: "Youtube", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Twitter/X", href: "#" },
  { label: "LinkedIn", href: "#" },
];

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "info@torchlife.co";
const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+234 000 000 0000";

export default function ProfileContent({ user }: ProfileContentProps) {
  const { refreshMe } = useAuth();
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const philanthropicNameValue = user.philanthropicName || fullName;

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [philanthropicName, setPhilanthropicName] = useState(philanthropicNameValue);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setPhoneNumber(user.phoneNumber || "");
    const nextPhilanthropic = user.philanthropicName || `${user.firstName} ${user.lastName}`.trim();
    setPhilanthropicName(nextPhilanthropic);
  }, [user.firstName, user.lastName, user.phoneNumber, user.philanthropicName]);

  const createdDate = useMemo(() => user.createdAt.toLocaleDateString(), [user.createdAt]);

  const handleSaveProfile = async () => {
    setProfileError(null);
    setProfileSuccess(null);

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedPhilanthropicName = philanthropicName.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedFirstName || !trimmedLastName || !trimmedPhilanthropicName) {
      setProfileError("First name, last name, and philanthropic name are required.");
      return;
    }

    setIsSavingProfile(true);
    try {
      await userApi.updateMe({
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        philanthropicName: trimmedPhilanthropicName,
        phoneNumber: trimmedPhone.length > 0 ? trimmedPhone : undefined,
      });
      await refreshMe();
      setProfileSuccess("Profile updated successfully.");
    } catch (submitError) {
      setProfileError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to update profile right now."
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await authApi.resetPassword(user.email, currentPassword, newPassword);
      setPasswordSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (submitError) {
      setPasswordError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to update password right now."
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            View your account details and use the secure password reset flow when you need to update your password.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>{fullName}</CardTitle>
            <CardDescription>Your email stays locked. Contact support for email updates.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border bg-muted/30 p-4">
              <Label className="text-sm text-muted-foreground">First Name</Label>
              <Input value={firstName} onChange={(event) => setFirstName(event.target.value)} />
            </div>
            <div className="rounded-2xl border bg-muted/30 p-4">
              <Label className="text-sm text-muted-foreground">Last Name</Label>
              <Input value={lastName} onChange={(event) => setLastName(event.target.value)} />
            </div>
            <div className="rounded-2xl border bg-muted/30 p-4">
              <Label className="text-sm text-muted-foreground">Philanthropic Name</Label>
              <Input
                value={philanthropicName}
                onChange={(event) => setPhilanthropicName(event.target.value)}
              />
            </div>
            <div className="rounded-2xl border bg-muted/30 p-4">
              <Label className="text-sm text-muted-foreground">Phone</Label>
              <Input
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="+2348012345678"
              />
            </div>
            <ProfileField label="Email" value={user.email} icon={<Mail className="size-4" />} readonly />
            <ProfileField label="Created Date" value={createdDate} icon={<CalendarDays className="size-4" />} />
            <div className="rounded-2xl border bg-muted/30 p-4">
              <p className="text-sm font-medium">Verification status</p>
              <Badge variant="outline" className="mt-3 rounded-full">
                {user.isVerified ? "Verified" : "Pending verification"}
              </Badge>
            </div>
          </CardContent>
          <CardContent className="pt-0 space-y-3">
            {profileError ? (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {profileError}
              </p>
            ) : null}
            {profileSuccess ? (
              <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                {profileSuccess}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                {isSavingProfile ? "Saving..." : "Save Profile"}
              </Button>
              <Button variant="outline" onClick={() => setPasswordDialogOpen(true)}>
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Join Community</CardTitle>
              <CardDescription>
                Placeholder community links are ready here and can move to env-driven links later.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {communityLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-colors hover:bg-muted/40"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="size-4 text-muted-foreground" />
                </a>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-primary/5 via-emerald-50 to-background">
            <CardHeader>
              <CardTitle>Need help?</CardTitle>
              <CardDescription>Reach support directly if you need help with your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <a href={`mailto:${supportEmail}`} className="block rounded-2xl border bg-background/80 px-4 py-3">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold text-primary">{supportEmail}</p>
              </a>
              <div className="rounded-2xl border bg-background/80 px-4 py-3">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold">{supportPhone}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={passwordDialogOpen}
        onOpenChange={(open) => {
          setPasswordDialogOpen(open);
          if (!open) {
            setPasswordError(null);
            setPasswordSuccess(null);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
            setIsUpdatingPassword(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input value={user.email} readOnly />
            </div>
            <div>
              <Label>Current Password</Label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowCurrentPassword((previous) => !previous)}
                >
                  {showCurrentPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>
            <div>
              <Label>New Password</Label>
              <div className="relative">
                <Input
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
              <Label>Confirm New Password</Label>
              <div className="relative">
                <Input
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
            {passwordError ? (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {passwordError}
              </p>
            ) : null}
            {passwordSuccess ? (
              <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                {passwordSuccess}
              </p>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setPasswordDialogOpen(false)}>
              Close
            </Button>
            <Button type="button" onClick={handleUpdatePassword} disabled={isUpdatingPassword}>
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProfileField({
  label,
  value,
  icon,
  readonly = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  readonly?: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 font-medium">{value}</p>
      {readonly ? (
        <p className="mt-1 text-xs text-muted-foreground">Read only</p>
      ) : null}
    </div>
  );
}
