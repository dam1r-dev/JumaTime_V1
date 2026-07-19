import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pickTranslation } from "@/lib/i18n-content";
import { locales, type Locale } from "@/i18n/routing";

export async function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get("locale");
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : "kk";

  const slugsParam = request.nextUrl.searchParams.get("slugs");
  const slugs = slugsParam ? slugsParam.split(",").filter(Boolean) : undefined;

  const khutbahs = await prisma.khutbah.findMany({
    where: {
      published: true,
      ...(slugs && slugs.length > 0 ? { slug: { in: slugs } } : {}),
    },
    orderBy: { date: "desc" },
    include: { translations: true },
  });

  const items = khutbahs
    .map((k) => {
      const picked = pickTranslation(k.translations, locale, k.originalLocale);
      if (!picked) return null;
      return {
        slug: k.slug,
        date: k.date,
        title: picked.translation.title,
        summary: picked.translation.summary,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return NextResponse.json({ items });
}
