import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  BookOpen,
  CalendarCheck,
  ListChecks,
  Bell,
  Sparkles,
  BookMarked,
  QrCode,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { pickTranslation, formatDate } from "@/lib/i18n-content";
import { getMosques, getCurrentMosque } from "@/lib/mosque";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/site/section-card";
import { Badge } from "@/components/ui/badge";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const mosque = await getCurrentMosque(await getMosques());

  const [t, home, sectionDesc, latest] = await Promise.all([
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Home" }),
    getTranslations({ locale, namespace: "Sections" }),
    mosque
      ? prisma.khutbah.findFirst({
          where: { published: true, mosqueId: mosque.id },
          orderBy: { date: "desc" },
          include: { translations: true },
        })
      : null,
  ]);

  const latestContent = latest
    ? pickTranslation(latest.translations, l, latest.originalLocale)
    : null;

  const sections = [
    { href: "/khutbahs", icon: BookOpen, title: t("khutbahs"), description: sectionDesc("khutbahs") },
    { href: "/sunnah", icon: Sparkles, title: t("sunnah"), description: sectionDesc("sunnah") },
    { href: "/recommended-actions", icon: ListChecks, title: t("recommendedActions"), description: sectionDesc("recommendedActions") },
    { href: "/reminders", icon: Bell, title: t("reminders"), description: sectionDesc("reminders") },
    { href: "/al-kahf", icon: BookMarked, title: t("alKahf"), description: sectionDesc("alKahf") },
    { href: "/friday-virtues", icon: CalendarCheck, title: t("fridayVirtues"), description: sectionDesc("fridayVirtues") },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-[var(--jt-green-900)] text-white">
        <div className="bg-mosque-pattern absolute inset-0 opacity-40" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-20 text-center">
          <Badge className="bg-[var(--jt-gold-500)] text-[var(--jt-ink)] hover:bg-[var(--jt-gold-500)]">
            {home("badge")}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {home("title")}
          </h1>
          <p className="max-w-xl text-lg text-white/85">{home("subtitle")}</p>
          <p className="max-w-xl text-sm text-white/60">{home("description")}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-[var(--jt-gold-500)] text-[var(--jt-ink)] hover:bg-[var(--jt-gold-400)]"
              render={<Link href="/khutbahs">{home("browseCta")}</Link>}
            />
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              render={
                <Link href="/qr">
                  <QrCode className="size-4" />
                  {home("qrCta")}
                </Link>
              }
            />
          </div>
        </div>
      </section>

      {latest && latestContent && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="mb-4 text-xl font-semibold">
            {home("latestKhutbahTitle")}
          </h2>
          <Link
            href={`/khutbahs/${latest.slug}`}
            className="block rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-sm text-[var(--jt-gold-600)]">
              {formatDate(latest.date, l)}
            </p>
            <h3 className="mt-1 text-lg font-semibold">
              {latestContent.translation.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {latestContent.translation.summary}
            </p>
          </Link>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-4 text-xl font-semibold">{home("sectionsTitle")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <SectionCard
              key={s.href}
              href={s.href}
              icon={s.icon}
              title={s.title}
              description={s.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
