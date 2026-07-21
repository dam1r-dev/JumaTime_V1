import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { auth } from "./auth";
import { isSessionValid } from "./lib/session-version";

const intlMiddleware = createMiddleware(routing);

// Wrapped with `auth()` (Next.js 16 proxy runs on Node.js, so this is safe —
// unlike classic Edge middleware) so every /admin request is checked here in
// one place: a session that doesn't pass isSessionValid — missing, expired,
// or minted under an older SESSION_VERSION — is sent back to the login page
// before any admin page even starts rendering. The layout keeps its own
// check too (defense in depth for anything reaching it another way), but
// this is what stops a stale-session redirect loop from ever starting.
export default auth((request) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    // The login page does its own (identical) validity check and needs to be
    // reachable regardless of session state — it's the escape hatch.
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    if (!isSessionValid(request.auth)) {
      return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
    }
    return NextResponse.next();
  }

  return intlMiddleware(request);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
