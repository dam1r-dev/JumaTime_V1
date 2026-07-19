"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/i18n-content";
import { getSavedSlugs } from "@/lib/saved-khutbahs";

type Item = { slug: string; date: string; title: string; summary: string };

export function SavedKhutbahsList({
  locale,
  emptyLabel,
  browseCtaLabel,
}: {
  locale: Locale;
  emptyLabel: string;
  browseCtaLabel: string;
}) {
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    const slugs = getSavedSlugs();
    const result =
      slugs.length === 0
        ? Promise.resolve({ items: [] as Item[] })
        : fetch(`/api/khutbahs?locale=${locale}&slugs=${slugs.join(",")}`).then((res) =>
            res.json()
          );
    result.then((data) => setItems(data.items)).catch(() => setItems([]));
  }, [locale]);

  if (items === null) return null;

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">{emptyLabel}</p>
        <Link
          href="/khutbahs"
          className="mt-4 inline-block text-sm font-medium text-[var(--jt-green-900)] underline underline-offset-4"
        >
          {browseCtaLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={`/khutbahs/${item.slug}`}
          className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--jt-gold-500)]"
        >
          <p className="text-sm text-[var(--jt-gold-600)]">
            {formatDate(new Date(item.date), locale)}
          </p>
          <h3 className="mt-1 text-lg font-semibold group-hover:text-[var(--jt-green-900)]">
            {item.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {item.summary}
          </p>
        </Link>
      ))}
    </div>
  );
}
