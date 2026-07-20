export function AyahList({
  items,
  labels,
}: {
  items: {
    number: number;
    arabic: string;
    transliteration: string;
    translation: string;
  }[];
  labels: { transliteration: string; translation: string };
}) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((ayah) => (
        <div
          key={ayah.number}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <span className="mb-3 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--jt-green-100)] text-xs font-semibold text-[var(--jt-green-900)]">
            {ayah.number}
          </span>
          <p
            dir="rtl"
            lang="ar"
            className="text-right text-2xl leading-loose"
          >
            {ayah.arabic}
          </p>
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-xs font-medium tracking-wide text-[var(--jt-gold-600)] uppercase">
              {labels.transliteration}
            </p>
            <p className="mt-1 italic leading-relaxed text-muted-foreground">
              {ayah.transliteration}
            </p>
          </div>
          <div className="mt-3">
            <p className="text-xs font-medium tracking-wide text-[var(--jt-gold-600)] uppercase">
              {labels.translation}
            </p>
            <p className="mt-1 leading-relaxed">{ayah.translation}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
