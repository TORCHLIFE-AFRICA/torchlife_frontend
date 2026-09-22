/**
 * Outbound contact routes shared by every public page, so a changed invite or
 * inbox is updated in one place.
 */

/** The TorchLife community group on WhatsApp. */
export const COMMUNITY_WHATSAPP_URL =
  "https://chat.whatsapp.com/LXYK97kPy0CJ8nfQDfc7v9?mode=gi_t";

/**
 * Pre-filled so a first message to the partnerships inbox arrives with the
 * three things TorchLife needs in order to reply usefully.
 */
export const PARTNER_MAILTO = `mailto:partner@torchlife.co?subject=${encodeURIComponent(
  "Partnering with TorchLife",
)}&body=${encodeURIComponent(
  [
    "Hello TorchLife team,",
    "",
    "We would like to explore partnering with you.",
    "",
    "Organization:",
    "Where we think we can help:",
    "Best person to contact:",
    "",
    "Thank you,",
  ].join("\n"),
)}`;
