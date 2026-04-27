import ExpertGuidesSection from "@/src/components/dashboard/ExpertGuidesSection";
import FundraiserHeader from "@/src/components/dashboard/FundraiserHeader";
import FundraiserWelcomeBar from "@/src/components/dashboard/FundraiserWelcomeBar";
import ImpactAreasSection from "@/src/components/dashboard/ImpactAreasSection";
import QuickTipBanner from "@/src/components/dashboard/QuickTipBanner";
import type { ExpertResource, FundraiserAction, ImpactArea } from "@/src/components/dashboard/types";

type MainContentProps = {
  userName: string;
  fundraiserTitle: string;
  goalAmount: string;
  actions: FundraiserAction[];
  impactAreas: ImpactArea[];
  resources: ExpertResource[];
  searchQuery: string;
};

export default function MainContent({
  userName,
  fundraiserTitle,
  goalAmount,
  actions,
  impactAreas,
  resources,
  searchQuery,
}: MainContentProps) {
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const isSearching = normalizedSearch.length > 0;
  const matchesSearch = (value: string) =>
    value.toLowerCase().includes(normalizedSearch);

  const filteredActions = isSearching
    ? actions.filter((action) => matchesSearch(action.label))
    : actions;
  const filteredImpactAreas = isSearching
    ? impactAreas.filter(
        (area) =>
          matchesSearch(area.title) || matchesSearch(area.progressLabel)
      )
    : impactAreas;
  const filteredResources = isSearching
    ? resources.filter(
        (resource) =>
          matchesSearch(resource.title) || matchesSearch(resource.readTime)
      )
    : resources;

  const showHeader =
    !isSearching ||
    matchesSearch(fundraiserTitle) ||
    matchesSearch(goalAmount) ||
    filteredActions.length > 0;
  const showQuickTip =
    !isSearching ||
    matchesSearch(
      "Having donations will encourage others to donate. Share your fundraiser with close contacts who can give first."
    );
  const showImpactAreas = filteredImpactAreas.length > 0;
  const showExpertGuides = filteredResources.length > 0;
  const hasResults =
    showHeader ||
    showQuickTip ||
    showImpactAreas ||
    showExpertGuides;

  return (
    <main className="space-y-8">
      <FundraiserWelcomeBar userName={userName} />
      {showHeader ? (
        <FundraiserHeader
          fundraiserTitle={fundraiserTitle}
          goalAmount={goalAmount}
          actions={filteredActions}
        />
      ) : null}
      {showQuickTip ? (
        <QuickTipBanner message="Having donations will encourage others to donate. Share your fundraiser with close contacts who can give first." />
      ) : null}
      {showImpactAreas ? (
        <ImpactAreasSection areas={filteredImpactAreas} />
      ) : null}
      {showExpertGuides ? (
        <ExpertGuidesSection resources={filteredResources} />
      ) : null}
      {!hasResults ? (
        <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
          No dashboard content matches your search.
        </p>
      ) : null}
    </main>
  );
}
