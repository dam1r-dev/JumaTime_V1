import { defineRouting } from "next-intl/routing";

export const locales = ["kk", "ru", "en"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  kk: "Қазақша",
  ru: "Русский",
  en: "English",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "kk",
  localePrefix: "always",
});
