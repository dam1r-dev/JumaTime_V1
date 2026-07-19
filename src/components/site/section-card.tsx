import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function SectionCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--jt-gold-500)]"
    >
      <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[var(--jt-green-100)] text-[var(--jt-green-900)] transition-colors group-hover:bg-[var(--jt-gold-100)] group-hover:text-[var(--jt-gold-600)]">
        <Icon className="size-5" />
      </span>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
