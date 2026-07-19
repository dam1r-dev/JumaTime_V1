export function ContentBlockList({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--jt-green-100)] text-xs font-semibold text-[var(--jt-green-900)]">
                {i + 1}
              </span>
              <h3 className="font-semibold">{item.title}</h3>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
