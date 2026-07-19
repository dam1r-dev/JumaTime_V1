import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContentBlocks } from "@/lib/content-blocks";
import { PageHeader } from "@/components/site/page-header";
import { ContentBlockList } from "@/components/site/content-block-list";

export default async function RemindersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const [t, items] = await Promise.all([
    getTranslations({ locale, namespace: "Reminders" }),
    getContentBlocks("REMINDER", l),
  ]);

  return (
    <div>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <ContentBlockList
        items={items.map((i) => ({
          title: i.content.translation.title,
          body: i.content.translation.body,
        }))}
      />
    </div>
  );
}
