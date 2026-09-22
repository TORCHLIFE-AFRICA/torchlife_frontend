/**
 * Real photography for the public marketing sections, licensed under the
 * Unsplash License. Credits: public/photos/CREDITS.md.
 *
 * Free stock carries no model release, so any photo placed beside a name, a
 * medical condition, or an amount must not show an identifiable face. Those
 * are the hands, belly, and newborn shots below; portraits are only ever
 * captioned by role ("Mothers", "Supporters"), never as a specific patient.
 */
export const SITE_PHOTOS = {
  // Non-identifiable: safe beside case details.
  pregnancyHands: "/photos/pregnancy-hands.jpg",
  clinicianDevice: "/photos/clinician-device.jpg",
  newbornGrip: "/photos/newborn-grip.jpg",
  caseCaesarean: "/photos/case-caesarean.jpg",
  casePreEclampsia: "/photos/case-pre-eclampsia.jpg",
  caseNeonatal: "/photos/case-neonatal.jpg",

  // Identifiable: role-captioned only.
  supportersPhone: "/photos/supporters-phone.jpg",
  supportersGroup: "/photos/supporters-group.jpg",
  csrLead: "/photos/csr-lead-desk.jpg",
  organizationPortrait: "/photos/organization-portrait.jpg",
  doctorConsultation: "/photos/doctor-consultation.jpg",
  nursePortrait: "/photos/nurse-portrait.jpg",
  motherPortrait: "/photos/mother-portrait.jpg",
  motherExpecting: "/photos/mother-expecting.jpg",
  motherAndBaby: "/photos/mother-and-baby.jpg",
  communityGathering: "/photos/community-gathering.jpg",
  partnersHandshake: "/photos/partners-handshake.jpg",
} as const;
