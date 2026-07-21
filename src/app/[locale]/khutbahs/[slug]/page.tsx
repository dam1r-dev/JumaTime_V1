import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { pickTranslation, formatDate, estimateReadMinutes } from "@/lib/i18n-content";
import { getMosques, getCurrentMosque } from "@/lib/mosque";
import { SaveKhutbahButton } from "@/components/site/save-khutbah-button";
import { ShareButton } from "@/components/site/share-button";

export default async function KhutbahDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const mosque = await getCurrentMosque(await getMosques());

  const [t, khutbah] = await Promise.all([
    getTranslations({ locale, namespace: "KhutbahDetail" }),
    mosque
      ? prisma.khutbah.findFirst({
          where: { slug, published: true, mosqueId: mosque.id },
          include: { translations: true },
        })
      : null,
  ]);

  if (!khutbah) notFound();

  const picked = pickTranslation(khutbah.translations, l, khutbah.originalLocale);
  if (!picked) notFound();

  const { translation, isFallback } = picked;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/khutbahs"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t("back")}
      </Link>

      <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--jt-gold-600)]">
        <span>{formatDate(khutbah.date, l)}</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">
          {estimateReadMinutes(translation.body)} min
        </span>
      </div>

      <h1 className="mt-2 text-3xl font-bold tracking-tight">{translation.title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{translation.summary}</p>

      {isFallback && (
        <p className="mt-4 rounded-lg border border-[var(--jt-gold-500)]/40 bg-[var(--jt-gold-100)] px-4 py-2 text-sm text-[var(--jt-gold-600)]">
          {t("notAvailable")}
        </p>
      )}

      <div className="my-6 flex flex-wrap gap-3">
        <SaveKhutbahButton
          slug={khutbah.slug}
          labels={{
            save: t("save"),
            unsave: t("unsave"),
            savedToast: t("savedToast"),
            unsavedToast: t("unsavedToast"),
          }}
        />
        <ShareButton title={translation.title} label={t("share")} />
      </div>

      <div className="prose prose-neutral max-w-none whitespace-pre-wrap leading-relaxed">
        {translation.body}
      </div>

      <p className="mt-10 border-t border-border pt-4 text-xs text-muted-foreground">
        {t("originalNote")}
      </p>
    </article>
  );
}
