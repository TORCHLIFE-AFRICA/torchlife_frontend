const PRODUCTION_SITE_URL = "https://torchlife.co";
const LOCAL_SITE_URL = "http://localhost:3000";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const isLocalhostUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return ["localhost", "127.0.0.1"].includes(parsed.hostname);
  } catch {
    return value.includes("localhost") || value.includes("127.0.0.1");
  }
};

export const getPublicBaseUrl = () => {
  const envUrl = (
    process.env.NEXT_PUBLIC_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    ""
  );

  if (typeof window !== "undefined") {
    const origin = trimTrailingSlash(window.location.origin);
    if (origin && !(process.env.NODE_ENV === "production" && isLocalhostUrl(origin))) {
      return origin;
    }
  }

  if (envUrl && !(process.env.NODE_ENV === "production" && isLocalhostUrl(envUrl))) {
    return trimTrailingSlash(envUrl);
  }

  return process.env.NODE_ENV === "production" ? PRODUCTION_SITE_URL : LOCAL_SITE_URL;
};

export const getPublicUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getPublicBaseUrl()}${path ? normalizedPath : ""}`;
};
