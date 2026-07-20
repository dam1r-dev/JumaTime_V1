import { getTranslations, setRequestLocale } from "next-intl/server";
import { ExternalLink } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { getContentBlocks } from "@/lib/content-blocks";
import { pickTranslation } from "@/lib/i18n-content";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/site/page-header";
import { ContentBlockList } from "@/components/site/content-block-list";
import { AyahList } from "@/components/site/ayah-list";

export default async function AlKahfPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const [t, items, ayahs] = await Promise.all([
    getTranslations({ locale, namespace: "AlKahf" }),
    getContentBlocks("AL_KAHF", l),
    prisma.quranAyah.findMany({
      where: { surahNumber: 18 },
      orderBy: { ayahNumber: "asc" },
      include: { translations: true },
    }),
  ]);

  const ayahItems = ayahs
    .map((ayah) => {
      const picked = pickTranslation(ayah.translations, l, "ru");
      if (!picked) return null;
      return {
        number: ayah.ayahNumber,
        arabic: ayah.textArabic,
        transliteration: ayah.transliteration,
        translation: picked.translation.text,
      };
    })
    .filter((a): a is NonNullable<typeof a> => a !== null);

  return (
    <div>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <ContentBlockList
        items={items.map((i) => ({
          title: i.content.translation.title,
          body: i.content.translation.body,
        }))}
      />
      <div className="mx-auto max-w-3xl px-4 pb-10">
        <AyahList
          items={ayahItems}
          labels={{
            transliteration: t("transliteration"),
            translation: t("translation"),
          }}
        />
        <a
          href="https://quran.com/18"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ExternalLink className="size-4" />
          {t("openExternal")}
        </a>
      </div>
    </div>
  );
}
