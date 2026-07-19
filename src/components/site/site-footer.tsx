import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Logo } from "./logo";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Footer" });
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-[var(--jt-green-950)] text-white/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center text-sm">
        <Logo className="text-white" />
        <p>{t("tagline")}</p>
        <p className="text-xs text-white/50">
          © {year} Jumma Time — {t("rights")}
        </p>
      </div>
    </footer>
  );
}
