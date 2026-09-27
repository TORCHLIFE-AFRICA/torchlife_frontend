import Image from "next/image";

import { cn } from "@/src/lib/utils";
import { RevealOnScroll } from "../../landingPage/RevealOnScroll";
import { TEAM_GROUPS, TEAM_LEAD, type TeamMember } from "../about-assets";
import { SECTION_CLASS, SectionHeading } from "../primitives";

const LINE_COLOR = "bg-[#d8cfbe]";

/** First and last initial, e.g. "Edidiong Beatrix Mfonokon" becomes "EM". */
function initialsOf(name: string) {
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? words[words.length - 1][0] : "";

  return `${first}${last}`.toUpperCase();
}

/**
 * A portrait when the person has supplied one, otherwise their initials.
 * A monogram reads as a deliberate placeholder; a stock face beside a real
 * name would read as that person.
 */
function Portrait({ member, isLead = false }: { member: TeamMember; isLead?: boolean }) {
  const size = isLead ? "size-16 text-lg sm:size-20 sm:text-xl" : "size-12 text-sm";

  if (member.photo) {
    return (
      <div className={cn("relative shrink-0 overflow-hidden rounded-full ring-1 ring-black/5", size)}>
        <Image
          src={member.photo.src}
          alt={member.photo.alt ?? `${member.name}, ${member.role}`}
          fill
          sizes={isLead ? "80px" : "48px"}
          className="object-cover"
          style={{ objectPosition: member.photo.position }}
        />
      </div>
    );
  }

  return (
    // Decorative: the name sits next to it, so a screen reader gains nothing here.
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-[#0f766e]/10 font-semibold tracking-wide text-[#0f4d46] ring-1 ring-black/5",
        size,
      )}
    >
      {initialsOf(member.name)}
    </span>
  );
}

function MemberRow({ member }: { member: TeamMember }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-[#f7f2ea] px-3 py-2.5">
      <Portrait member={member} />
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-snug text-[#132726]">{member.name}</p>
        <p className="mt-0.5 text-xs leading-5 text-[#6c7f7b]">{member.role}</p>
      </div>
    </li>
  );
}

/**
 * The team as a structure rather than a flat grid: the CEO at the head, then
 * the functional areas branching from them. The branch lines are drawn only on
 * wide screens; below that the same hierarchy reads as stacked groups, which
 * is clearer on a phone than a scaled-down chart.
 */
export function TeamSection() {
  return (
    <section id="team" aria-labelledby="team-title" className={SECTION_CLASS}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="team-title"
          eyebrow="The people behind TorchLife"
          title="Built by people who care about the problem"
        >
          <p>
            TorchLife is being built by people across technology, healthcare, research,
            design, marketing, operations, partnerships, and community.
          </p>
        </SectionHeading>

        <div className="mt-12 sm:mt-14">
          <RevealOnScroll>
            <div className="mx-auto flex max-w-sm items-center gap-4 rounded-[1.5rem] bg-white p-5 shadow-[0_26px_70px_-50px_rgba(8,28,25,0.6)] ring-1 ring-black/5">
              <Portrait member={TEAM_LEAD} isLead />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0f766e]">
                  Leadership
                </p>
                <p className="mt-1.5 text-lg font-semibold leading-snug tracking-tight text-[#132726]">
                  {TEAM_LEAD.name}
                </p>
                <p className="mt-0.5 text-sm text-[#6c7f7b]">{TEAM_LEAD.role}</p>
              </div>
            </div>
          </RevealOnScroll>

          {/* Stem down from leadership, then the branch across the groups. */}
          <span aria-hidden="true" className={cn("mx-auto block h-8 w-px", LINE_COLOR)} />
          <div aria-hidden="true" className="hidden h-10 grid-cols-3 gap-5 lg:grid">
            {TEAM_GROUPS.map((group, index) => (
              <div key={group.id} className="relative">
                <span
                  className={cn(
                    "absolute top-0 h-px",
                    LINE_COLOR,
                    // Negative insets bridge the grid gap, so the branch is unbroken.
                    index === 0 && "-right-5 left-1/2",
                    index === 1 && "-left-5 -right-5",
                    index === 2 && "-left-5 right-1/2",
                  )}
                />
                <span
                  className={cn("absolute left-1/2 top-0 h-full w-px -translate-x-1/2", LINE_COLOR)}
                />
              </div>
            ))}
          </div>

          <ul className="grid gap-5 lg:grid-cols-3">
            {TEAM_GROUPS.map((group, index) => (
              <li key={group.id}>
                <RevealOnScroll delay={index * 0.06} className="h-full">
                  <div className="h-full rounded-[1.5rem] bg-white p-5 ring-1 ring-black/5 sm:p-6">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f766e]">
                      {group.label}
                    </h3>
                    <ul className="mt-5 space-y-3">
                      {group.members.map((member) => (
                        <MemberRow key={member.name} member={member} />
                      ))}
                    </ul>
                  </div>
                </RevealOnScroll>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
