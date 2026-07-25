import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/site/page-header";
import { SavedKhutbahsList } from "@/components/site/saved-khutbahs-list";
import { InAppBrowserWarning } from "@/components/site/inapp-browser-warning";

export default async function SavedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const t = await getTranslations({ locale, namespace: "Saved" });

  return (
    <div>
      <PageHeader title={t("title")} />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <InAppBrowserWarning message={t("inAppWarning")} />
        <SavedKhutbahsList
          locale={l}
          emptyLabel={t("empty")}
          browseCtaLabel={t("browseCta")}
        />
      </div>
    </div>
  );
}
