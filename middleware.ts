import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Skip maintenance check for these paths
  const skipPaths = ["/maintenance", "/api/", "/_next/", "/favicon", "/robots.txt", "/sitemap.xml"];

  const pathname = request.nextUrl.pathname;

  // Check if path should be skipped
  if (skipPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  try {
    // Read maintenance config from file system
    // Note: In middleware, we can't use fs, so we'll use fetch to our API
    const baseUrl = request.nextUrl.origin;
    const res = await fetch(`${baseUrl}/api/maintenance`, {
      cache: "no-store",
    });

    const data = await res.json();

    // If maintenance mode is enabled, redirect to maintenance page
    if (data.enabled) {
      // Check if IP is allowed (for admin access)
      const clientIP = request.ip || request.headers.get("x-forwarded-for") || "";
      const allowedIPs = data.allowedIPs || [];

      if (!allowedIPs.includes(clientIP)) {
        return NextResponse.redirect(new URL("/maintenance", request.url));
      }
    }
  } catch (error) {
    // If there's an error, allow access
    console.error("Maintenance check error:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/).*)",
  ],
};
