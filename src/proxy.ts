
import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Normalize trailing slash
  const normalizedPath =
    pathname === "/" ? "/" : pathname.replace(/\/$/, "");

  // Public pages
  const publicRoutes = [
    "/",
    "/services",
    "/sign-in",
    "/sign-up",
  ];

  if (publicRoutes.includes(normalizedPath)) {
    return NextResponse.next();
  }

  // Check Better Auth session cookie
  const sessionCookie = getSessionCookie(request);

  // Redirect unauthenticated users to Sign In
  if (!sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url);

    // Preserve the original destination
    signInUrl.searchParams.set(
      "callbackURL",
      `${pathname}${search}`,
    );

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};
