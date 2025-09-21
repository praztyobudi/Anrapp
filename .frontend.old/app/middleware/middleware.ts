import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/admin", "/user"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isLoggedIn = !!token;
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_ROUTES.some((p) => pathname.startsWith(p));
  console.log("login status:", isLoggedIn);

  // Belum login tapi akses halaman protected -> redirect ke login
  if (isProtected && !isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Sudah login tapi ke halaman login -> lempar ke dashboard
  if (isLoggedIn && pathname.startsWith("/auth/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/user/:path*",
    "/auth/login",
  ],
};
