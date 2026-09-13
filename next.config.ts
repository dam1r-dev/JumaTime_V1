import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs/config";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Prevents the site from being framed by another origin
          // (clickjacking) — nothing here needs to be embedded elsewhere.
          { key: "X-Frame-Options", value: "DENY" },
          // Stops browsers from MIME-sniffing a response away from the
          // declared Content-Type.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't leak the full URL (which can carry query params) to
          // third-party sites linked from ours.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // This app uses none of these browser features anywhere.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

// org/project/authToken are unset until a Sentry project exists — the
// source-map upload step just silently skips itself without them (it needs
// SENTRY_AUTH_TOKEN specifically, not the runtime SENTRY_DSN used above).
export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
});
