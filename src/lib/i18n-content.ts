import type { Locale } from "@/i18n/routing";

type Translated<T> = T & { locale: string };

/** Picks the translation matching `locale`, falling back to the original locale, then any available one. */
export function pickTranslation<T extends { locale: string }>(
  translations: T[],
  locale: Locale,
  originalLocale?: string
): { translation: Translated<T>; isFallback: boolean } | null {
  if (translations.length === 0) return null;

  const exact = translations.find((t) => t.locale === locale);
  if (exact) return { translation: exact, isFallback: false };

  const original = originalLocale
    ? translations.find((t) => t.locale === originalLocale)
    : undefined;
  if (original) return { translation: original, isFallback: true };

  return { translation: translations[0], isFallback: true };
}

// Formatted manually (not via Intl.DateTimeFormat) because kk-KZ month names are
// missing from the ICU data bundled with some browsers, which silently falls back
// to a "M07"-style pattern instead of throwing. This keeps output identical on
// server and client regardless of the runtime's ICU completeness.
const monthNames: Record<Locale, string[]> = {
  kk: [
    "қаңтар",
    "ақпан",
    "наурыз",
    "сәуір",
    "мамыр",
    "маусым",
    "шілде",
    "тамыз",
    "қыркүйек",
    "қазан",
    "қараша",
    "желтоқсан",
  ],
  ru: [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

export function formatDate(date: Date, locale: Locale) {
  const day = date.getUTCDate();
  const month = monthNames[locale][date.getUTCMonth()];
  const year = date.getUTCFullYear();

  if (locale === "kk") return `${year} ж. ${day} ${month}`;
  if (locale === "ru") return `${day} ${month} ${year} г.`;
  return `${month} ${day}, ${year}`;
}

export function estimateReadMinutes(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}
