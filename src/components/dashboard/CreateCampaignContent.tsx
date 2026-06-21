"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, UploadCloud } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Progress } from "@/src/components/ui/progress";
import { useAuth } from "@/src/contexts/AuthContext";
import { campaignApi } from "@/src/lib/api/campaigns";
import { notifyError, notifySuccess } from "@/src/lib/notify";
import { formatMoney } from "./dashboard-helpers";

const formatDateInput = (date: Date) => date.toISOString().slice(0, 10);

const buildRelativeDate = (daysAhead: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date;
};

const createTitleSuggestions = (beneficiaryName: string) => [
  `A Complication Changed Everything For ${beneficiaryName}`,
  `The Unexpected Happened For ${beneficiaryName}`,
  `A Pregnancy Emergency Changed Everything For ${beneficiaryName}`,
  `${beneficiaryName} Is Racing Against Time`,
];

type StepId = "beneficiary" | "story" | "hospital" | "uploads" | "review" | "submit";

const steps: Array<{ id: StepId; label: string }> = [
  { id: "beneficiary", label: "Beneficiary" },
  { id: "story", label: "Story" },
  { id: "hospital", label: "Hospital" },
  { id: "uploads", label: "Uploads" },
  { id: "review", label: "Review" },
  { id: "submit", label: "Submit" },
];

