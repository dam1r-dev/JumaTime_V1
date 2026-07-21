import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getMosques, getCurrentMosque } from "@/lib/mosque";
import { MosqueSwitcherClient } from "./mosque-switcher-client";

export async function MosqueSwitcher({ locale }: { locale: Locale }) {
  const [t, mosques] = await Promise.all([
    getTranslations({ locale, namespace: "Common" }),
    getMosques(),
  ]);
  const current = await getCurrentMosque(mosques);

  return (
    <MosqueSwitcherClient
      mosques={mosques}
      current={current}
      label={t("mosque")}
    />
  );
}
