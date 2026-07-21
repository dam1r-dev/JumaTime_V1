import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Logo } from "./logo";
import { LocaleSwitcher } from "./locale-switcher";
import { MosqueSwitcher } from "./mosque-switcher";
import { MobileNav } from "./mobile-nav";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Nav" });

  const links = [
    { href: "/", label: t("home") },
    { href: "/khutbahs", label: t("khutbahs") },
    { href: "/sunnah", label: t("sunnah") },
    { href: "/recommended-actions", label: t("recommendedActions") },
    { href: "/reminders", label: t("reminders") },
    { href: "/al-kahf", label: t("alKahf") },
    { href: "/friday-virtues", label: t("fridayVirtues") },
    { href: "/saved", label: t("saved") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-[var(--jt-green-900)] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-white">
          <Logo />
        </Link>
        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-white/85 transition-colors hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <MosqueSwitcher locale={locale} />
          <LocaleSwitcher />
          <MobileNav links={links} />
        </div>
      </div>
    </header>
  );
}
