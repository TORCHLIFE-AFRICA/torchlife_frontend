import { SITE_PHOTOS } from "../site-photos";

export type HowItWorksStage = {
  id: string;
  step: string;
  title: string;
  /** Who acts at this point in the flow. */
  party: string;
  description: string;
  photo: string;
  /** Focal point for the 4:3 crop. */
  photoPosition: string;
};

export const HOW_IT_WORKS_STAGES: readonly HowItWorksStage[] = [
  {
    id: "need",
    step: "01",
    title: "The Need",
    party: "Mother, family or authorized person",
    description:
      "A mother, family member or authorized person starts a campaign for a pregnancy healthcare need.",
    photo: SITE_PHOTOS.motherExpecting,
    photoPosition: "center 35%",
  },
  {
    id: "verify",
    step: "02",
    title: "Verify Case",
    party: "Reviewed at source",
    description:
      "The relevant information and supporting documents are reviewed from the source before the campaign is presented for support.",
    photo: SITE_PHOTOS.doctorConsultation,
    photoPosition: "center 30%",
  },
  {
    id: "supporters",
    step: "03",
    title: "Supporters",
    party: "Individuals, families, organizations and communities",
    description:
      "Individuals, families, organizations and communities can discover verified cases and provide financial support.",
    photo: SITE_PHOTOS.supportersGroup,
    photoPosition: "center 40%",
  },
  {
    id: "track",
    step: "04",
    title: "Track the outcome",
    party: "Followed throughout the process",
    description:
      "Support and campaign activity can be followed throughout the process.",
    photo: SITE_PHOTOS.motherAndBaby,
    photoPosition: "center 30%",
  },
] as const;
