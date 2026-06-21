import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type SessionInfo = {
  hasSession: boolean;
  userId?: string;
};

function decodeJwtPayload(token?: string): Record<string, unknown> | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const normalized = payload.padEnd(Math.ceil(payload.length / 4) * 4, "=");
    return JSON.parse(atob(normalized)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getSessionInfo(req: NextRequest): SessionInfo {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const payload = decodeJwtPayload(accessToken);
  const userId = typeof payload?.sub === "string" ? payload.sub : undefined;

  return {
    hasSession: Boolean(accessToken || refreshToken),
    userId,
  };
}

export function middleware(req: NextRequest) {
  const host = req.headers.get("host");
  const { pathname, search } = req.nextUrl;
  const { hasSession, userId } = getSessionInfo(req);

  if (host === "touchlife.africa" || host === "www.touchlife.africa") {
    if (pathname !== "/") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (pathname.startsWith("/campaign/")) {
    return NextResponse.next();
  }

  if (pathname === "/campaigns" && hasSession) {
    return NextResponse.redirect(new URL("/dashboard?tab=campaigns", req.url));
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/user/") || pathname.startsWith("/admin")) {
    if (!hasSession) {
      const signInUrl = new URL("/auth?auth=signIn", req.url);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  if (pathname === "/auth" || pathname.startsWith("/auth/")) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/" && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (host === "app.touchlife.africa") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/campaigns", "/auth/:path*", "/campaign/:path*", "/dashboard/:path*", "/user/:path*", "/admin/:path*"],
};
