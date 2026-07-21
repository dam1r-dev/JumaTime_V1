import { getTranslations, setRequestLocale } from "next-intl/server";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { pickTranslation, formatDate, estimateReadMinutes } from "@/lib/i18n-content";
import { getMosques, getCurrentMosque } from "@/lib/mosque";
import { PageHeader } from "@/components/site/page-header";
import { Input } from "@/components/ui/input";

export default async function KhutbahsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);
  const l = locale as Locale;

  const mosque = await getCurrentMosque(await getMosques());

  const [t, khutbahs] = await Promise.all([
    getTranslations({ locale, namespace: "Khutbahs" }),
    mosque
      ? prisma.khutbah.findMany({
          where: { published: true, mosqueId: mosque.id },
          orderBy: { date: "desc" },
          include: { translations: true },
        })
      : Promise.resolve([]),
  ]);

  const items = khutbahs
    .map((k) => ({
      khutbah: k,
      content: pickTranslation(k.translations, l, k.originalLocale),
    }))
    .filter((x): x is { khutbah: typeof x.khutbah; content: NonNullable<typeof x.content> } =>
      x.content !== null
    );

  const query = (q ?? "").trim().toLowerCase();
  const filtered = query
    ? items.filter(
        (item) =>
          item.content.translation.title.toLowerCase().includes(query) ||
          formatDate(item.khutbah.date, l).toLowerCase().includes(query)
      )
    : items;

  return (
    <div>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <form className="relative mb-6">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder={t("searchPlaceholder")}
            className="pl-9"
          />
        </form>

        {filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(({ khutbah, content }) => (
              <Link
                key={khutbah.id}
                href={`/khutbahs/${khutbah.slug}`}
                className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--jt-gold-500)]"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--jt-gold-600)]">
                  <span>{formatDate(khutbah.date, l)}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">
                    {estimateReadMinutes(content.translation.body)} min
                  </span>
                </div>
                <h3 className="mt-1 text-lg font-semibold group-hover:text-[var(--jt-green-900)]">
                  {content.translation.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {content.translation.summary}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
