import { Badge } from "@/components/ui/badge";
import { getPublishStatus, PUBLISH_STATUS_LABELS } from "@/lib/published";

export function PublishStatusBadge({ publishedAt }: { publishedAt: Date | null }) {
  const status = getPublishStatus(publishedAt);

  if (status === "scheduled") {
    return (
      <Badge
        variant="outline"
        className="border-[var(--jt-gold-500)]/40 text-[var(--jt-gold-600)]"
      >
        {PUBLISH_STATUS_LABELS[status]}
      </Badge>
    );
  }

  return (
    <Badge variant={status === "published" ? "default" : "secondary"}>
      {PUBLISH_STATUS_LABELS[status]}
    </Badge>
  );
}
