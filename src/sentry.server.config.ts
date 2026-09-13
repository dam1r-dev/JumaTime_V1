import * as Sentry from "@sentry/nextjs";

// SENTRY_DSN is unset until a Sentry project exists — Sentry.init() no-ops
// gracefully with an empty dsn, so this is safe to ship inactive.
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
});
