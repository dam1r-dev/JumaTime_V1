import * as Sentry from "@sentry/nextjs";

// Client bundles only ever see NEXT_PUBLIC_-prefixed env vars — this is
// deliberately a separate variable from the server-side SENTRY_DSN (same
// value once a project exists, but never source the browser build from a
// non-public var name, or a future refactor could leak something else
// under that name into the bundle).
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
