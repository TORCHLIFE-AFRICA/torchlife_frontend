/**
 * Real TorchLife imagery and people for the About page.
 *
 * Both slots are empty on purpose. Nothing here may be filled with stock
 * photography, a generated image, or an invented person: the hero is meant to
 * show the actual team, and every team entry must be a real person with a role
 * and contribution they have confirmed. While a slot is empty the page simply
 * leaves that visual out, so an unfinished slot never ships a stand-in.
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
  /** One line on what this person contributes to TorchLife. */
  contribution: string;
  photo: AboutPhoto;
};

/** Real TorchLife team photograph for the hero. */
export const ABOUT_HERO_PHOTO: AboutPhoto | null = {
  src: "/assets/team.jpg",
  alt: "Five members of the TorchLife team standing together in TorchLife T-shirts.",
  // The photo is 4:3 and the hero frame is wider, so the crop is anchored
  // near the top: a centred crop would cut through everyone's heads.
  position: "50% 18%",
};

/** The people building TorchLife, in the order they should appear. */
export const TEAM_MEMBERS: readonly TeamMember[] = [];
