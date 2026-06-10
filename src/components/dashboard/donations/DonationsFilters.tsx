import { PaymentStatus } from "@/src/types";

type DonationsFiltersProps = {
  organizationFilter: string;
  statusFilter: "all" | PaymentStatus;
  onOrganizationFilterChange: (value: string) => void;
  onStatusFilterChange: (value: "all" | PaymentStatus) => void;
};

export default function DonationsFilters({
  organizationFilter,
  statusFilter,
  onOrganizationFilterChange,
  onStatusFilterChange,
}: DonationsFiltersProps) {
  return (
    <section className="rounded-2xl border bg-card p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Organization</span>
          <input
            type="text"
            value={organizationFilter}
            onChange={(event) => onOrganizationFilterChange(event.target.value)}
            placeholder="Search organization"
            className="h-9 rounded-md border bg-background px-3 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Status</span>
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as "all" | PaymentStatus)
            }
            className="h-9 rounded-md border bg-background px-3 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All statuses</option>
            <option value={PaymentStatus.COMPLETED}>Completed</option>
            <option value={PaymentStatus.PENDING}>Pending</option>
            <option value={PaymentStatus.FAILED}>Failed</option>
            <option value={PaymentStatus.REFUNDED}>Refunded</option>
            <option value={PaymentStatus.CANCELLED}>Cancelled</option>
          </select>
        </label>
      </div>
    </section>
  );
}
