import { ArrowUpDown, CircleAlert, Loader2 } from "lucide-react";

import type {
  DonationRow,
  SortKey,
} from "@/src/components/dashboard/donations/types";
import { formatAmount } from "@/src/components/dashboard/donations/utils";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { PaymentStatus } from "@/src/types";

type DonationsTableProps = {
  isLoading: boolean;
  error: string | null;
  rows: DonationRow[];
  currentPage: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
  onSortChange: (key: SortKey) => void;
  onRetry: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

function statusBadgeVariant(status: PaymentStatus) {
  if (status === PaymentStatus.COMPLETED) return "default";
  if (status === PaymentStatus.PENDING) return "secondary";
  if (status === PaymentStatus.REFUNDED) return "outline";
  return "destructive";
}

export default function DonationsTable({
  isLoading,
  error,
  rows,
  currentPage,
  pageSize,
  totalRows,
  totalPages,
  onSortChange,
  onRetry,
  onPreviousPage,
  onNextPage,
}: DonationsTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card">
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading donation history...
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
          <CircleAlert className="size-5 text-destructive" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button type="button" variant="outline" onClick={onRetry}>
            Retry
          </Button>
        </div>
      ) : totalRows === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          No donations found for the current filters.
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1"
                    onClick={() => onSortChange("date")}
                  >
                    Date
                    <ArrowUpDown className="size-3.5" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1"
                    onClick={() => onSortChange("amount")}
                  >
                    Amount
                    <ArrowUpDown className="size-3.5" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1"
                    onClick={() => onSortChange("campaignName")}
                  >
                    Campaign
                    <ArrowUpDown className="size-3.5" />
                  </button>
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.date.toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{formatAmount(row.amount)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{row.campaignName}</span>
                      {row.anonymous ? (
                        <span className="text-xs text-muted-foreground">Anonymous donation</span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(row.status)}>
                      {row.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalRows)} of{" "}
              {totalRows}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={onPreviousPage}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={onNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
