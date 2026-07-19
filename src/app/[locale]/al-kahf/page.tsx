import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookMarked } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { getContentBlocks } from "@/lib/content-blocks";
import { PageHeader } from "@/components/site/page-header";
import { ContentBlockList } from "@/components/site/content-block-list";
import { Button } from "@/components/ui/button";

export default async function AlKahfPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const [t, items] = await Promise.all([
    getTranslations({ locale, namespace: "AlKahf" }),
    getContentBlocks("AL_KAHF", l),
  ]);

  return (
    <div>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="mx-auto max-w-3xl px-4 pt-10">
        <Button
          className="bg-[var(--jt-green-900)] hover:bg-[var(--jt-green-800)]"
          render={
            <a href="https://quran.com/18" target="_blank" rel="noopener noreferrer">
              <BookMarked className="size-4" />
              {t("readFullSurah")}
            </a>
          }
        />
      </div>
      <ContentBlockList
        items={items.map((i) => ({
          title: i.content.translation.title,
          body: i.content.translation.body,
        }))}
      />
    </div>
  );
}
