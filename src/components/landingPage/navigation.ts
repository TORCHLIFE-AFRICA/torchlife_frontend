export type NavLink = {
  label: string;
  href: string;
};

/** Items of the "Get Involved" dropdown. Each one has a dedicated page. */
export const GET_INVOLVED_LINKS: readonly NavLink[] = [
  { label: "Support", href: "/get-involved/support" },
  { label: "Create", href: "/get-involved/create" },
  { label: "Partner", href: "/get-involved/partner" },
  { label: "Track", href: "/get-involved/track" },
] as const;

/** Top-level links rendered after the "Get Involved" dropdown. */
export const PRIMARY_NAV_LINKS: readonly NavLink[] = [
  { label: "Featured Cases", href: "/#campaigns" },
  { label: "Browse Campaigns", href: "/campaigns" },
  { label: "About TorchLife", href: "/about" },
] as const;

export const SIGN_IN_HREF = "/auth?auth=signIn";
export const START_CAMPAIGN_HREF =
  "/auth?auth=signIn&returnUrl=%2Fdashboard%3Ftab%3Dcreate-campaign";

/**
 * Marks the link for the page currently being viewed. In-page anchors such as
 * `/#campaigns` are never treated as active because the pathname alone cannot
 * tell which section is in view.
 */
export const isActivePath = (pathname: string, href: string) => {
  if (href.includes("#") || href.includes("?")) {
    return false;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};
