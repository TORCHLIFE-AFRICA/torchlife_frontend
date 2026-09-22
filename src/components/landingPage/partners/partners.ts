export type Partner = {
  name: string;
  /** Set once a partner profile page exists, which turns the card into a link. */
  href?: string;
  /** Set once artwork arrives, which replaces the wordmark with the logo. */
  logoSrc?: string;
};

/**
 * Confirmed TorchLife partners.
 *
 * Logo artwork is not ready, so these render as wordmarks in one consistent
 * style rather than as empty logo boxes: the strip shows real relationships
 * without pretending to assets that do not exist. Adding `logoSrc` to an entry
 * swaps that card to the logo, and `href` links it through — neither needs a
 * change to the section itself.
 */
export const PARTNERS: readonly Partner[] = [
  { name: "Unique Care Hospital" },
  { name: "Love and Care Clinic" },
  { name: "Royal Crest Hospital" },
  { name: "Isuti Medical Care" },
  { name: "Cortny" },
] as const;
