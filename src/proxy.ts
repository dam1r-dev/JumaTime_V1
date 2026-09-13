import createMiddleware from "next-intl/middleware";
import { NextResponse, NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { auth } from "./auth";
import { isSessionValid } from "./lib/session-version";

const intlMiddleware = createMiddleware(routing);

// RSC inlines hydration data in <script> tags, so a strict CSP needs a
// per-request nonce rather than 'unsafe-inline' — see
// https://nextjs.org/docs/app/guides/content-security-policy. Every route in
// this app is already dynamically rendered (no ISR/static pages), which is
// required for nonces to work.
function buildCspHeader(nonce: string) {
  const isDev = process.env.NODE_ENV === "development";
  // style-src stays on 'unsafe-inline' rather than a nonce: Base UI/shadcn set
  // inline `style` attributes at runtime for popover/dialog/select positioning,
  // and CSP nonces only cover <style> elements present at parse time, not
  // programmatic style-attribute mutations — nonce'd style-src breaks that UI.
  // Inline style injection is a much lower-severity vector than inline script
  // injection, which is what script-src's nonce is actually guarding against.
  return `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Wrapped with `auth()` (Next.js 16 proxy runs on Node.js, so this is safe —
// unlike classic Edge middleware) so every /admin request is checked here in
// one place: a session that doesn't pass isSessionValid — missing, expired,
// or minted under an older SESSION_VERSION — is sent back to the login page
// before any admin page even starts rendering. The layout keeps its own
// check too (defense in depth for anything reaching it another way), but
// this is what stops a stale-session redirect loop from ever starting.
export default auth((request) => {
  const { pathname } = request.nextUrl;
  // Read this off the original request — `request.auth` is a property next-auth's
  // wrapper attaches on top of NextRequest, and it won't survive being cloned into
  // a plain `new NextRequest(...)` below.
  const sessionAuth = request.auth;

  // The nonce must reach the page render as a *request* header (so Next.js can tag
  // its own inline/hydration scripts with it) as well as a *response* header (so
  // the browser enforces it). Rebuilding the request is what makes the former work.
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = buildCspHeader(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);
  const requestWithCsp = new NextRequest(request, { headers: requestHeaders });

  function finish(response: NextResponse) {
    response.headers.set("Content-Security-Policy", cspHeader);
    return response;
  }

  if (pathname.startsWith("/admin")) {
    // The login page does its own (identical) validity check and needs to be
    // reachable regardless of session state — it's the escape hatch.
    if (pathname === "/admin/login") {
      return finish(NextResponse.next({ request: requestWithCsp }));
    }
    if (!isSessionValid(sessionAuth)) {
      return finish(NextResponse.redirect(new URL("/admin/login", request.nextUrl)));
    }
    return finish(NextResponse.next({ request: requestWithCsp }));
  }

  return finish(intlMiddleware(requestWithCsp));
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
