import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { pickTranslation, formatDate, estimateReadMinutes } from "@/lib/i18n-content";
import { getMosques, getCurrentMosque } from "@/lib/mosque";
import { publishedWhere } from "@/lib/published";
import { SaveSermonButton } from "@/components/site/save-sermon-button";
import { ShareButton } from "@/components/site/share-button";
import { PrintButton } from "@/components/site/print-button";
import { SermonBody } from "@/components/site/sermon-body";

export default async function SermonDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const mosque = await getCurrentMosque(await getMosques());

  const [t, sermon] = await Promise.all([
    getTranslations({ locale, namespace: "SermonDetail" }),
    mosque
      ? prisma.sermon.findFirst({
          where: { slug, ...publishedWhere(), mosqueId: mosque.id },
          include: { translations: true },
        })
      : null,
  ]);

  if (!sermon) notFound();

  const picked = pickTranslation(sermon.translations, l, sermon.originalLocale);
  if (!picked) notFound();

  const { translation, isFallback } = picked;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 print:max-w-none print:bg-white print:px-8">
      <Link
        href="/sermons"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground print:hidden"
      >
        <ArrowLeft className="size-4" />
        {t("back")}
      </Link>

      <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--jt-gold-600)] print:text-black">
        <span>{formatDate(sermon.date, l)}</span>
        <span className="text-muted-foreground print:hidden">·</span>
        <span className="text-muted-foreground print:hidden">
          {estimateReadMinutes(translation.body)} min
        </span>
      </div>

      <h1 className="mt-2 text-3xl font-bold tracking-tight print:text-black">
        {translation.title}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground print:text-black">
        {translation.summary}
      </p>

      {isFallback && (
        <p className="mt-4 rounded-lg border border-[var(--jt-gold-500)]/40 bg-[var(--jt-gold-100)] px-4 py-2 text-sm text-[var(--jt-gold-600)] print:hidden">
          {t("notAvailable")}
        </p>
      )}

      <div className="my-6 flex flex-wrap gap-3 print:hidden">
        <SaveSermonButton
          slug={sermon.slug}
          labels={{
            save: t("save"),
            unsave: t("unsave"),
            savedToast: t("savedToast"),
            unsavedToast: t("unsavedToast"),
          }}
        />
        <ShareButton title={translation.title} label={t("share")} />
        <PrintButton label={t("print")} />
      </div>

      <SermonBody
        text={translation.body}
        labels={{ decrease: t("fontDecrease"), increase: t("fontIncrease") }}
      />

      <p className="mt-10 border-t border-border pt-4 text-xs text-muted-foreground print:hidden">
        {t("originalNote")}
      </p>
    </article>
  );
}
