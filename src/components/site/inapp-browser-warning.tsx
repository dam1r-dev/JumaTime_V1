"use client";

import { useSyncExternalStore } from "react";
import { TriangleAlert } from "lucide-react";

// Signatures of common in-app (WebView) browsers. Their localStorage is
// isolated from the device's real browser (Safari/Chrome), so anything
// saved here disappears the moment the visitor leaves the host app.
const IN_APP_UA_PATTERN =
  /Instagram|FBAN|FBAV|Line\/|MicroMessenger|TikTok|Twitter|Telegram/i;

function isInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  return IN_APP_UA_PATTERN.test(navigator.userAgent);
}

function subscribe() {
  return () => {};
}

export function InAppBrowserWarning({ message }: { message: string }) {
  const inApp = useSyncExternalStore(subscribe, isInAppBrowser, () => false);

  if (!inApp) return null;

  return (
    <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-[var(--jt-gold-500)]/40 bg-[var(--jt-gold-100)] px-4 py-3 text-sm text-[var(--jt-gold-600)]">
      <TriangleAlert className="mt-0.5 size-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
