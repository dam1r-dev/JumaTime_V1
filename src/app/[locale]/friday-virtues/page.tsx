import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContentBlocks } from "@/lib/content-blocks";
import { getMosques, getCurrentMosque } from "@/lib/mosque";
import { PageHeader } from "@/components/site/page-header";
import { ContentBlockList } from "@/components/site/content-block-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sunnah, recommended actions, and reminders/facts used to be their own
// top-level nav items — merged in here as tabs since 6 nav items was too
// many for what's a handful of short lists each (see chat 2026-09-15).
const TABS = [
  { category: "FRIDAY_VIRTUE", labelKey: "tabVirtue" },
  { category: "SUNNAH", labelKey: "tabSunnah" },
  { category: "RECOMMENDED_ACTION", labelKey: "tabRecommended" },
  { category: "REMINDER", labelKey: "tabFacts" },
] as const;

export default async function FridayVirtuesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const mosque = await getCurrentMosque(await getMosques());

  const [t, itemsByCategory] = await Promise.all([
    getTranslations({ locale, namespace: "FridayVirtues" }),
    mosque
      ? Promise.all(TABS.map((tab) => getContentBlocks(tab.category, l, mosque.id)))
      : Promise.resolve(TABS.map(() => [])),
  ]);

  return (
    <div>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Tabs defaultValue={TABS[0].category}>
        <div className="mx-auto max-w-3xl px-4 pt-8">
          <TabsList className="flex-wrap">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.category} value={tab.category}>
                {t(tab.labelKey)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {TABS.map((tab, i) => (
          <TabsContent key={tab.category} value={tab.category}>
            <ContentBlockList
              items={itemsByCategory[i].map((item) => ({
                title: item.content.translation.title,
                body: item.content.translation.body,
              }))}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
