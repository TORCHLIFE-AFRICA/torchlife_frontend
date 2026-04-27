import { Button } from "@/src/components/ui/button";

type FundraiserWelcomeBarProps = {
  userName: string;
};

export default function FundraiserWelcomeBar({ userName }: FundraiserWelcomeBarProps) {
  return (
    <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold">Hi, {userName}</span>
        <span className="text-muted-foreground">• We&apos;re in this together</span>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline">
          View
        </Button>
        <Button type="button" className="bg-emerald-600 text-white hover:bg-emerald-700">
          Share fundraiser
        </Button>
      </div>
    </section>
  );
}
