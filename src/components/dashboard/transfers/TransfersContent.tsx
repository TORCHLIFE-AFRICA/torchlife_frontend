"use client";

import { useEffect, useMemo, useState } from "react";

import { walletApi } from "@/src/lib/api/wallet";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Spinner } from "@/src/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";

const isTransferServiceAvailable =
  process.env.NEXT_PUBLIC_WALLET_TRANSFERS_ENABLED === "true";

const formatMoney = (value: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const parseAmount = (value: string) => {
  const normalized = value.replace(/,/g, "").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

export default function TransfersContent() {
  const [balance, setBalance] = useState<number | null>(null);
  const [currency, setCurrency] = useState("NGN");
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const [amount, setAmount] = useState("0");
  const [transferError, setTransferError] = useState<string | null>(null);

  const loadBalance = async () => {
    setIsBalanceLoading(true);
    setBalanceError(null);
    try {
      const data = await walletApi.getBalance();
      setBalance(typeof data.balance === "number" ? data.balance : 0);
      setCurrency(data.currency || "NGN");
    } catch (error) {
      setBalanceError(error instanceof Error ? error.message : "Unable to load wallet balance.");
    } finally {
      setIsBalanceLoading(false);
    }
  };

  useEffect(() => {
    loadBalance();
  }, []);

  const amountNumber = useMemo(() => parseAmount(amount), [amount]);
  const remainingBalance = useMemo(() => {
    if (balance === null || !Number.isFinite(amountNumber)) return null;
    return balance - amountNumber;
  }, [amountNumber, balance]);

  const amountValidationError = useMemo(() => {
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      return "Enter a valid amount.";
    }

    if (balance !== null && amountNumber > balance) {
      return `Insufficient balance. Available: ${formatMoney(balance, currency)}.`;
    }

    return null;
  }, [amountNumber, balance, currency]);

  const onProceed = () => {
    setTransferError(null);
    if (!isTransferServiceAvailable) {
      setTransferError(
        "Wallet transfers are not available yet. You can view your balance here while the service is being prepared."
      );
      return;
    }
    if (isBalanceLoading) {
      setTransferError("Wallet balance is still loading. Please wait.");
      return;
    }
    if (balanceError) {
      setTransferError("Wallet balance could not be loaded. Please retry.");
      return;
    }
    if (amountValidationError) {
      setTransferError(amountValidationError);
      return;
    }
    setTransferError("Transfer flow is not yet wired to the backend transfer endpoint.");
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Transfers</h1>
        <p className="text-sm text-muted-foreground">
          View wallet balance and get ready for transfers. Transfers above your available
          balance are blocked when the service is enabled.
        </p>
      </header>

      {!isTransferServiceAvailable ? (
        <Alert>
          <AlertTitle>Service Not Yet Available</AlertTitle>
          <AlertDescription>
            Wallet transfers are still being prepared. Users can view this area, but sending
            funds is currently disabled.
          </AlertDescription>
        </Alert>
      ) : null}

      <section className="rounded-2xl border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">Available balance</div>
          {isBalanceLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="size-4" />
              <span>Loading…</span>
            </div>
          ) : balanceError ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadBalance}
              disabled={!isTransferServiceAvailable}
            >
              Retry balance
            </Button>
          ) : (
            <div className="text-sm font-semibold">{formatMoney(balance ?? 0, currency)}</div>
          )}
        </div>

        {balanceError ? (
          <Alert variant={isTransferServiceAvailable ? "destructive" : "default"}>
            <AlertTitle>
              {isTransferServiceAvailable ? "Unable to load balance" : "Balance Preview Unavailable"}
            </AlertTitle>
            <AlertDescription>
              {isTransferServiceAvailable
                ? balanceError
                : "Wallet data is not ready yet in this staging flow. Transfer actions remain disabled."}
            </AlertDescription>
          </Alert>
        ) : null}
      </section>

      <section className="rounded-2xl border bg-card p-4 space-y-4">
        <h2 className="text-base font-semibold">Transfer details</h2>

        <div className="space-y-2">
          <Label>Amount</Label>
          <Input
            inputMode="decimal"
            value={amount}
            disabled={!isTransferServiceAvailable}
            onChange={(e) => {
              setAmount(e.target.value);
              setTransferError(null);
            }}
          />
          {balance !== null && Number.isFinite(amountNumber) ? (
            <div className="text-xs text-muted-foreground">
              Remaining: {formatMoney(Math.max(0, remainingBalance ?? 0), currency)}
            </div>
          ) : null}
        </div>

        {transferError ? (
          <Alert variant="destructive">
            <AlertTitle>Transfer blocked</AlertTitle>
            <AlertDescription>{transferError}</AlertDescription>
          </Alert>
        ) : null}

        {amountValidationError && !transferError ? (
          <Alert variant="destructive">
            <AlertTitle>Invalid amount</AlertTitle>
            <AlertDescription>{amountValidationError}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={onProceed}
            disabled={isBalanceLoading || !isTransferServiceAvailable}
          >
            {isTransferServiceAvailable ? "Continue" : "Transfers Coming Soon"}
          </Button>
        </div>
      </section>
    </section>
  );
}
