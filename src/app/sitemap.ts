import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { locales, type Locale } from "@/i18n/routing";

// Static public routes only — dynamic sermon pages are left out for now
// (this is a multi-mosque platform, and deciding which mosque's content
// belongs on a shared root sitemap is a separate design question). /qr and
// /saved are excluded on purpose: /qr just displays a QR code for a physical
// poster, and /saved is a per-visitor localStorage list with no indexable
// content of its own.
const STATIC_PATHS = [
  "",
  "sermons",
  "al-kahf",
  "friday-virtues",
] as const;

async function getBaseUrl() {
  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

function localizedUrl(baseUrl: string, locale: Locale, path: string) {
  return path ? `${baseUrl}/${locale}/${path}` : `${baseUrl}/${locale}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getBaseUrl();

  return STATIC_PATHS.map((path) => ({
    url: localizedUrl(baseUrl, "kk", path),
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, localizedUrl(baseUrl, locale, path)])
      ),
    },
  }));
}
