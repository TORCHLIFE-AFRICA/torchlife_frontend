/**
 * Real TorchLife imagery and people for the About page.
 *
 * Nothing here may be stock photography, a generated image, or an invented
 * person: every entry is someone who works on TorchLife, with the role they
 * confirmed. Nobody carries a job description they did not give us.
 */

export type AboutPhoto = {
  /** A path under /public, e.g. "/photos/team/torchlife-team.jpg". */
  src: string;
  /** Describes who is pictured and what they are doing. */
  alt: string;
  /**
   * CSS object-position for when a frame crops the photo, e.g. "50% 20%" to
   * keep faces in view. Defaults to centred.
   */
  position?: string;
};

export type TeamMember = {
  name: string;
  role: string;
  /**
   * The person's own portrait. Until one exists the card shows their initials,
   * so no stand-in face is ever presented as a member of the team. To swap one
   * in, drop the file under /public and add `photo: { src: "/..." }` here —
   * `alt` defaults to the person's name and role, and nothing else changes.
   */
  photo?: { src: string; alt?: string; position?: string };
};

export type TeamGroup = {
  id: string;
  /** The functional area, as the team describes it. */
  label: string;
  members: readonly TeamMember[];
};

/** Real TorchLife team photograph for the hero. */
export const ABOUT_HERO_PHOTO: AboutPhoto | null = {
  src: "/assets/team.jpg",
  alt: "Five members of the TorchLife team standing together in TorchLife T-shirts.",
  // The photo is 4:3 and the hero frame is wider, so the crop is anchored
  // near the top: a centred crop would cut through everyone's heads.
  position: "50% 18%",
};

/** Head of the organisation, shown above the functional groups. */
export const TEAM_LEAD: TeamMember = {
  name: "Agboola Boluwatife",
  role: "CEO",
};

/** The functional areas under leadership, in the order they should appear. */
export const TEAM_GROUPS: readonly TeamGroup[] = [
  {
    id: "technology",
    label: "Technology",
    members: [
      { name: "Samuel O. Daniel", role: "Software Engineer (Frontend)" },
      { name: "Bankole Azeez Babatunde", role: "Software Engineer (Backend)" },
      { name: "Abolarin John", role: "Tech Assistant" },
    ],
  },
  {
    id: "research",
    label: "Research",
    members: [
      { name: "Bamidele Oluwabusola", role: "Researcher" },
      { name: "Edidiong Beatrix Mfonokon", role: "Research Assistant" },
    ],
  },
  {
    id: "brand-growth",
    label: "Brand & Growth",
    members: [
      { name: "Temitope Adeniyi", role: "Brand Strategist" },
      { name: "Aishat Aderounmu", role: "Brand Strategist" },
      { name: "Peter Idowu", role: "Growth Strategist" },
    ],
  },
];
