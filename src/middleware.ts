import { type NextRequest, NextResponse } from "next/server";
import { rootDomain } from "@/lib/utils";

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  // Local development environment
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    // Fallback to host header approach
    if (hostname.includes(".localhost")) {
      return hostname.split(".")[0];
    }

    return null;
  }

  // Production environment
  const rootDomainFormatted = rootDomain.split(":")[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    const parts = hostname.split("---");
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, "") : null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  // If we're on the main domain and trying to access /login, redirect to login subdomain
  if (!subdomain && pathname === "/login") {
    const host = request.headers.get("host") || "";

    // Create login subdomain URL
    const loginUrl = new URL(request.url);
    loginUrl.host = `login.${host.split(":")[0]}`;

    // Keep the port if it exists in the original URL
    if (host.includes(":")) {
      const port = host.split(":")[1];
      loginUrl.port = port;
    }

    // Remove the /login path since it will be at the root of the login subdomain
    loginUrl.pathname = "/";

    return NextResponse.redirect(loginUrl);
  }

  // If we're on the login subdomain
  if (subdomain === "login") {
    // Rewrite to serve the login page content at the root
    return NextResponse.rewrite(new URL(`/login`, request.url));
  }

  if (subdomain) {
    // Additional subdomain handling
    if (pathname.startsWith("/admin")) {
      // Block access to admin from subdomains
      return NextResponse.redirect(new URL("/", request.url));
    }

    // For the root path on a subdomain, rewrite to the subdomain page
    if (pathname === "/") {
      return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url));
    }
  }

  // On the root domain, allow normal access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|[\\w-]+\\.\\w+).*)",
  ],
};
