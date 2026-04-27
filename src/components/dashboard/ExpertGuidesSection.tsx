import Image from "next/image";

import type { ExpertResource } from "@/src/components/dashboard/types";

type ExpertGuidesSectionProps = {
  resources: ExpertResource[];
};

export default function ExpertGuidesSection({ resources }: ExpertGuidesSectionProps) {
  const featured = resources.find((resource) => resource.featured);
  const standardResources = resources.filter((resource) => !resource.featured);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Our experts are here for you</h2>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        {featured ? (
          <article className="overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-sm">
            <Image
              src={featured.image}
              alt={featured.title}
              width={720}
              height={360}
              className="h-56 w-full object-cover"
            />
            <div className="space-y-1 p-4">
              <h3 className="font-semibold">{featured.title}</h3>
              <p className="text-sm text-muted-foreground">{featured.readTime}</p>
            </div>
          </article>
        ) : null}

        <div className="space-y-3">
          {standardResources.map((resource) => (
            <article
              key={resource.id}
              className="flex gap-3 overflow-hidden rounded-2xl border bg-card p-3 transition-shadow hover:shadow-sm"
            >
              <Image
                src={resource.image}
                alt={resource.title}
                width={136}
                height={84}
                className="h-20 w-28 rounded-lg object-cover"
              />
              <div className="space-y-1">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{resource.title}</h3>
                <p className="text-xs text-muted-foreground">{resource.readTime}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
