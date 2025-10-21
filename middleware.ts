// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/:path*"], // match all; we'll filter inside
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") || "";

  // Skip Next internals & assets
  if (
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname === "/og.jpg" ||
    /\.(png|svg|jpg|jpeg|gif|webp)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // If on app subdomain and path is /privacy, send to canonical landing URL
  if (host.startsWith("app.statbase.eu") && pathname.startsWith("/privacy")) {
    return NextResponse.redirect("https://statbase.eu/privacy");
  }

  // Gate all other pages on app subdomain (except API)
  if (host.startsWith("app.statbase.eu")) {
    if (pathname.startsWith("/api/")) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = "/gate";
    url.search = "";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}