export default function CreateCampaignContent() {
  const { user } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);

  const [campaignType, setCampaignType] = useState<"USER" | "PROXY">("USER");
  const [proxyName, setProxyName] = useState("");
  const [proxyEmail, setProxyEmail] = useState("");
  const [proxyPhone, setProxyPhone] = useState("");

  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [targetAmount, setTargetAmount] = useState("500000");
  const [deadline, setDeadline] = useState(() => formatDateInput(buildRelativeDate(2)));

  const [hospitalName, setHospitalName] = useState("");
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [hospitalContact, setHospitalContact] = useState("");
  const [hospitalContactPersonName, setHospitalContactPersonName] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [certifiedPdf, setCertifiedPdf] = useState<File | null>(null);
  const [recordFile, setRecordFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const minDeadline = useMemo(() => formatDateInput(new Date()), []);
  const maxDeadline = useMemo(() => formatDateInput(buildRelativeDate(2)), []);
  const beneficiaryName = useMemo(() => {
    if (campaignType === "PROXY" && proxyName.trim()) {
      return proxyName.trim();
    }

    const selfName =
      user?.philanthropicName ||
      [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();

    return selfName || "the beneficiary";
  }, [campaignType, proxyName, user?.firstName, user?.lastName, user?.philanthropicName]);
  const titleSuggestions = useMemo(
    () => createTitleSuggestions(beneficiaryName),
    [beneficiaryName]
  );

  const progressValue = useMemo(() => {
    const total = steps.length - 1;
    if (total <= 0) return 0;
    return Math.round((stepIndex / total) * 100);
  }, [stepIndex]);

  const derivedRecord = useMemo(() => {
    const parts = [
      hospitalName ? `Hospital: ${hospitalName}` : null,
      hospitalAddress ? `Address: ${hospitalAddress}` : null,
      hospitalContact ? `Hospital Contact: ${hospitalContact}` : null,
      hospitalContactPersonName ? `Contact Person: ${hospitalContactPersonName}` : null,
      medicalNotes ? `Medical Notes: ${medicalNotes}` : null,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(" | ") : "Hospital details to be updated.";
  }, [hospitalAddress, hospitalContact, hospitalContactPersonName, hospitalName, medicalNotes]);

  const formattedTarget = useMemo(() => {
    const parsed = Number(targetAmount);
    return Number.isFinite(parsed) ? formatMoney(parsed) : "—";
  }, [targetAmount]);

  const currentStep = steps[stepIndex]?.id ?? "beneficiary";

  const goNext = () => setStepIndex((previous) => Math.min(previous + 1, steps.length - 1));
  const goBack = () => setStepIndex((previous) => Math.max(previous - 1, 0));

  useEffect(() => {
    if (!isSubmitting) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isSubmitting]);

  const validateStep = () => {
    setError(null);

    if (currentStep === "beneficiary" && campaignType === "PROXY") {
      if (!proxyName.trim() || !proxyEmail.trim() || !proxyPhone.trim()) {
        setError("Fill in beneficiary name, email, and phone number.");
        return false;
      }
    }

    if (currentStep === "story") {
      if (!title.trim() || !story.trim()) {
        setError("Campaign title and story are required.");
        return false;
      }

      const amount = Number(targetAmount);
      if (!Number.isFinite(amount) || amount <= 0) {
        setError("Enter a valid target amount.");
        return false;
      }

      if (!deadline) {
        setError("Select a deadline.");
        return false;
      }

      if (deadline < minDeadline || deadline > maxDeadline) {
        setError("Campaign deadline must stay within today, tomorrow, or the day after tomorrow.");
        return false;
      }
    }

    if (currentStep === "hospital") {
      if (!hospitalName.trim()) {
        setError("Hospital name is required.");
        return false;
      }

      if (!hospitalContact.trim()) {
        setError("Hospital contact phone is required.");
        return false;
      }
    }

    if (currentStep === "uploads") {
      if (!coverImage) {
        setError("Upload a cover image before continuing.");
        return false;
      }

      if (!certifiedPdf) {
        setError("Upload the certified PDF document before continuing.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    const amount = Number(targetAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid target amount.");
      return;
    }

    if (!coverImage) {
      setError("Upload a cover image before submitting.");
      return;
    }

    if (!certifiedPdf) {
      setError("Upload the certified PDF document before submitting.");
      return;
    }

    if (deadline < minDeadline || deadline > maxDeadline) {
      const message = "Campaign deadline must stay within today, tomorrow, or the day after tomorrow.";
      setError(message);
      notifyError("Validation error", message);
      return;
    }

    if (!hospitalName.trim()) {
      const message = "Hospital name is required.";
      setError(message);
      notifyError("Validation error", message);
      return;
    }

    if (!hospitalContact.trim()) {
      const message = "Hospital contact phone is required.";
      setError(message);
      notifyError("Validation error", message);
      return;
    }

    setIsSubmitting(true);
    try {
      await campaignApi.createCampaignDashboard(
        {
          type: campaignType,
          title: title.trim(),
          story: story.trim(),
          record: derivedRecord,
          deadline: new Date(deadline).toISOString(),
          targetAmount: amount,
          proxyName: campaignType === "PROXY" ? proxyName.trim() : undefined,
          proxyEmail: campaignType === "PROXY" ? proxyEmail.trim() : undefined,
          proxyPhone: campaignType === "PROXY" ? proxyPhone.trim() : undefined,
          hospitalName: hospitalName.trim() || undefined,
          hospitalContact: hospitalContact.trim() || undefined,
          hospitalContactPersonName: hospitalContactPersonName.trim() || undefined,
          location: [hospitalName.trim(), hospitalAddress.trim()].filter(Boolean).join(", ") || undefined,
          coverImage,
          certifiedPdf,
          recordFile: recordFile ?? undefined,
        },
        {
          onProgress: setUploadProgress,
        }
      );

      setSuccess("Campaign submitted successfully. Waiting for approval.");
      notifySuccess("Campaign submitted successfully", "Your campaign is now awaiting admin review.");
      setStepIndex(steps.findIndex((step) => step.id === "submit"));
      setCoverImage(null);
      setCertifiedPdf(null);
      setRecordFile(null);
      setTitle("");
      setStory("");
      setProxyName("");
      setProxyEmail("");
      setProxyPhone("");
      setHospitalName("");
      setHospitalAddress("");
      setHospitalContact("");
      setHospitalContactPersonName("");
      setMedicalNotes("");
      setTargetAmount("500000");
      setDeadline(formatDateInput(buildRelativeDate(2)));
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit campaign right now.";
      setError(message);
      notifyError("Campaign submission failed", message);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(100);
    }
  };

  return (
    <div className="space-y-6">
      {isSubmitting ? (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" aria-hidden="true">
          <div className="flex h-full items-center justify-center px-4">
            <div className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-xl">
              <p className="text-lg font-semibold">Uploading campaign files</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Please wait while TorchLife saves your campaign. Navigation is locked until upload completes.
              </p>
              <Progress value={uploadProgress} className="mt-4" />
              <p className="mt-3 text-sm font-medium">{uploadProgress}% complete</p>
            </div>
          </div>
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Create Campaign</CardTitle>
          <CardDescription>
            Follow the steps to create a campaign. Your submission goes straight to the backend for review and approval.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {steps.map((step, index) => (
                <Badge
                  key={step.id}
                  variant={index === stepIndex ? "default" : "outline"}
                  className="rounded-full"
                >
                  {step.label}
                </Badge>
              ))}
            </div>
            <Progress value={progressValue} />
          </div>
        </CardContent>
      </Card>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to continue</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {success ? (
        <Alert>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      ) : null}

      {currentStep === "beneficiary" ? (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Beneficiary Information</CardTitle>
            <CardDescription>Select who this campaign is for.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant={campaignType === "USER" ? "default" : "outline"}
                onClick={() => setCampaignType("USER")}
              >
                For myself
              </Button>
              <Button
                type="button"
                variant={campaignType === "PROXY" ? "default" : "outline"}
                onClick={() => setCampaignType("PROXY")}
              >
                For someone else
              </Button>
            </div>

            {campaignType === "PROXY" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Beneficiary Name</Label>
                  <Input value={proxyName} onChange={(e) => setProxyName(e.target.value)} />
                </div>
                <div>
                  <Label>Beneficiary Email</Label>
                  <Input
                    type="email"
                    value={proxyEmail}
                    onChange={(e) => setProxyEmail(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Beneficiary Phone</Label>
                  <Input
                    inputMode="tel"
                    placeholder="+2348012345678"
                    value={proxyPhone}
                    onChange={(e) => setProxyPhone(e.target.value)}
                  />
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {currentStep === "story" ? (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Campaign Story</CardTitle>
            <CardDescription>Tell supporters what happened and what you need.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              <div className="flex flex-wrap gap-2 pt-2">
                {titleSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:bg-muted/40"
                    onClick={() => setTitle(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Story</Label>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="min-h-40 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Target Amount (NGN)</Label>
                <Input
                  inputMode="numeric"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value.replace(/[^\d]/g, ""))}
                />
                <p className="text-xs text-muted-foreground">Preview: {formattedTarget}</p>
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input
                  type="date"
                  min={minDeadline}
                  max={maxDeadline}
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Campaigns must end within today, tomorrow, or the day after tomorrow.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {currentStep === "hospital" ? (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Hospital Details</CardTitle>
            <CardDescription>Provide the hospital context supporters can understand.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Hospital Name</Label>
              <Input value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Hospital Address</Label>
              <Input value={hospitalAddress} onChange={(e) => setHospitalAddress(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Hospital Contact Phone</Label>
              <Input
                inputMode="tel"
                placeholder="+2348012345678"
                value={hospitalContact}
                onChange={(e) => setHospitalContact(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Hospital Contact Person Name (Optional)</Label>
              <Input
                value={hospitalContactPersonName}
                onChange={(e) => setHospitalContactPersonName(e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Medical Notes</Label>
              <Input value={medicalNotes} onChange={(e) => setMedicalNotes(e.target.value)} />
            </div>
            <div className="sm:col-span-2 rounded-2xl border bg-muted/30 p-4 text-sm text-muted-foreground">
              Saved summary: {derivedRecord}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {currentStep === "uploads" ? (
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Uploads</CardTitle>
            <CardDescription>Upload your cover image, certified PDF, and records.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UploadField
              label="Cover Image"
              accept="image/*"
              file={coverImage}
              onChange={setCoverImage}
              disabled={isSubmitting}
            />
            <UploadField
              label="Certified PDF"
              accept="application/pdf"
              file={certifiedPdf}
              onChange={setCertifiedPdf}
              disabled={isSubmitting}
            />
            <UploadField
              label="Medical Record (optional)"
              accept="image/*,application/pdf"
              file={recordFile}
              onChange={setRecordFile}
              disabled={isSubmitting}
            />
            {isSubmitting ? (
              <div className="rounded-2xl border bg-muted/30 p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">Upload progress</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="mt-3" />
                <p className="mt-3 text-muted-foreground">
                  Upload in progress. Navigation is temporarily locked to prevent accidental data loss.
                </p>
              </div>
            ) : null}
            <div className="rounded-2xl border bg-muted/30 p-4 text-sm text-muted-foreground">
              Cover image and certified PDF are required because the backend validates both at submission time. Supporting medical records remain optional.
            </div>
          </CardContent>
        </Card>
      ) : null}

      {currentStep === "review" ? (
        <Card>
          <CardHeader>
            <CardTitle>Step 5: Review</CardTitle>
            <CardDescription>Confirm everything before submitting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <ReviewRow label="Type" value={campaignType === "USER" ? "Self" : "Proxy"} />
            {campaignType === "PROXY" ? (
              <>
                <ReviewRow label="Beneficiary" value={proxyName || "—"} />
                <ReviewRow label="Beneficiary Email" value={proxyEmail || "—"} />
                <ReviewRow label="Beneficiary Phone" value={proxyPhone || "—"} />
              </>
            ) : null}
            <ReviewRow label="Title" value={title || "—"} />
            <ReviewRow label="Target" value={formattedTarget} />
            <ReviewRow label="Deadline" value={deadline || "—"} />
            <ReviewRow label="Story" value={story ? `${story.slice(0, 140)}${story.length > 140 ? "..." : ""}` : "—"} />
            <ReviewRow label="Hospital Summary" value={derivedRecord} />
            <ReviewRow label="Cover Image" value={coverImage ? coverImage.name : "Not uploaded"} />
            <ReviewRow label="Certified PDF" value={certifiedPdf ? certifiedPdf.name : "Not uploaded"} />
            <ReviewRow label="Record File" value={recordFile ? recordFile.name : "Not uploaded"} />
          </CardContent>
        </Card>
      ) : null}

      {currentStep === "submit" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-primary" />
              Campaign Submitted
            </CardTitle>
            <CardDescription>
              Your campaign is now pending approval. Once approved it will appear on the public campaigns page and inside dashboard discovery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" onClick={() => setStepIndex(0)} variant="outline">
              Create another campaign
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={goBack} disabled={stepIndex === 0 || isSubmitting}>
          <ChevronLeft className="mr-2 size-4" />
          Back
        </Button>

        {currentStep === "review" ? (
          <Button
            type="button"
            className="gap-2"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <UploadCloud className="size-4" />
                Submitting...
              </>
            ) : (
              <>
                <UploadCloud className="size-4" />
                Submit Campaign
              </>
            )}
          </Button>
        ) : currentStep === "submit" ? null : (
          <Button
            type="button"
            onClick={() => {
              if (!validateStep()) return;
              goNext();
            }}
            disabled={isSubmitting}
          >
            Next
            <ChevronRight className="ml-2 size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function UploadField({
  label,
  accept,
  file,
  onChange,
  disabled = false,
}: {
  label: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">{label}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {file ? `Selected: ${file.name}` : "No file selected"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept={accept}
            disabled={disabled}
            onChange={(event) => onChange(event.target.files?.[0] ?? null)}
          />
          {file ? (
            <Button variant="outline" type="button" onClick={() => onChange(null)} disabled={disabled}>
              Clear
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border bg-muted/20 px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
