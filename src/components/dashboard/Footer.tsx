import type { FooterGroup } from "@/src/components/dashboard/types";

type FooterProps = {
  groups: FooterGroup[];
};

export default function Footer({ groups }: FooterProps) {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <div key={group.id} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2010-2026 GoFundMe</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#" className="transition-colors hover:text-foreground">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy Notice
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Accessibility Statement
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
