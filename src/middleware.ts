import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    console.log("middleware running");
  // You can add your middleware logic here
  // For example: authentication checks, redirects, response modifications
  const hostname = request.headers.get("host");
  const url = request.nextUrl.clone();
  console.log("Request URL:", url.toString());
  const subdomain = hostname?.split(".")[0];
  console.log("Subdomain:", subdomain);
  // Redirect to a specific subdomain
  if (subdomain === "login") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // This just returns the request as-is (no modifications)
  return NextResponse.next();
}

// Optional: Configure which paths this middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
