import type { ReactNode } from "react";

type GetInvolvedPageShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
};

/**
 * Shared layout for the "Get Involved" pages so each route only owns its copy.
 */
export function GetInvolvedPageShell({
  eyebrow,
  title,
  intro,
  children,
}: GetInvolvedPageShellProps) {
  return (
    <div className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0f766e]">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-[#132726] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 text-base leading-7 text-[#556a66] sm:text-lg">{intro}</p>
      </div>

      {children ? <div className="mx-auto mt-12 max-w-7xl">{children}</div> : null}
    </div>
  );
}
