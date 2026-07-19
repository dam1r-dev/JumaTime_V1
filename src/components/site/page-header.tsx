export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="relative overflow-hidden bg-[var(--jt-green-900)] text-white">
      <div className="bg-mosque-pattern absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-white/75">{subtitle}</p>
        )}
        <div className="mt-4 h-1 w-16 rounded-full bg-[var(--jt-gold-500)]" />
      </div>
    </div>
  );
}
