"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Copy,
  Facebook,
  Globe2,
  HeartHandshake,
  Info,
  Linkedin,
  PencilLine,
  Share2,
  Trash2,
  Twitter,
  UserRound,
} from "lucide-react";

import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { EmptyState } from "@/src/components/ui/empty-state";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Progress } from "@/src/components/ui/progress";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Switch } from "@/src/components/ui/switch";
import { Textarea } from "@/src/components/ui/textarea";
import CountdownLabel from "@/src/components/shared/CountdownLabel";
import { useAuth } from "@/src/contexts/AuthContext";
import { campaignApi } from "@/src/lib/api/campaigns";
import { notifyError, notifyInfo, notifySuccess } from "@/src/lib/notify";
import { paymentApi } from "@/src/lib/api/payments";
import {
  CampaignStatus,
  UserRole,
  type Campaign,
  type CampaignExtensionAuditEntry,
  type SupportingDocumentRequest,
} from "@/src/types";

const formatMoney = (value: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

const getDaysRemaining = (deadline?: Date) => {
  if (!deadline) return 0;
  const diff = deadline.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const formatDate = (value?: Date) => {
  if (!value) return "Not available";
  return value.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (value?: Date) => {
  if (!value) return "Not available";
  return value.toLocaleString();
};

const formatDateInput = (value?: Date) => {
  if (!value) return "";
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const categoryOptions = [
  { value: "LOW", label: "General" },
  { value: "MEDIUM", label: "Urgent" },
  { value: "HIGH", label: "Critical" },
] as const;

const currencyOptions = [
  { value: "NGN", label: "NGN" },
  { value: "USD", label: "USD" },
] as const;

const campaignTypeOptions = [
  { value: "USER", label: "Direct campaign" },
  { value: "PROXY", label: "Proxy campaign" },
] as const;

const DONATION_PRESETS = [1000, 5000, 10000, 50000, 100000] as const;
const TIP_PRESETS = [500, 1000, 2000, 5000] as const;
const MIN_DONATION_AMOUNT = 300;

const parseCurrencyAmount = (value: string) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return Math.round(parsed);
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const calculatePlatformFee = (donationAmount: number) => {
  if (donationAmount <= 0) {
    return 0;
  }

  return Math.round(donationAmount * 0.025) + 200;
};

type CampaignPageContentProps = {
  campaignId: string;
  mode: "public" | "dashboard";
  initialCampaign?: Campaign | null;
};

type AdminAction =
  | "approve"
  | "reject"
  | "approve-extension"
  | "reject-extension"
  | "delete"
  | "restore"
  | "save-edit"
  | "extend";

type EditFormState = {
  type: "USER" | "PROXY";
  title: string;
  story: string;
  deadline: string;
  targetAmount: string;
  currency: "NGN" | "USD";
  location: string;
  priority: string;
  status: CampaignStatus;
  hospitalName: string;
  hospitalContact: string;
  hospitalContactPersonName: string;
  proxyName: string;
  proxyPhone: string;
  proxyEmail: string;
  proxyNote: string;
  approvalNotes: string;
  imageUrl: string;
  certifiedPdf: string;
  records: string[];
};

type DonationSelection = (typeof DONATION_PRESETS)[number] | "other";
type TipSelection = (typeof TIP_PRESETS)[number] | "custom" | null;

function ShareModal({
  open,
  onOpenChange,
  campaignTitle,
  campaignLink,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignTitle: string;
  campaignLink: string;
}) {
  const [copied, setCopied] = useState(false);

  const socialOptions = [
    {
      name: "WhatsApp",
      icon: <Share2 className="h-5 w-5 text-primary-foreground" />,
      url: `https://wa.me/?text=${encodeURIComponent(`Support this TorchLife campaign: ${campaignTitle} ${campaignLink}`)}`,
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5 text-primary-foreground" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignLink)}`,
    },
    {
      name: "X",
      icon: <Twitter className="h-5 w-5 text-primary-foreground" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Support this TorchLife campaign: ${campaignTitle}`)}&url=${encodeURIComponent(campaignLink)}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5 text-primary-foreground" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(campaignLink)}`,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this campaign</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {socialOptions.map((option) => (
            <Button
              key={option.name}
              className="w-full justify-start gap-3"
              onClick={() => window.open(option.url, "_blank", "noopener,noreferrer")}
            >
              <span className="rounded-full bg-primary p-2">{option.icon}</span>
              {option.name}
            </Button>
          ))}
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={async () => {
              await navigator.clipboard.writeText(campaignLink);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            <Copy className="h-4 w-4" />
            {copied ? "Link copied" : "Copy link"}
          </Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CampaignDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 rounded-3xl border bg-card p-4 shadow-sm sm:p-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full max-w-3xl" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <Skeleton className="h-[320px] w-full rounded-3xl sm:h-[420px]" />
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-36 rounded-3xl" />
            <Skeleton className="h-36 rounded-3xl" />
          </div>
          <Skeleton className="h-44 rounded-3xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-72 rounded-3xl" />
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="h-44 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

function DetailStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-muted/20 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function getStatusTone(status: Campaign["status"]) {
  if (status === "APPROVED") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "REJECTED") return "border-destructive/30 bg-destructive/10 text-destructive";
  return "border-sky-200 bg-sky-50 text-sky-700";
}

function getPublicCampaignLabel(isExpired: boolean, goal: number, raised: number) {
  if (isExpired) return "Expired";
  if (goal > 0 && raised >= goal) return "Completed";
  return "Verified Campaign";
}

export default function CampaignPageContent({
  campaignId,
  mode,
  initialCampaign = null,
}: CampaignPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();

  const [campaign, setCampaign] = useState<Campaign | null>(initialCampaign);
  const [isLoading, setIsLoading] = useState(!initialCampaign);
  const [error, setError] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [selectedDonationAmount, setSelectedDonationAmount] = useState<DonationSelection>(10000);
  const [customDonationAmount, setCustomDonationAmount] = useState("");
  const [selectedTipAmount, setSelectedTipAmount] = useState<TipSelection>(null);
  const [customTipAmount, setCustomTipAmount] = useState("");
  const [anonymousDonation, setAnonymousDonation] = useState(false);
  const [donorEmail, setDonorEmail] = useState("");
  const [confirmDonorEmail, setConfirmDonorEmail] = useState("");
  const [isSubmittingDonation, setIsSubmittingDonation] = useState(false);
  const [donationError, setDonationError] = useState<string | null>(null);
  const [moderationNotes, setModerationNotes] = useState("");
  const [adminActionError, setAdminActionError] = useState<string | null>(null);
  const [adminActionSuccess, setAdminActionSuccess] = useState<string | null>(null);
  const [busyAdminAction, setBusyAdminAction] = useState<AdminAction | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditFormState>({
    type: "USER",
    title: "",
    story: "",
    deadline: "",
    targetAmount: "",
    currency: "NGN",
    location: "",
    priority: "LOW",
    status: CampaignStatus.PENDING,
    hospitalName: "",
    hospitalContact: "",
    hospitalContactPersonName: "",
    proxyName: "",
    proxyPhone: "",
    proxyEmail: "",
    proxyNote: "",
    approvalNotes: "",
    imageUrl: "",
    certifiedPdf: "",
    records: [],
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [certifiedPdfFile, setCertifiedPdfFile] = useState<File | null>(null);
  const [supportingRecordFiles, setSupportingRecordFiles] = useState<File[]>([]);
  const [extensionDialogOpen, setExtensionDialogOpen] = useState(false);
  const [extensionDeadline, setExtensionDeadline] = useState("");
  const [extensionError, setExtensionError] = useState<string | null>(null);
  const [documentRequest, setDocumentRequest] = useState<SupportingDocumentRequest | null>(null);
  const [documentRequests, setDocumentRequests] = useState<SupportingDocumentRequest[]>([]);
  const [extensionAudits, setExtensionAudits] = useState<CampaignExtensionAuditEntry[]>([]);
  const [documentLinks, setDocumentLinks] = useState<{ certifiedPdf?: string | null; records: string[] } | null>(null);

  useEffect(() => {
    if (!campaignId) {
      setCampaign(null);
      setError("Campaign identifier is missing.");
      setIsLoading(false);
      return;
    }

    const matchesInitialCampaign =
      initialCampaign &&
      (initialCampaign.id === campaignId || initialCampaign.publicId === campaignId) &&
      (mode !== "public" || initialCampaign.status === "APPROVED");

    if (matchesInitialCampaign) {
      setCampaign(initialCampaign);
      setError(null);
      setIsLoading(false);
      return;
    }

    const loadCampaign = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data =
          mode === "public"
            ? await campaignApi.getPublicCampaign(campaignId)
            : await campaignApi.getCampaign(campaignId);
        setCampaign(data);
      } catch (loadError) {
        const message =
          loadError instanceof Error ? loadError.message : "Unable to load campaign right now.";
        setError(message);
        notifyError("Campaign fetch failed", message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadCampaign();
  }, [campaignId, initialCampaign, mode]);

  useEffect(() => {
    if (!campaign) return;

    setEditForm({
      type: campaign.type ?? "USER",
      title: campaign.title,
      story: campaign.story || campaign.description || "",
      deadline: formatDateInput(campaign.deadline ?? campaign.endDate),
      targetAmount: String(campaign.targetAmount ?? campaign.fundingGoal ?? ""),
      currency: campaign.currency === "USD" ? "USD" : "NGN",
      location: campaign.location ?? "",
      priority: campaign.priority ?? "LOW",
      status: campaign.status,
      hospitalName: campaign.hospitalName ?? "",
      hospitalContact: campaign.hospitalContact ?? "",
      hospitalContactPersonName: campaign.hospitalContactPersonName ?? "",
      proxyName: campaign.proxyName ?? "",
      proxyPhone: campaign.proxyPhone ?? "",
      proxyEmail: campaign.proxyEmail ?? "",
      proxyNote: campaign.proxyNote ?? "",
      approvalNotes: campaign.approvalNotes ?? "",
      imageUrl: campaign.imageUrl || campaign.image_url || "",
      certifiedPdf: campaign.certifiedPdf ?? "",
      records: campaign.records ?? [],
    });
    setCoverImageFile(null);
    setCertifiedPdfFile(null);
    setSupportingRecordFiles([]);
  }, [campaign]);

  useEffect(() => {
    if (searchParams.get("retryDonation") === "1") {
      const retryAmount = searchParams.get("amount");
      if (retryAmount) {
        const parsedRetryAmount = parseCurrencyAmount(retryAmount);

        if (
          parsedRetryAmount > 0 &&
          DONATION_PRESETS.includes(parsedRetryAmount as (typeof DONATION_PRESETS)[number])
        ) {
          setSelectedDonationAmount(parsedRetryAmount as (typeof DONATION_PRESETS)[number]);
          setCustomDonationAmount("");
        } else {
          setSelectedDonationAmount("other");
          setCustomDonationAmount(retryAmount);
        }
      }
      setDonationModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthenticated || !user?.email) {
      return;
    }

    setDonorEmail(user.email);
    setConfirmDonorEmail(user.email);
  }, [isAuthenticated, user?.email]);

  useEffect(() => {
    if (
      searchParams.get("donate") === "1" &&
      campaign?.status === "APPROVED" &&
      !campaign?.isDeleted
    ) {
      setDonationModalOpen(true);
    }
  }, [campaign?.isDeleted, campaign?.status, searchParams]);

  const shareLink = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/campaign/${campaign?.publicId || campaignId}`;
  }, [campaign?.publicId, campaignId]);

  const goal = campaign?.targetAmount ?? campaign?.fundingGoal ?? 0;
  const raised = campaign?.amountRaised ?? campaign?.currentAmount ?? 0;
  const remainingAmount = Math.max(0, goal - raised);
  const progress = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
  const deadline = campaign?.deadline ?? campaign?.endDate;
  const daysRemaining = getDaysRemaining(deadline);
  const isExpired = !!deadline && deadline.getTime() < Date.now();
  const categoryLabel =
    categoryOptions.find((option) => option.value === (campaign?.priority ?? "LOW"))?.label ??
    "General";
  const creatorName = campaign?.creator
    ? `${campaign.creator.firstName} ${campaign.creator.lastName}`.trim()
    : "TorchLife";
  const beneficiaryName = campaign?.proxyName || creatorName;
  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  const creatorId = campaign?.creatorId || campaign?.creator?.id || campaign?.user?.id;
  const isOwner = !!user && !!creatorId && creatorId === user.id;
  const isPublicViewer = !isAdmin && !isOwner;
  const backHref = isAdmin ? "/dashboard?tab=admin-campaigns" : "/dashboard?tab=campaigns";
  const backLabel = isAdmin ? "Back to admin campaigns" : "Back to campaigns";
  const canApproveCampaign = isAdmin && campaign?.status === "PENDING";
  const canRejectCampaign = isAdmin && campaign?.status === "PENDING";
  const canReviewExtension = isAdmin && campaign?.extensionStatus === "PENDING";
  const canDeleteCampaign = isAdmin && !campaign?.isDeleted;
  const canRestoreCampaign = isAdmin && !!campaign?.isDeleted;
  const canAdminEdit = isAdmin && !campaign?.isDeleted;
  const canAdminExtend = isAdmin && !campaign?.isDeleted;
  const canOwnerEdit = isOwner && !campaign?.isDeleted;
  const publicStatusLabel = campaign ? getPublicCampaignLabel(isExpired, goal, raised) : "Verified Campaign";
  const donationAmount =
    selectedDonationAmount === "other"
      ? parseCurrencyAmount(customDonationAmount)
      : selectedDonationAmount;
  const tipAmount =
    selectedTipAmount === "custom"
      ? parseCurrencyAmount(customTipAmount)
      : selectedTipAmount ?? 0;
  const platformFee = calculatePlatformFee(donationAmount);
  const netDonationAmount = Math.max(0, donationAmount - platformFee);
  const totalCharged = donationAmount + tipAmount;

  useEffect(() => {
    if (!campaign || !isAuthenticated) {
      setDocumentRequest(null);
      setDocumentRequests([]);
      setDocumentLinks(null);
      setExtensionAudits([]);
      return;
    }

    const loadProtectedExtras = async () => {
      try {
        const myRequest = await campaignApi.getMySupportingDocumentRequest(campaign.id);
        setDocumentRequest(myRequest);

        if (isAdmin) {
          const [requests, audits, docs] = await Promise.all([
            campaignApi.listSupportingDocumentRequests(campaign.id),
            campaignApi.listExtensionAudits(campaign.id),
            campaignApi.getSupportingDocuments(campaign.id),
          ]);
          setDocumentRequests(requests);
          setExtensionAudits(audits);
          setDocumentLinks(docs);
          return;
        }

        if (isOwner || myRequest?.status === "APPROVED") {
          const docs = await campaignApi.getSupportingDocuments(campaign.id);
          setDocumentLinks(docs);
          return;
        }

        setDocumentLinks(null);
      } catch (loadError) {
        setDocumentLinks(null);
        setDocumentRequests([]);
        setExtensionAudits([]);
        if (isAdmin) {
          notifyError(
            "Campaign fetch failed",
            loadError instanceof Error
              ? loadError.message
              : "Unable to load campaign documents and approval history."
          );
        }
      }
    };

    void loadProtectedExtras();
  }, [campaign, isAdmin, isAuthenticated, isOwner]);

  useEffect(() => {
    if (!campaignId) {
      return;
    }

    const refreshCampaign = async () => {
      try {
        const data =
          mode === "public"
            ? await campaignApi.getPublicCampaign(campaign?.publicId || campaignId)
            : await campaignApi.getCampaign(campaign?.id || campaignId);
        setCampaign(data);
      } catch {
      }
    };

    const handleDonationRefresh = () => {
      void refreshCampaign();
    };

    window.addEventListener("focus", handleDonationRefresh);
    window.addEventListener("torchlife:donation-verified", handleDonationRefresh as EventListener);

    return () => {
      window.removeEventListener("focus", handleDonationRefresh);
      window.removeEventListener("torchlife:donation-verified", handleDonationRefresh as EventListener);
    };
  }, [campaign?.id, campaign?.publicId, campaignId, mode]);

  const handleCopyLink = async () => {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    notifySuccess("Link copied", "Campaign link copied to clipboard.");
  };

  const handleDonate = async (event: FormEvent) => {
    event.preventDefault();
    if (!campaign) return;

    if (donationAmount < MIN_DONATION_AMOUNT) {
      setDonationError(`Enter a valid donation amount of at least ${formatMoney(MIN_DONATION_AMOUNT, campaign.currency)}.`);
      return;
    }

    if (netDonationAmount < 1) {
      setDonationError("Donation amount must be higher than the processing fee.");
      return;
    }

    const authenticatedEmail = user?.email?.trim() ?? "";
    const normalizedDonorEmail = (isAuthenticated ? authenticatedEmail : donorEmail).trim().toLowerCase();
    const normalizedConfirmEmail = (isAuthenticated ? authenticatedEmail : confirmDonorEmail)
      .trim()
      .toLowerCase();

    if (!isValidEmail(normalizedDonorEmail)) {
      setDonationError("Enter a valid email address.");
      return;
    }

    if (normalizedDonorEmail !== normalizedConfirmEmail) {
      setDonationError("Email confirmation does not match.");
      return;
    }

    setDonationError(null);
    setIsSubmittingDonation(true);
    try {
      const payment = await paymentApi.initializeDonation({
        campaignId: campaign.id,
        amount: donationAmount,
        donorEmail: normalizedDonorEmail,
        confirmDonorEmail: normalizedConfirmEmail,
        currency: campaign.currency === "USD" ? "USD" : "NGN",
        anonymous: anonymousDonation,
        tipAmount,
      });
      window.location.href = payment.authorizationUrl;
    } catch (submitError) {
      notifyError(
        "Payment failed",
        submitError instanceof Error ? submitError.message : "Unable to start donation right now."
      );
      setDonationError(
        submitError instanceof Error ? submitError.message : "Unable to start donation right now."
      );
      setIsSubmittingDonation(false);
    }
  };

  const handleAdminAction = async (
    action: "approve" | "reject" | "approve-extension" | "reject-extension" | "delete" | "restore"
  ) => {
    if (!campaign || !isAdmin) return;

    setAdminActionError(null);
    setAdminActionSuccess(null);
    setBusyAdminAction(action);

    try {
      if (action === "approve") {
        const updated = await campaignApi.approveCampaign(campaign.id, moderationNotes.trim() || undefined);
        setCampaign(updated);
        const successMessage = "Campaign approved successfully.";
        setAdminActionSuccess(successMessage);
        notifySuccess("Campaign approved", successMessage);
        setModerationNotes("");
        return;
      }

      if (action === "reject") {
        const updated = await campaignApi.rejectCampaign(campaign.id, moderationNotes.trim() || undefined);
        setCampaign(updated);
        const successMessage = "Campaign rejected successfully.";
        setAdminActionSuccess(successMessage);
        notifySuccess("Campaign rejected", successMessage);
        setModerationNotes("");
        return;
      }

      if (action === "approve-extension") {
        const updated = await campaignApi.reviewExtension(campaign.id, true);
        setCampaign(updated);
        const successMessage = "Extension request approved successfully.";
        setAdminActionSuccess(successMessage);
        notifySuccess("Campaign updated successfully", successMessage);
        return;
      }

      if (action === "reject-extension") {
        const updated = await campaignApi.reviewExtension(campaign.id, false);
        setCampaign(updated);
        const successMessage = "Extension request rejected successfully.";
        setAdminActionSuccess(successMessage);
        notifySuccess("Campaign extension rejected", successMessage);
        return;
      }

      if (action === "restore") {
        const updated = await campaignApi.restoreCampaign(campaign.id);
        setCampaign(updated);
        const successMessage = "Campaign restored successfully.";
        setAdminActionSuccess(successMessage);
        notifySuccess("Campaign restored", successMessage);
        return;
      }

      await campaignApi.deleteCampaign(campaign.id);
      setCampaign((previous) => (previous ? { ...previous, isDeleted: true } : previous));
      setAdminActionSuccess("Campaign soft-deleted successfully.");
      notifySuccess("Campaign removed", "Campaign soft-deleted successfully.");
      router.push("/dashboard?tab=admin-campaigns");
    } catch (actionError) {
      const message =
        actionError instanceof Error ? actionError.message : "Unable to complete admin action.";
      setAdminActionError(message);
      notifyError("Server error", message);
    } finally {
      setBusyAdminAction(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!campaign || (!canAdminEdit && !canOwnerEdit)) return;

    if (!editForm.title.trim()) {
      const message = "Campaign title is required.";
      setAdminActionError(message);
      notifyError("Validation error", message);
      return;
    }

    if (!editForm.story.trim()) {
      const message = "Campaign story is required.";
      setAdminActionError(message);
      notifyError("Validation error", message);
      return;
    }

    const parsedTargetAmount = Number(editForm.targetAmount);
    if (!Number.isFinite(parsedTargetAmount) || parsedTargetAmount < 1) {
      const message = "Target amount must be at least 1.";
      setAdminActionError(message);
      notifyError("Validation error", message);
      return;
    }

    if (isAdmin && !editForm.hospitalName.trim()) {
      const message = "Hospital name is required.";
      setAdminActionError(message);
      notifyError("Validation error", message);
      return;
    }

    if (isAdmin && !editForm.hospitalContact.trim()) {
      const message = "Hospital contact phone is required.";
      setAdminActionError(message);
      notifyError("Validation error", message);
      return;
    }

    if (editForm.type === "PROXY") {
      if (!editForm.proxyName.trim() || !editForm.proxyPhone.trim() || !editForm.proxyEmail.trim()) {
        const message = "Proxy campaigns require beneficiary name, phone, and email.";
        setAdminActionError(message);
        notifyError("Validation error", message);
        return;
      }
    }

    setAdminActionError(null);
    setAdminActionSuccess(null);
    setBusyAdminAction("save-edit");

    try {
      let nextImageUrl = editForm.imageUrl || campaign.imageUrl || campaign.image_url || null;
      let nextCertifiedPdf = editForm.certifiedPdf || campaign.certifiedPdf || null;
      let nextRecords = [...editForm.records];

      if (coverImageFile) {
        const uploaded = await campaignApi.uploadCampaignFile(campaign.id, coverImageFile);
        nextImageUrl = uploaded.url;
      }

      if (certifiedPdfFile) {
        const uploaded = await campaignApi.uploadCampaignFile(campaign.id, certifiedPdfFile);
        nextCertifiedPdf = uploaded.url;
      }

      if (supportingRecordFiles.length > 0) {
        const uploadedRecords = await Promise.all(
          supportingRecordFiles.map((file) => campaignApi.uploadCampaignFile(campaign.id, file))
        );
        nextRecords = [...nextRecords, ...uploadedRecords.map((entry) => entry.url)];
      }

      if (!nextImageUrl) {
        throw new Error("Campaign cover image is required.");
      }

      if (!nextCertifiedPdf) {
        throw new Error("Certified PDF document is required.");
      }

      const updated = await campaignApi.updateCampaignDetails(campaign.id, {
        type: editForm.type,
        title: editForm.title.trim(),
        story: editForm.story.trim(),
        deadline: isAdmin && editForm.deadline ? new Date(editForm.deadline).toISOString() : undefined,
        target_amount: Math.round(parsedTargetAmount),
        currency: editForm.currency,
        location: editForm.location.trim() || null,
        priority: editForm.priority as "LOW" | "MEDIUM" | "HIGH",
        hospital_name: editForm.hospitalName.trim() || undefined,
        hospital_contact: editForm.hospitalContact.trim() || undefined,
        hospital_contact_person_name: editForm.hospitalContactPersonName.trim() || null,
        image_url: nextImageUrl,
        certified_pdf: nextCertifiedPdf,
        records: nextRecords,
        proxyName: editForm.type === "PROXY" ? editForm.proxyName.trim() : null,
        proxyPhone: editForm.type === "PROXY" ? editForm.proxyPhone.trim() : null,
        proxyEmail: editForm.type === "PROXY" ? editForm.proxyEmail.trim() : null,
        record: null,
        status: isAdmin ? editForm.status : undefined,
        proxyNote: editForm.proxyNote.trim() || null,
        approval_notes: isAdmin ? editForm.approvalNotes.trim() || null : undefined,
      });
      setCampaign(updated);
      setEditDialogOpen(false);
      setCoverImageFile(null);
      setCertifiedPdfFile(null);
      setSupportingRecordFiles([]);
      const successMessage = isAdmin
        ? "Campaign details updated successfully."
        : "Your campaign changes were saved successfully.";
      setAdminActionSuccess(successMessage);
      notifySuccess("Campaign updated successfully", successMessage);
    } catch (actionError) {
      const message =
        actionError instanceof Error ? actionError.message : "Unable to update campaign.";
      setAdminActionError(message);
      notifyError("Validation error", message);
    } finally {
      setBusyAdminAction(null);
    }
  };

  const handleSubmitExtension = async () => {
    if (!campaign) return;
    if (!isAdmin) {
      setExtensionError("Only admins can extend campaigns.");
      return;
    }
    if (!extensionDeadline) {
      setExtensionError("Select a new deadline.");
      return;
    }

    setExtensionError(null);
    setAdminActionError(null);
    setAdminActionSuccess(null);
    setBusyAdminAction(isAdmin ? "extend" : "approve-extension");

    try {
      const isoDeadline = new Date(extensionDeadline).toISOString();
      const updated = await campaignApi.extendCampaign(campaign.id, isoDeadline);
      setCampaign(updated);
      setExtensionDialogOpen(false);
      setExtensionDeadline("");
      setAdminActionSuccess("Campaign deadline updated successfully.");
      notifySuccess("Campaign updated successfully", "Campaign deadline updated successfully.");
    } catch (actionError) {
      const message =
        actionError instanceof Error ? actionError.message : "Unable to submit extension request.";
      setExtensionError(message);
      setAdminActionError(message);
      notifyError("Server error", message);
    } finally {
      setBusyAdminAction(null);
    }
  };

  const handleRequestSupportingDocuments = async () => {
    if (!campaign) return;

    if (!isAuthenticated) {
      notifyInfo("Login required", "Please login to request campaign documents.");
      return;
    }

    try {
      const request = await campaignApi.createSupportingDocumentRequest(campaign.id);
      setDocumentRequest(request);
      notifySuccess("Document request submitted", "Admin will review your supporting-document request.");
    } catch (requestError) {
      notifyError(
        "Document request failed",
        requestError instanceof Error ? requestError.message : "Unable to request documents right now."
      );
    }
  };

  const handleReviewDocumentRequest = async (requestId: string, approve: boolean) => {
    if (!campaign) return;

    try {
      await campaignApi.reviewSupportingDocumentRequest(requestId, approve);
      const updatedRequests = await campaignApi.listSupportingDocumentRequests(campaign.id);
      setDocumentRequests(updatedRequests);
      notifySuccess(
        approve ? "Document request approved" : "Document request rejected",
        "The requester can now see the updated access state."
      );
    } catch (reviewError) {
      notifyError(
        "Review failed",
        reviewError instanceof Error ? reviewError.message : "Unable to review this request."
      );
    }
  };

  const lifecycleUpdates = [
    `Created on ${formatDate(campaign?.createdAt)}`,
    campaign?.approvedAt
      ? `Approved on ${formatDateTime(campaign.approvedAt)}`
      : campaign?.status === "PENDING"
        ? "Awaiting admin approval"
        : null,
    campaign?.approvalNotes ? `Approval notes: ${campaign.approvalNotes}` : null,
    campaign?.status === "REJECTED"
      ? `Rejected${campaign.approvalNotes ? `: ${campaign.approvalNotes}` : ""}`
      : null,
    campaign?.extensionStatus === "PENDING"
      ? `Extension requested for ${formatDate(campaign.requestedDeadline)}`
      : null,
    campaign?.extensionStatus === "APPROVED"
      ? `Extension approved. New deadline: ${formatDate(deadline)}`
      : null,
    campaign?.extensionStatus === "REJECTED"
      ? "Extension request was rejected"
      : null,
    campaign?.isDeleted ? "Campaign is soft-deleted for audit purposes" : null,
  ].filter((value): value is string => Boolean(value));

  if (isLoading) {
    return <CampaignDetailSkeleton />;
  }

  if (!campaign || error) {
    return (
      <div className="rounded-3xl border bg-card px-6 py-10 shadow-sm">
        <EmptyState
          title="Campaign unavailable"
          description={error || "The campaign you requested could not be found."}
          actionLabel={mode === "public" ? "Back to campaigns" : "Back to dashboard"}
          onAction={() => router.push(mode === "public" ? "/campaigns" : "/dashboard?tab=campaigns")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-3xl border bg-card p-4 shadow-sm sm:p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">Campaign Detail</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{campaign.title}</h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? "Moderate, edit, extend, and soft-delete this campaign from the detail page."
              : isOwner
                ? "Monitor campaign status, copy the public link, and request an extension when needed."
                : "View the full campaign story, donate, and share this campaign from its dedicated page."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {mode === "dashboard" ? (
            <Link href={backHref}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Button>
            </Link>
          ) : (
            <Link href="/campaigns">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to campaigns
              </Button>
            </Link>
          )}
          <Button variant="outline" className="gap-2" onClick={() => setShareModalOpen(true)}>
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => void handleCopyLink()}>
            <Copy className="h-4 w-4" />
            Copy link
          </Button>
          {isPublicViewer ? (
            <Button onClick={() => setDonationModalOpen(true)} className="gap-2">
              <HeartHandshake className="h-4 w-4" />
              Donate
            </Button>
          ) : null}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-8">
          <img
            src={campaign.imageUrl || campaign.image_url || "/torchlife-logo.png"}
            alt={campaign.title}
            className="h-[260px] w-full rounded-3xl object-cover sm:h-[360px] lg:h-[420px]"
          />

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className={getStatusTone(campaign.status)}>
              {isPublicViewer ? publicStatusLabel : campaign.status}
            </Badge>
            <Badge variant="outline" className="border-muted-foreground/20 bg-muted/20">
              {categoryLabel}
            </Badge>
            <Badge variant="outline" className="border-muted-foreground/20 bg-muted/20">
              <CountdownLabel deadline={deadline} expiredLabel="Expired" />
            </Badge>
            {isPublicViewer && campaign.status === "APPROVED" && !isExpired && raised < goal ? (
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Verified Campaign
              </Badge>
            ) : null}
          </div>

          {isOwner ? (
            <Alert>
              <AlertDescription>
                {campaign.status === "PENDING"
                  ? "This campaign is pending approval. Public viewers cannot see it until an admin approves it."
                  : campaign.status === "REJECTED"
                    ? `This campaign was rejected${campaign.approvalNotes ? `: ${campaign.approvalNotes}` : "."}`
                    : isExpired
                      ? "Campaign Expired."
                      : "This campaign is live and visible to public viewers."}
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-3">
            <h2 className="text-3xl font-bold md:text-4xl">{campaign.title}</h2>
            <p className="text-base leading-7 text-muted-foreground">
              {campaign.story || campaign.description || "No campaign story available yet."}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            <div className="rounded-3xl border bg-card p-6">
              <div className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Beneficiary information</h3>
              </div>
              <div className="mt-4 grid gap-3 text-sm">
                <DetailStat label="Name" value={beneficiaryName} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <h3 className="text-lg font-semibold">Hospital information</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <DetailStat label="Hospital name" value={campaign.hospitalName || "Not available"} />
              <DetailStat label="Hospital location" value={campaign.location || "Not available"} />
              <DetailStat label="Hospital contact" value={campaign.hospitalContact || "Not available"} />
              <DetailStat
                label="Hospital contact person"
                value={campaign.hospitalContactPersonName || "Not available"}
              />
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl border bg-card p-6 md:grid-cols-2 xl:grid-cols-3">
            <DetailStat label="Campaign category" value={categoryLabel} />
            <DetailStat label="Creation date" value={formatDate(campaign.createdAt)} />
            <DetailStat
              label="Verification status"
              value={isPublicViewer ? publicStatusLabel : campaign.status === "APPROVED" ? "Verified Campaign" : campaign.status}
            />
            <DetailStat label="Donation count" value={String(campaign.donorCount ?? 0)} />
            <DetailStat
              label="Countdown"
              value={isExpired ? "Expired" : `${daysRemaining} days`}
            />
            <DetailStat label="Campaign URL" value={shareLink || "Not available"} />
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Campaign updates</h3>
            </div>
            <div className="mt-4 space-y-3">
              {lifecycleUpdates.length === 0 ? (
                <p className="text-sm text-muted-foreground">No campaign updates yet.</p>
              ) : (
                lifecycleUpdates.map((item) => (
                  <div key={item} className="rounded-2xl border bg-muted/20 px-4 py-3 text-sm">
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>

          {documentLinks ? (
            <div className="rounded-3xl border bg-card p-6">
              <h3 className="text-lg font-semibold">Approved supporting documents</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {documentLinks.certifiedPdf ? (
                  <a
                    href={documentLinks.certifiedPdf}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border p-4 text-sm hover:bg-muted/40"
                  >
                    Certified document
                  </a>
                ) : null}
                {(documentLinks.records ?? []).map((record, index) => (
                  <a
                    key={`${record}-${index}`}
                    href={record}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border p-4 text-sm hover:bg-muted/40"
                  >
                    Supporting document {index + 1}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="space-y-6">
          {(adminActionError || adminActionSuccess) && isAdmin ? (
            <div className="space-y-3">
              {adminActionError ? (
                <Alert variant="destructive">
                  <AlertDescription>{adminActionError}</AlertDescription>
                </Alert>
              ) : null}
              {adminActionSuccess ? (
                <Alert>
                  <AlertDescription>{adminActionSuccess}</AlertDescription>
                </Alert>
              ) : null}
            </div>
          ) : null}

          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Amount raised</p>
              <p className="text-3xl font-bold">{formatMoney(raised, campaign.currency)}</p>
              <p className="text-sm text-muted-foreground">Goal {formatMoney(goal, campaign.currency)}</p>
              <p className="text-sm text-muted-foreground">
                Remaining {formatMoney(remainingAmount, campaign.currency)}
              </p>
            </div>

            <div className="mt-5 space-y-2">
              <Progress value={progress} />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{progress}% funded</span>
                <span>{campaign.donorCount ?? 0} donors</span>
              </div>
            </div>

            {isPublicViewer ? (
              <div className="mt-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Support this approved campaign directly from this page.
                </p>
                <Button
                  type="button"
                  className="w-full"
                  disabled={isSubmittingDonation}
                  onClick={() => setDonationModalOpen(true)}
                >
                  Donate
                </Button>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                {isOwner
                  ? "Use this detail page to monitor approval, rejection, expiry, and extension state."
                  : "Admins moderate campaigns only from this detail page."}
              </div>
            )}
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <div className="flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Share actions</h2>
            </div>
            <div className="mt-4 grid gap-2">
              <Button variant="outline" className="justify-start gap-2" onClick={() => void handleCopyLink()}>
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
              <Button variant="outline" className="justify-start gap-2" onClick={() => setShareModalOpen(true)}>
                <Share2 className="h-4 w-4" />
                Share campaign
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Supporting documents</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              {!isAuthenticated ? (
                <p>Log in to request access to supporting documents for this campaign.</p>
              ) : documentRequest ? (
                <p>Your request status: {documentRequest.status}</p>
              ) : (
                <p>Request access to supporting documents. Admin approval is required before download.</p>
              )}
              <Button variant="outline" className="w-full" onClick={() => void handleRequestSupportingDocuments()}>
                Request Supporting Documents
              </Button>
            </div>
          </div>

          {isOwner ? (
            <div className="rounded-3xl border bg-card p-6">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Owner status</h2>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <DetailStat label="Approval state" value={campaign.status} />
                <DetailStat
                  label="Rejection reason"
                  value={campaign.status === "REJECTED" ? campaign.approvalNotes || "No reason provided" : "Not rejected"}
                />
                <DetailStat label="Expiry state" value={isExpired ? "Campaign Expired" : "Active"} />
                {canOwnerEdit ? (
                  <Button variant="outline" className="w-full" onClick={() => setEditDialogOpen(true)}>
                    Edit campaign
                  </Button>
                ) : null}
                {campaign.extensionStatus === "PENDING" ? (
                  <p className="rounded-2xl border bg-muted/20 px-4 py-3">
                    Campaign extension is handled by admins only.
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {isAdmin ? (
            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Admin moderation</h2>
                <p className="text-sm text-muted-foreground">
                  Moderate this campaign only from the dedicated detail page.
                </p>
              </div>

              <div className="mt-4 space-y-3 rounded-2xl border bg-muted/30 p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Campaign status</span>
                  <span className="font-medium">{campaign.status}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Extension status</span>
                  <span className="font-medium">{campaign.extensionStatus ?? "NONE"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Approved at</span>
                  <span className="font-medium">{formatDateTime(campaign.approvedAt)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Approved by</span>
                  <span className="font-medium">{campaign.approvedById || "Not available"}</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-muted-foreground">Approval notes</span>
                  <span className="max-w-[60%] text-right font-medium">
                    {campaign.approvalNotes || "No approval notes"}
                  </span>
                </div>
              </div>

              {(canApproveCampaign || canRejectCampaign) ? (
                <div className="mt-4 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="moderationNotes">Moderation notes</Label>
                    <Textarea
                      id="moderationNotes"
                      value={moderationNotes}
                      onChange={(event) => setModerationNotes(event.target.value)}
                      placeholder="Add notes for approval or rejection."
                      disabled={!!busyAdminAction}
                    />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {canApproveCampaign ? (
                      <Button
                        onClick={() => void handleAdminAction("approve")}
                        disabled={!!busyAdminAction}
                      >
                        {busyAdminAction === "approve" ? "Approving..." : "Approve campaign"}
                      </Button>
                    ) : null}
                    {canRejectCampaign ? (
                      <Button
                        variant="destructive"
                        onClick={() => void handleAdminAction("reject")}
                        disabled={!!busyAdminAction}
                      >
                        {busyAdminAction === "reject" ? "Rejecting..." : "Reject campaign"}
                      </Button>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {canReviewExtension ? (
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border bg-background p-4 text-sm">
                    <p className="text-muted-foreground">Requested deadline</p>
                    <p className="mt-1 font-medium">
                      {campaign.requestedDeadline
                        ? formatDate(campaign.requestedDeadline)
                        : "No requested deadline"}
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button
                      onClick={() => void handleAdminAction("approve-extension")}
                      disabled={!!busyAdminAction}
                    >
                      {busyAdminAction === "approve-extension"
                        ? "Approving..."
                        : "Approve extension"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => void handleAdminAction("reject-extension")}
                      disabled={!!busyAdminAction}
                    >
                      {busyAdminAction === "reject-extension"
                        ? "Rejecting..."
                        : "Reject extension"}
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="mt-4 grid gap-2">
                {canAdminEdit ? (
                  <Button variant="outline" className="gap-2" onClick={() => setEditDialogOpen(true)}>
                    <PencilLine className="h-4 w-4" />
                    Edit campaign
                  </Button>
                ) : null}
                {canAdminExtend ? (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      setExtensionError(null);
                      setExtensionDeadline(
                        deadline ? new Date(deadline).toISOString().slice(0, 10) : ""
                      );
                      setExtensionDialogOpen(true);
                    }}
                  >
                    <CalendarDays className="h-4 w-4" />
                    Extend campaign duration
                  </Button>
                ) : null}
                {canDeleteCampaign ? (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => void handleAdminAction("delete")}
                    disabled={!!busyAdminAction}
                  >
                    <Trash2 className="h-4 w-4" />
                    {busyAdminAction === "delete" ? "Deleting..." : "Soft delete campaign"}
                  </Button>
                ) : null}
                {canRestoreCampaign ? (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => void handleAdminAction("restore")}
                    disabled={!!busyAdminAction}
                  >
                    {busyAdminAction === "restore" ? "Restoring..." : "Restore campaign"}
                  </Button>
                ) : null}
              </div>

              {!canApproveCampaign && !canRejectCampaign && !canReviewExtension && !canAdminEdit && !canRestoreCampaign ? (
                <div className="mt-4 rounded-2xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                  No admin action is pending for this campaign right now.
                </div>
              ) : null}

              <div className="mt-6 space-y-3">
                <h3 className="font-semibold">Document requests</h3>
                {documentRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No document requests yet.</p>
                ) : (
                  documentRequests.map((request) => (
                    <div key={request.id} className="rounded-2xl border bg-muted/20 p-4 text-sm">
                      <p className="font-medium">
                        {request.user?.philanthropicName || request.user?.email || "User request"}
                      </p>
                      <p className="text-muted-foreground">Status: {request.status}</p>
                      <p className="text-muted-foreground">
                        Requested: {formatDateTime(request.requestedAt)}
                      </p>
                      <p className="text-muted-foreground">
                        Reviewed: {formatDateTime(request.reviewedAt)}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void handleReviewDocumentRequest(request.id, true)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void handleReviewDocumentRequest(request.id, false)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="font-semibold">Extension audit history</h3>
                {extensionAudits.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No extension audit entries yet.</p>
                ) : (
                  extensionAudits.map((entry) => (
                    <div key={entry.id} className="rounded-2xl border bg-muted/20 p-4 text-sm">
                      <p>
                        {formatDate(entry.oldDeadline)} to {formatDate(entry.newDeadline)}
                      </p>
                      <p className="text-muted-foreground">
                        By {entry.admin?.philanthropicName || entry.admin?.email || "Admin"} on{" "}
                        {formatDateTime(entry.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </aside>
      </div>

      <ShareModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        campaignTitle={campaign.title}
        campaignLink={shareLink}
      />

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isAdmin ? "Edit campaign" : "Edit your campaign"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Campaign type</Label>
                <select
                  id="edit-type"
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={editForm.type}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      type: event.target.value as "USER" | "PROXY",
                    }))
                  }
                >
                  {campaignTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {isAdmin ? (
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Campaign status</Label>
                  <select
                    id="edit-status"
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={editForm.status}
                    onChange={(event) =>
                      setEditForm((previous) => ({
                        ...previous,
                        status: event.target.value as CampaignStatus,
                      }))
                    }
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Campaign status</Label>
                  <div className="flex h-10 items-center rounded-md border bg-muted/20 px-3 text-sm">
                    {campaign.status}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(event) => setEditForm((previous) => ({ ...previous, title: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-story">Story</Label>
              <Textarea
                id="edit-story"
                value={editForm.story}
                onChange={(event) => setEditForm((previous) => ({ ...previous, story: event.target.value }))}
                rows={6}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-target-amount">Target amount</Label>
                <Input
                  id="edit-target-amount"
                  type="number"
                  min="1"
                  value={editForm.targetAmount}
                  onChange={(event) =>
                    setEditForm((previous) => ({ ...previous, targetAmount: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-currency">Currency</Label>
                <select
                  id="edit-currency"
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={editForm.currency}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      currency: event.target.value as "NGN" | "USD",
                    }))
                  }
                >
                  {currencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {isAdmin ? (
                <div className="space-y-2">
                  <Label htmlFor="edit-deadline">Campaign expiry</Label>
                  <Input
                    id="edit-deadline"
                    type="date"
                    value={editForm.deadline}
                    onChange={(event) =>
                      setEditForm((previous) => ({ ...previous, deadline: event.target.value }))
                    }
                  />
                </div>
              ) : null}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="edit-location">Hospital location</Label>
                <Input
                  id="edit-location"
                  value={editForm.location}
                  onChange={(event) => setEditForm((previous) => ({ ...previous, location: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Category</Label>
                <select
                  id="edit-priority"
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={editForm.priority}
                  onChange={(event) => setEditForm((previous) => ({ ...previous, priority: event.target.value }))}
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {editForm.type === "PROXY" ? (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-proxy-name">Beneficiary name</Label>
                  <Input
                    id="edit-proxy-name"
                    value={editForm.proxyName}
                    onChange={(event) =>
                      setEditForm((previous) => ({ ...previous, proxyName: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-proxy-phone">Beneficiary phone</Label>
                  <Input
                    id="edit-proxy-phone"
                    value={editForm.proxyPhone}
                    onChange={(event) =>
                      setEditForm((previous) => ({ ...previous, proxyPhone: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-proxy-email">Beneficiary email</Label>
                  <Input
                    id="edit-proxy-email"
                    type="email"
                    value={editForm.proxyEmail}
                    onChange={(event) =>
                      setEditForm((previous) => ({ ...previous, proxyEmail: event.target.value }))
                    }
                  />
                </div>
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-hospital-name">Hospital name</Label>
                <Input
                  id="edit-hospital-name"
                  value={editForm.hospitalName}
                  onChange={(event) =>
                    setEditForm((previous) => ({ ...previous, hospitalName: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-hospital-contact">Hospital contact phone</Label>
                <Input
                  id="edit-hospital-contact"
                  value={editForm.hospitalContact}
                  onChange={(event) =>
                    setEditForm((previous) => ({ ...previous, hospitalContact: event.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-hospital-contact-person">Hospital contact person</Label>
                <Input
                  id="edit-hospital-contact-person"
                  value={editForm.hospitalContactPersonName}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      hospitalContactPersonName: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-proxy-note">Campaign note</Label>
                <Input
                  id="edit-proxy-note"
                  value={editForm.proxyNote}
                  onChange={(event) =>
                    setEditForm((previous) => ({ ...previous, proxyNote: event.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-cover-image">Cover image</Label>
                <Input
                  id="edit-cover-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => setCoverImageFile(event.target.files?.[0] ?? null)}
                />
                {editForm.imageUrl ? (
                  <p className="text-xs text-muted-foreground">
                    Current image: <a className="underline" href={editForm.imageUrl} target="_blank" rel="noreferrer">Open current cover image</a>
                  </p>
                ) : null}
                {coverImageFile ? (
                  <p className="text-xs text-muted-foreground">Selected: {coverImageFile.name}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-certified-pdf">Certified PDF</Label>
                <Input
                  id="edit-certified-pdf"
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => setCertifiedPdfFile(event.target.files?.[0] ?? null)}
                />
                {editForm.certifiedPdf ? (
                  <p className="text-xs text-muted-foreground">
                    Current PDF: <a className="underline" href={editForm.certifiedPdf} target="_blank" rel="noreferrer">Open certified document</a>
                  </p>
                ) : null}
                {certifiedPdfFile ? (
                  <p className="text-xs text-muted-foreground">Selected: {certifiedPdfFile.name}</p>
                ) : null}
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="edit-supporting-records">Supporting records</Label>
              {editForm.records.length > 0 ? (
                <div className="space-y-2">
                  {editForm.records.map((record, index) => (
                    <div key={`${record}-${index}`} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
                      <a href={record} target="_blank" rel="noreferrer" className="truncate underline">
                        Supporting document {index + 1}
                      </a>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEditForm((previous) => ({
                            ...previous,
                            records: previous.records.filter((_, entryIndex) => entryIndex !== index),
                          }))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No supporting records attached yet.</p>
              )}
              <Input
                id="edit-supporting-records"
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,application/pdf"
                onChange={(event) => setSupportingRecordFiles(Array.from(event.target.files ?? []))}
              />
              {supportingRecordFiles.length > 0 ? (
                <p className="text-xs text-muted-foreground">
                  New uploads: {supportingRecordFiles.map((file) => file.name).join(", ")}
                </p>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {isAdmin ? (
                <div className="space-y-2">
                  <Label htmlFor="edit-approval-notes">Approval notes</Label>
                  <Textarea
                    id="edit-approval-notes"
                    value={editForm.approvalNotes}
                    onChange={(event) =>
                      setEditForm((previous) => ({ ...previous, approvalNotes: event.target.value }))
                    }
                    rows={3}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleSaveEdit()} disabled={busyAdminAction === "save-edit"}>
              {busyAdminAction === "save-edit" ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={extensionDialogOpen} onOpenChange={setExtensionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Extend campaign duration</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="extension-deadline">New deadline</Label>
            <div className="grid grid-cols-2 gap-2">
              {[3, 7, 14].map((days) => (
                <Button
                  key={days}
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const baseDate = deadline ? new Date(deadline) : new Date();
                    baseDate.setDate(baseDate.getDate() + days);
                    setExtensionDeadline(baseDate.toISOString().slice(0, 10));
                  }}
                >
                  +{days} days
                </Button>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setExtensionDeadline("")}
              >
                Custom Date
              </Button>
            </div>
            <Input
              id="extension-deadline"
              type="date"
              value={extensionDeadline}
              onChange={(event) => setExtensionDeadline(event.target.value)}
            />
            {extensionError ? (
              <Alert variant="destructive">
                <AlertDescription>{extensionError}</AlertDescription>
              </Alert>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExtensionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => void handleSubmitExtension()}
              disabled={busyAdminAction === "extend"}
            >
              {busyAdminAction === "extend" ? "Updating..." : "Update deadline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={donationModalOpen} onOpenChange={setDonationModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Donate to this campaign</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleDonate} className="space-y-6">
            <div className="space-y-3">
              <Label>Choose donation amount</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {DONATION_PRESETS.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant={selectedDonationAmount === amount ? "default" : "outline"}
                    onClick={() => {
                      setDonationError(null);
                      setSelectedDonationAmount(amount);
                      setCustomDonationAmount("");
                    }}
                    disabled={isSubmittingDonation}
                  >
                    {formatMoney(amount, campaign.currency)}
                  </Button>
                ))}
                <Button
                  type="button"
                  variant={selectedDonationAmount === "other" ? "default" : "outline"}
                  onClick={() => {
                    setDonationError(null);
                    setSelectedDonationAmount("other");
                  }}
                  disabled={isSubmittingDonation}
                >
                  Other
                </Button>
              </div>
              {selectedDonationAmount === "other" ? (
                <div className="space-y-2">
                  <Label htmlFor="donationAmount">Custom amount</Label>
                  <Input
                    id="donationAmount"
                    type="number"
                    min={String(MIN_DONATION_AMOUNT)}
                    step="100"
                    value={customDonationAmount}
                    onChange={(event) => setCustomDonationAmount(event.target.value)}
                    disabled={isSubmittingDonation}
                  />
                </div>
              ) : null}
            </div>

            {!isAuthenticated ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="donorEmail">Your email</Label>
                  <Input
                    id="donorEmail"
                    type="email"
                    autoComplete="email"
                    value={donorEmail}
                    onChange={(event) => setDonorEmail(event.target.value)}
                    placeholder="you@example.com"
                    disabled={isSubmittingDonation}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmDonorEmail">Confirm email</Label>
                  <Input
                    id="confirmDonorEmail"
                    type="email"
                    autoComplete="email"
                    value={confirmDonorEmail}
                    onChange={(event) => setConfirmDonorEmail(event.target.value)}
                    placeholder="you@example.com"
                    disabled={isSubmittingDonation}
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                Donation receipt and payment verification will use <span className="font-medium text-foreground">{user?.email}</span>.
              </div>
            )}

            <div className="rounded-2xl border bg-muted/20 p-5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Donation amount</span>
                <span className="font-medium">{formatMoney(donationAmount, campaign.currency)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Processing / platform support fee deducted</span>
                <span className="font-medium">{formatMoney(platformFee, campaign.currency)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Campaign receives</span>
                <span className="font-medium">{formatMoney(netDonationAmount, campaign.currency)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Optional tip</span>
                <span className="font-medium">{formatMoney(tipAmount, campaign.currency)}</span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 border-t pt-4">
                <span className="font-medium">Total charged</span>
                <span className="text-lg font-semibold">{formatMoney(totalCharged, campaign.currency)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Support TorchLife</Label>
                <p className="text-sm text-muted-foreground">
                  Optional tip. Select an amount or tap the active option again to remove it.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {TIP_PRESETS.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant={selectedTipAmount === amount ? "default" : "outline"}
                    onClick={() => {
                      setSelectedTipAmount((previous) => (previous === amount ? null : amount));
                      setCustomTipAmount("");
                    }}
                    disabled={isSubmittingDonation}
                  >
                    {formatMoney(amount, campaign.currency)}
                  </Button>
                ))}
                <Button
                  type="button"
                  variant={selectedTipAmount === "custom" ? "default" : "outline"}
                  onClick={() => {
                    setSelectedTipAmount((previous) => (previous === "custom" ? null : "custom"));
                    setCustomTipAmount("");
                  }}
                  disabled={isSubmittingDonation}
                >
                  Custom
                </Button>
              </div>
              {selectedTipAmount === "custom" ? (
                <div className="space-y-2">
                  <Label htmlFor="customTipAmount">Custom tip</Label>
                  <Input
                    id="customTipAmount"
                    type="number"
                    min="0"
                    step="100"
                    value={customTipAmount}
                    onChange={(event) => setCustomTipAmount(event.target.value)}
                    disabled={isSubmittingDonation}
                  />
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between rounded-2xl border p-4">
              <div className="space-y-1">
                <Label htmlFor="anonymousDonation">Anonymous donation</Label>
                <p className="text-xs text-muted-foreground">
                  Hide your email from campaign-facing donation records.
                </p>
              </div>
              <Switch
                id="anonymousDonation"
                checked={anonymousDonation}
                onCheckedChange={setAnonymousDonation}
                disabled={isSubmittingDonation}
              />
            </div>
            <div className="rounded-2xl border bg-primary/5 p-4 text-sm text-muted-foreground">
              You are not just supporting one person. Your contribution helps TorchLife continue
              supporting more vulnerable pregnant women facing emergencies.
            </div>
            {donationError ? (
              <Alert variant="destructive">
                <AlertDescription>{donationError}</AlertDescription>
              </Alert>
            ) : null}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDonationModalOpen(false)}
                disabled={isSubmittingDonation}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingDonation}>
                {isSubmittingDonation ? "Redirecting to Paystack..." : "Continue to Paystack"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
